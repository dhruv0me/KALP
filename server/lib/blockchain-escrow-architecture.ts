/**
 * KALP Blockchain & Payment Architecture Foundation
 *
 * ARCHITECTURAL PRINCIPLES (Strict Compliance):
 * 1. Traditional fiat payments (INR, USD, EUR) cannot automatically be held inside
 *    an ordinary smart contract on-chain.
 * 2. Payment processing, fiat bank settlement, and blockchain escrow are strictly
 *    isolated into independent components.
 * 3. Never simulate successful transactions or falsely claim on-chain escrow
 *    is active before live contracts are deployed and verified.
 */

export interface EscrowReleaseCondition {
  milestoneId: string;
  campaignId: string;
  proposedBudget: number;
  currency: string;
  completionStatus: "pending" | "in_progress" | "completed";
  adminApprovalStatus: "pending" | "approved" | "rejected";
  verifiedReceiptsCount: number;
  approvedByAdminEmail: string | null;
  approvedAt: string | null;
}

export interface BlockchainProofReceipt {
  network: "polygon" | "arbitrum" | "ethereum_sepolia" | "none";
  contractAddress: string | null;
  milestoneHash: string;
  merkleRoot: string | null;
  onChainStatus: "uncommitted" | "pending_tx" | "anchored";
  txHash: string | null;
}

/**
 * Validates whether a milestone satisfies real compliance conditions
 * before any funds release can be scheduled or executed.
 */
export function validateMilestoneFundReleaseConditions(condition: EscrowReleaseCondition): {
  eligibleForRelease: boolean;
  blockers: string[];
} {
  const blockers: string[] = [];

  if (condition.completionStatus !== "completed") {
    blockers.push("Milestone progress has not been marked as completed by the student team.");
  }
  if (condition.adminApprovalStatus !== "approved") {
    blockers.push("Independent administrative verification is pending.");
  }
  if (condition.verifiedReceiptsCount < 1) {
    blockers.push("No verified expense documentation or vendor receipts are attached.");
  }

  return {
    eligibleForRelease: blockers.length === 0,
    blockers,
  };
}

/**
 * Interface specification for EVM Milestone Escrow Smart Contracts
 * (e.g. Solidity ERC-20 / USDC Escrow contract on Polygon PoS).
 */
export const ESCROW_SMART_CONTRACT_ABI = [
  "function createCampaignEscrow(string memory campaignId, address coordinator, uint256 targetAmount) external returns (bytes32)",
  "function recordMilestoneProof(bytes32 escrowId, string memory milestoneId, bytes32 proofHash) external",
  "function releaseMilestoneTranche(bytes32 escrowId, string memory milestoneId, uint256 amount) external",
  "function triggerDonorRefund(bytes32 escrowId, address donor, uint256 amount) external",
  "event MilestoneProofAnchored(bytes32 indexed escrowId, string milestoneId, bytes32 proofHash)",
  "event TrancheReleased(bytes32 indexed escrowId, string milestoneId, uint256 amount, address recipient)",
  "event RefundProcessed(bytes32 indexed escrowId, address donor, uint256 amount)",
] as const;

