const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time, loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("KalpCrowdfund", function () {
  const GOAL = ethers.parseEther("10");
  const DAY = 24 * 60 * 60;

  async function deployFixture() {
    const [owner, verifier, creator, alice, bob, stranger] = await ethers.getSigners();
    const Kalp = await ethers.getContractFactory("KalpCrowdfund");
    const kalp = await Kalp.deploy(owner.address, verifier.address);
    await kalp.waitForDeployment();
    return { kalp, owner, verifier, creator, alice, bob, stranger };
  }

  async function campaignFixture() {
    const ctx = await deployFixture();
    const deadline = (await time.latest()) + 7 * DAY;
    // 3 milestones: 30% / 30% / 40%
    await ctx.kalp
      .connect(ctx.creator)
      .createCampaign(GOAL, deadline, [3000, 3000, 4000], "ipfs://campaign-1");
    return { ...ctx, deadline, id: 1n };
  }

  describe("createCampaign", function () {
    it("stores the campaign and emits an event", async function () {
      const { kalp, creator } = await loadFixture(deployFixture);
      const deadline = (await time.latest()) + DAY;
      await expect(kalp.connect(creator).createCampaign(GOAL, deadline, [10000], "ipfs://x"))
        .to.emit(kalp, "CampaignCreated")
        .withArgs(1n, creator.address, GOAL, deadline, "ipfs://x");

      const c = await kalp.getCampaign(1);
      expect(c.creator).to.equal(creator.address);
      expect(c.goal).to.equal(GOAL);
      expect(c.milestoneCount).to.equal(1);
    });

    it("rejects bad input", async function () {
      const { kalp, creator } = await loadFixture(deployFixture);
      const future = (await time.latest()) + DAY;
      await expect(kalp.connect(creator).createCampaign(0, future, [10000], "")).to.be.revertedWithCustomError(kalp, "InvalidGoal");
      await expect(kalp.connect(creator).createCampaign(GOAL, 1, [10000], "")).to.be.revertedWithCustomError(kalp, "InvalidDeadline");
      await expect(kalp.connect(creator).createCampaign(GOAL, future, [], "")).to.be.revertedWithCustomError(kalp, "InvalidMilestones");
      await expect(kalp.connect(creator).createCampaign(GOAL, future, [5000, 4000], "")).to.be.revertedWithCustomError(kalp, "InvalidMilestones");
      await expect(kalp.connect(creator).createCampaign(GOAL, future, [0, 10000], "")).to.be.revertedWithCustomError(kalp, "InvalidMilestones");
    });
  });

  describe("contribute", function () {
    it("tracks contributions and emits an event", async function () {
      const { kalp, alice, id } = await loadFixture(campaignFixture);
      const amount = ethers.parseEther("2");
      await expect(kalp.connect(alice).contribute(id, { value: amount }))
        .to.emit(kalp, "Contributed")
        .withArgs(id, alice.address, amount);
      expect(await kalp.contributions(id, alice.address)).to.equal(amount);
      expect((await kalp.getCampaign(id)).totalRaised).to.equal(amount);
    });

    it("rejects zero value, unknown campaigns and late contributions", async function () {
      const { kalp, alice, deadline, id } = await loadFixture(campaignFixture);
      await expect(kalp.connect(alice).contribute(id, { value: 0 })).to.be.revertedWithCustomError(kalp, "NothingToDo");
      await expect(kalp.connect(alice).contribute(99, { value: 1 })).to.be.revertedWithCustomError(kalp, "CampaignNotFound");
      await time.increaseTo(deadline);
      await expect(kalp.connect(alice).contribute(id, { value: 1 })).to.be.revertedWithCustomError(kalp, "CampaignEnded");
    });
  });

  describe("failed campaign", function () {
    it("lets backers get a full refund when the goal is missed", async function () {
      const { kalp, alice, bob, deadline, id } = await loadFixture(campaignFixture);
      await kalp.connect(alice).contribute(id, { value: ethers.parseEther("2") });
      await kalp.connect(bob).contribute(id, { value: ethers.parseEther("3") });

      // Cannot refund while the campaign is still running
      await expect(kalp.connect(alice).refund(id)).to.be.revertedWithCustomError(kalp, "NothingToDo");

      await time.increaseTo(deadline);
      await expect(kalp.connect(alice).refund(id)).to.changeEtherBalances(
        [alice, kalp],
        [ethers.parseEther("2"), -ethers.parseEther("2")]
      );
      // Cannot refund twice
      await expect(kalp.connect(alice).refund(id)).to.be.revertedWithCustomError(kalp, "NoContribution");
    });
  });

  describe("successful campaign", function () {
    async function fundedFixture() {
      const ctx = await campaignFixture();
      await ctx.kalp.connect(ctx.alice).contribute(ctx.id, { value: ethers.parseEther("6") });
      await ctx.kalp.connect(ctx.bob).contribute(ctx.id, { value: ethers.parseEther("4") });
      await time.increaseTo(ctx.deadline);
      return ctx;
    }

    it("only the verifier can approve milestones", async function () {
      const { kalp, stranger, creator, id } = await loadFixture(fundedFixture);
      await expect(kalp.connect(stranger).approveMilestone(id)).to.be.revertedWithCustomError(kalp, "NotVerifier");
      await expect(kalp.connect(creator).approveMilestone(id)).to.be.revertedWithCustomError(kalp, "NotVerifier");
    });

    it("cannot approve before the goal is reached or while funding is open", async function () {
      const { kalp, verifier, alice, creator } = await loadFixture(deployFixture);
      const deadline = (await time.latest()) + DAY;
      await kalp.connect(creator).createCampaign(GOAL, deadline, [10000], "");
      await kalp.connect(alice).contribute(1, { value: GOAL });
      await expect(kalp.connect(verifier).approveMilestone(1)).to.be.revertedWithCustomError(kalp, "NothingToDo");

      await kalp.connect(creator).createCampaign(GOAL, deadline, [10000], "");
      await kalp.connect(alice).contribute(2, { value: 1n });
      await time.increaseTo(deadline);
      await expect(kalp.connect(verifier).approveMilestone(2)).to.be.revertedWithCustomError(kalp, "GoalNotReached");
    });

    it("releases funds milestone by milestone", async function () {
      const { kalp, verifier, creator, id } = await loadFixture(fundedFixture);

      // Nothing approved yet
      await expect(kalp.connect(creator).withdraw(id)).to.be.revertedWithCustomError(kalp, "NothingToDo");

      // Milestone 1 -> 30% of 10 ETH
      await expect(kalp.connect(verifier).approveMilestone(id)).to.emit(kalp, "MilestoneApproved").withArgs(id, 1);
      await expect(kalp.connect(creator).withdraw(id)).to.changeEtherBalances(
        [creator, kalp],
        [ethers.parseEther("3"), -ethers.parseEther("3")]
      );

      // Milestones 2 and 3 approved together -> 30% + 40% = 7 ETH
      await kalp.connect(verifier).approveMilestone(id);
      await kalp.connect(verifier).approveMilestone(id);
      await expect(kalp.connect(creator).withdraw(id)).to.changeEtherBalances(
        [creator, kalp],
        [ethers.parseEther("7"), -ethers.parseEther("7")]
      );

      expect(await ethers.provider.getBalance(await kalp.getAddress())).to.equal(0n);

      // All milestones are done
      await expect(kalp.connect(verifier).approveMilestone(id)).to.be.revertedWithCustomError(kalp, "NothingToDo");
    });

    it("only the creator can withdraw", async function () {
      const { kalp, verifier, stranger, id } = await loadFixture(fundedFixture);
      await kalp.connect(verifier).approveMilestone(id);
      await expect(kalp.connect(stranger).withdraw(id)).to.be.revertedWithCustomError(kalp, "NotCreator");
    });

    it("refunds the unreleased share if the campaign is cancelled midway", async function () {
      const { kalp, verifier, creator, alice, bob, id } = await loadFixture(fundedFixture);

      // 3 ETH of 10 ETH released to the creator
      await kalp.connect(verifier).approveMilestone(id);
      await kalp.connect(creator).withdraw(id);

      await expect(kalp.connect(verifier).cancelCampaign(id)).to.emit(kalp, "CampaignCancelled").withArgs(id);

      // 7 ETH remains. Alice put in 60% -> 4.2 ETH, Bob 40% -> 2.8 ETH
      await expect(kalp.connect(alice).refund(id)).to.changeEtherBalance(alice, ethers.parseEther("4.2"));
      await expect(kalp.connect(bob).refund(id)).to.changeEtherBalance(bob, ethers.parseEther("2.8"));
      expect(await ethers.provider.getBalance(await kalp.getAddress())).to.equal(0n);

      // The creator can't withdraw from a cancelled campaign
      await expect(kalp.connect(creator).withdraw(id)).to.be.revertedWithCustomError(kalp, "CampaignCancelledError");
    });
  });

  describe("admin", function () {
    it("only the owner can change the verifier", async function () {
      const { kalp, owner, stranger, bob } = await loadFixture(deployFixture);
      await expect(kalp.connect(stranger).setVerifier(bob.address)).to.be.revertedWithCustomError(kalp, "OwnableUnauthorizedAccount");
      await expect(kalp.connect(owner).setVerifier(bob.address)).to.emit(kalp, "VerifierChanged");
      expect(await kalp.verifier()).to.equal(bob.address);
    });

    it("rejects the zero address", async function () {
      const { kalp, owner } = await loadFixture(deployFixture);
      await expect(kalp.connect(owner).setVerifier(ethers.ZeroAddress)).to.be.revertedWithCustomError(kalp, "ZeroAddress");
    });
  });
});
