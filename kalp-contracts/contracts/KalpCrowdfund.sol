// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title KalpCrowdfund
 * @notice Milestone-based ETH crowdfunding for campus projects.
 *
 * Flow:
 *  1. A creator opens a campaign with a funding goal, a deadline and a list of
 *     milestones (each milestone is a share of the funds, in basis points).
 *  2. Anyone contributes ETH until the deadline.
 *  3. If the goal is NOT reached by the deadline, every contributor can refund.
 *  4. If the goal IS reached, the verifier (e.g. a campus admin or multisig)
 *     approves milestones one by one. After each approval the creator can
 *     withdraw that milestone's share.
 *  5. If a campaign is cancelled, contributors can refund their share of the
 *     funds that have not been released yet.
 *
 * Every step emits an event, so anyone can audit a campaign on Etherscan.
 *
 * NOTE: This is a starter version. Get it reviewed/audited before holding real money.
 */
contract KalpCrowdfund is Ownable, ReentrancyGuard {
    uint256 public constant BPS = 10_000;
    uint256 public constant MAX_MILESTONES = 20;

    struct Campaign {
        address creator;
        uint256 goal; // in wei
        uint256 deadline; // unix timestamp
        uint256 totalRaised; // in wei
        uint256 released; // wei already withdrawn by creator
        uint8 milestoneCount;
        uint8 milestonesApproved;
        uint8 milestonesWithdrawn;
        bool cancelled;
        string metadataURI; // e.g. IPFS link with title, description, budget docs
    }

    /// @notice Address allowed to approve milestones and cancel campaigns.
    address public verifier;

    uint256 public campaignCount;

    mapping(uint256 => Campaign) private _campaigns;
    mapping(uint256 => uint16[]) private _milestoneBps;
    mapping(uint256 => mapping(address => uint256)) public contributions;

    event CampaignCreated(
        uint256 indexed id,
        address indexed creator,
        uint256 goal,
        uint256 deadline,
        string metadataURI
    );
    event Contributed(uint256 indexed id, address indexed backer, uint256 amount);
    event MilestoneApproved(uint256 indexed id, uint8 indexed milestone);
    event MilestoneWithdrawn(uint256 indexed id, uint8 indexed milestone, uint256 amount);
    event CampaignCancelled(uint256 indexed id);
    event Refunded(uint256 indexed id, address indexed backer, uint256 amount);
    event VerifierChanged(address indexed oldVerifier, address indexed newVerifier);

    error InvalidGoal();
    error InvalidDeadline();
    error InvalidMilestones();
    error CampaignNotFound();
    error CampaignEnded();
    error CampaignCancelledError();
    error NotVerifier();
    error NotCreator();
    error GoalNotReached();
    error NothingToDo();
    error NoContribution();
    error TransferFailed();
    error ZeroAddress();

    modifier onlyVerifier() {
        if (msg.sender != verifier) revert NotVerifier();
        _;
    }

    constructor(address initialOwner, address initialVerifier) Ownable(initialOwner) {
        if (initialVerifier == address(0)) revert ZeroAddress();
        verifier = initialVerifier;
        emit VerifierChanged(address(0), initialVerifier);
    }

    // ------------------------------------------------------------------
    // Admin
    // ------------------------------------------------------------------

    function setVerifier(address newVerifier) external onlyOwner {
        if (newVerifier == address(0)) revert ZeroAddress();
        emit VerifierChanged(verifier, newVerifier);
        verifier = newVerifier;
    }

    // ------------------------------------------------------------------
    // Campaign lifecycle
    // ------------------------------------------------------------------

    /**
     * @param goal Funding goal in wei.
     * @param deadline Unix timestamp when contributions close.
     * @param milestoneBps Share of funds for each milestone, in basis points.
     *        Must add up to exactly 10_000 (100%).
     * @param metadataURI Link to off-chain details (title, description, budget).
     */
    function createCampaign(
        uint256 goal,
        uint256 deadline,
        uint16[] calldata milestoneBps,
        string calldata metadataURI
    ) external returns (uint256 id) {
        if (goal == 0) revert InvalidGoal();
        if (deadline <= block.timestamp) revert InvalidDeadline();
        uint256 n = milestoneBps.length;
        if (n == 0 || n > MAX_MILESTONES) revert InvalidMilestones();

        uint256 sum;
        for (uint256 i = 0; i < n; i++) {
            if (milestoneBps[i] == 0) revert InvalidMilestones();
            sum += milestoneBps[i];
        }
        if (sum != BPS) revert InvalidMilestones();

        id = ++campaignCount;
        Campaign storage c = _campaigns[id];
        c.creator = msg.sender;
        c.goal = goal;
        c.deadline = deadline;
        c.milestoneCount = uint8(n);
        c.metadataURI = metadataURI;
        _milestoneBps[id] = milestoneBps;

        emit CampaignCreated(id, msg.sender, goal, deadline, metadataURI);
    }

    function contribute(uint256 id) external payable {
        Campaign storage c = _getCampaign(id);
        if (c.cancelled) revert CampaignCancelledError();
        if (block.timestamp >= c.deadline) revert CampaignEnded();
        if (msg.value == 0) revert NothingToDo();

        c.totalRaised += msg.value;
        contributions[id][msg.sender] += msg.value;

        emit Contributed(id, msg.sender, msg.value);
    }

    /// @notice Verifier confirms the next milestone has been completed.
    function approveMilestone(uint256 id) external onlyVerifier {
        Campaign storage c = _getCampaign(id);
        if (c.cancelled) revert CampaignCancelledError();
        if (!_goalReached(c)) revert GoalNotReached();
        if (block.timestamp < c.deadline) revert NothingToDo(); // funding still open
        if (c.milestonesApproved >= c.milestoneCount) revert NothingToDo();

        c.milestonesApproved += 1;
        emit MilestoneApproved(id, c.milestonesApproved);
    }

    /// @notice Creator withdraws every milestone that is approved but not yet withdrawn.
    function withdraw(uint256 id) external nonReentrant {
        Campaign storage c = _getCampaign(id);
        if (msg.sender != c.creator) revert NotCreator();
        if (c.cancelled) revert CampaignCancelledError();
        if (c.milestonesWithdrawn >= c.milestonesApproved) revert NothingToDo();

        uint256 amount;
        uint256 total = c.totalRaised;
        uint16[] storage shares = _milestoneBps[id];
        uint8 from = c.milestonesWithdrawn;
        uint8 to = c.milestonesApproved;

        for (uint8 i = from; i < to; i++) {
            uint256 part;
            // The last milestone takes the remainder so no wei is left behind.
            if (i == c.milestoneCount - 1) {
                part = total - c.released - amount;
            } else {
                part = (total * shares[i]) / BPS;
            }
            amount += part;
            emit MilestoneWithdrawn(id, i + 1, part);
        }

        c.milestonesWithdrawn = to;
        c.released += amount;

        (bool ok, ) = c.creator.call{value: amount}("");
        if (!ok) revert TransferFailed();
    }

    /// @notice Verifier can cancel a campaign. Backers then refund what is unreleased.
    function cancelCampaign(uint256 id) external onlyVerifier {
        Campaign storage c = _getCampaign(id);
        if (c.cancelled) revert CampaignCancelledError();
        c.cancelled = true;
        emit CampaignCancelled(id);
    }

    /**
     * @notice Refund for a failed or cancelled campaign.
     *  - Failed (deadline passed, goal not reached): full contribution back.
     *  - Cancelled: your share of whatever has not been released to the creator.
     */
    function refund(uint256 id) external nonReentrant {
        Campaign storage c = _getCampaign(id);

        bool failed = block.timestamp >= c.deadline && !_goalReached(c);
        if (!failed && !c.cancelled) revert NothingToDo();

        uint256 contributed = contributions[id][msg.sender];
        if (contributed == 0) revert NoContribution();

        contributions[id][msg.sender] = 0;

        uint256 amount = contributed;
        if (c.cancelled && c.released > 0) {
            // Proportional share of the funds still held by the contract.
            amount = (contributed * (c.totalRaised - c.released)) / c.totalRaised;
        }

        (bool ok, ) = msg.sender.call{value: amount}("");
        if (!ok) revert TransferFailed();

        emit Refunded(id, msg.sender, amount);
    }

    // ------------------------------------------------------------------
    // Views
    // ------------------------------------------------------------------

    function getCampaign(uint256 id) external view returns (Campaign memory) {
        return _getCampaign(id);
    }

    function getMilestoneBps(uint256 id) external view returns (uint16[] memory) {
        _getCampaign(id);
        return _milestoneBps[id];
    }

    function goalReached(uint256 id) external view returns (bool) {
        return _goalReached(_getCampaign(id));
    }

    // ------------------------------------------------------------------
    // Internal
    // ------------------------------------------------------------------

    function _getCampaign(uint256 id) internal view returns (Campaign storage c) {
        c = _campaigns[id];
        if (c.creator == address(0)) revert CampaignNotFound();
    }

    function _goalReached(Campaign storage c) internal view returns (bool) {
        return c.totalRaised >= c.goal;
    }
}
