"use client";

import {
  IconArrowUpRight,
  IconBulb,
  IconChecklist,
  IconCoin,
  IconExternalLink,
  IconFileCode,
  IconFileInvoice,
  IconFlag,
  IconHeartHandshake,
  IconLockCheck,
  IconPlant2,
  IconRotateClockwise,
  IconShieldCheck,
  IconSparkles,
} from "@tabler/icons-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router";
import { HeroSection } from "@/components/home/HeroSection";
import { usePlatformStats } from "@/hooks/use-campaigns";
import { formatCampaignAmount } from "@/lib/campaigns";

export function meta() {
  return [
    { title: "KALP — Transparent Campus Crowdfunding on Ethereum" },
    {
      name: "description",
      content:
        "Milestone-based crowdfunding for student projects, college events, hackathons, and campus startups on Ethereum.",
    },
  ];
}

const TRANSPARENCY_PILLARS = [
  {
    icon: IconFlag,
    title: "On-Chain Funding Goals",
    description:
      "Every campaign records an exact target in ETH directly into the smart contract. Zero ambiguity or hidden adjustments.",
  },
  {
    icon: IconCoin,
    title: "Publicly Verifiable Contributions",
    description:
      "Contributions are recorded on Ethereum and visible on Etherscan in real-time. Every backer's share is cryptographically logged.",
  },
  {
    icon: IconChecklist,
    title: "Milestone-Based Escrow (30/30/40)",
    description:
      "Funds are never released all at once. Creators define milestones (e.g. 30% Setup, 30% Prototype, 40% Delivery) stored in basis points.",
  },
  {
    icon: IconFileInvoice,
    title: "Verified Milestone Invoices & Proofs",
    description:
      "Student teams upload receipts, budget invoices, and prototype demos. A campus verifier approves each milestone before funds unlock.",
  },
  {
    icon: IconRotateClockwise,
    title: "100% Automated Backer Refunds",
    description:
      "If a project fails to meet its goal before the deadline, every backer can call refund() to reclaim their full contribution directly.",
  },
  {
    icon: IconShieldCheck,
    title: "Proportional Cancellation Protection",
    description:
      "If an initiative is cancelled early by the verifier, unreleased funds in the smart contract are proportionally returned to backers.",
  },
] as const;

export default function HomeRoute() {
  const { stats } = usePlatformStats();

  return (
    <main className="w-full bg-[#f9faf5]">
      {/* Hero Section */}
      <HeroSection />

      {/* 01 / ABOUT US */}
      <AboutSection />

      {/* 02 / HOW IT WORKS */}
      <HowItWorksSection />

      {/* 03 / TRANSPARENCY */}
      <TransparencySection />

      {/* 04 / ETHEREUM SMART CONTRACTS */}
      <BlockchainSection />

      {/* COMMUNITY IMPACT */}
      {stats && stats.totalPublicCampaigns > 0 && (
        <PlatformStatsSection stats={stats} />
      )}

      {/* BOTTOM CTA */}
      <BottomCtaSection />
    </main>
  );
}

/* ================================================================== */
/*  Section 01: About Us                                              */
/* ================================================================== */
function AboutSection() {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });

  const kickerOpacity = useTransform(scrollYProgress, [0, 0.25], [0, 1]);
  const kickerY = useTransform(scrollYProgress, [0, 0.25], [15, 0]);

  // Clean horizontal slide for headings (no 3D twist that breaks baseline)
  const line1X = useTransform(scrollYProgress, [0, 0.45], [-45, 0]);
  const line1Opacity = useTransform(scrollYProgress, [0, 0.2, 0.45], [0.2, 0.7, 1]);

  const line2X = useTransform(scrollYProgress, [0.06, 0.48], [45, 0]);
  const line2Opacity = useTransform(scrollYProgress, [0.06, 0.25, 0.48], [0.2, 0.7, 1]);

  const rightColX = useTransform(scrollYProgress, [0.1, 0.5], [60, 0]);
  const rightColOpacity = useTransform(scrollYProgress, [0.1, 0.3, 0.5], [0, 0.6, 1]);
  const rightColScale = useTransform(scrollYProgress, [0.1, 0.5], [0.95, 1]);

  return (
    <div
      ref={targetRef}
      id="about"
      className="relative box-border h-[180vh] border-t border-[#e1e8dc] bg-[#f9faf5]"
    >
      <div className="sticky top-0 flex min-h-screen w-full flex-col justify-center px-[8%] py-12 md:py-16 max-w-[1440px] mx-auto">
        <motion.div
          className="section-kicker mb-6"
          style={{ opacity: kickerOpacity, y: kickerY }}
        >
          <span>01 / ABOUT US</span>
          <IconSparkles size={18} aria-hidden="true" />
        </motion.div>

        <div className="intro-grid grid grid-cols-1 md:grid-cols-2 items-center gap-10">
          <div>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.15] tracking-tight text-[#224735]">
              <motion.span
                className="block"
                style={{ x: line1X, opacity: line1Opacity }}
              >
                Good ideas grow
              </motion.span>
              <motion.em
                className="block font-serif italic text-[#2c6548] mt-1"
                style={{ x: line2X, opacity: line2Opacity }}
              >
                when people come together.
              </motion.em>
            </h2>
          </div>

          <motion.div
            style={{ x: rightColX, opacity: rightColOpacity, scale: rightColScale }}
            className="will-change-transform"
          >
            <p className="text-base sm:text-lg leading-relaxed text-[#4b6051] mb-6">
              KALP brings students, college communities, hackathon teams and
              aspiring founders closer to people who believe in their ideas. We
              make it easier to discover projects, contribute towards meaningful
              goals and follow their progress with on-chain trust.
            </p>
            <Link
              className="text-link inline-flex items-center gap-2 font-semibold text-[#173d2e] hover:text-[#2c6548] transition-colors"
              to="/explore"
            >
              Explore Campaigns <IconArrowUpRight size={17} aria-hidden="true" />
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  Section 02: How It Works                                          */
/* ================================================================== */
function HowItWorksSection() {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });

  const kickerOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  const line1X = useTransform(scrollYProgress, [0, 0.42], [-35, 0]);
  const line1Opacity = useTransform(scrollYProgress, [0, 0.2, 0.42], [0.2, 0.7, 1]);

  const line2X = useTransform(scrollYProgress, [0.06, 0.45], [35, 0]);
  const line2Opacity = useTransform(scrollYProgress, [0.06, 0.25, 0.45], [0.2, 0.7, 1]);

  const subOpacity = useTransform(scrollYProgress, [0.1, 0.4], [0, 1]);
  const subY = useTransform(scrollYProgress, [0.1, 0.4], [15, 0]);

  // Gentle, buttery transforms that stay securely within the viewport
  const c1X = useTransform(scrollYProgress, [0.1, 0.52], [-60, 0]);
  const c1Y = useTransform(scrollYProgress, [0.1, 0.52], [28, 0]);
  const c1Scale = useTransform(scrollYProgress, [0.1, 0.52], [0.92, 1]);
  const c1Opacity = useTransform(scrollYProgress, [0.1, 0.32, 0.52], [0, 0.65, 1]);

  const c2Y = useTransform(scrollYProgress, [0.1, 0.52], [35, 0]);
  const c2Scale = useTransform(scrollYProgress, [0.1, 0.52], [0.9, 1]);
  const c2Opacity = useTransform(scrollYProgress, [0.1, 0.32, 0.52], [0, 0.65, 1]);

  const c3X = useTransform(scrollYProgress, [0.1, 0.52], [60, 0]);
  const c3Y = useTransform(scrollYProgress, [0.1, 0.52], [28, 0]);
  const c3Scale = useTransform(scrollYProgress, [0.1, 0.52], [0.92, 1]);
  const c3Opacity = useTransform(scrollYProgress, [0.1, 0.32, 0.52], [0, 0.65, 1]);

  return (
    <div
      ref={targetRef}
      id="how-it-works"
      className="relative box-border h-[190vh] bg-[#f0f5e9]"
    >
      <div className="sticky top-0 flex min-h-screen w-full flex-col justify-center px-[8%] py-12 md:py-16 max-w-[1440px] mx-auto">
        <motion.div
          className="section-kicker mb-3"
          style={{ opacity: kickerOpacity }}
        >
          <span>02 / HOW IT WORKS</span>
          <span>FROM CONCEPT TO COMPLETION</span>
        </motion.div>

        <div className="how-heading mb-6 md:mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#224735]">
              <motion.span
                className="block"
                style={{ x: line1X, opacity: line1Opacity }}
              >
                From a simple idea
              </motion.span>
              <motion.em
                className="block font-serif italic text-[#2c6548] mt-1"
                style={{ x: line2X, opacity: line2Opacity }}
              >
                to something real.
              </motion.em>
            </h2>
          </div>
          <motion.p
            className="text-sm sm:text-base text-[#4b6051] max-w-md"
            style={{ opacity: subOpacity, y: subY }}
          >
            Three simple steps to connect promising campus projects with a
            supportive community.
          </motion.p>
        </div>

        {/* 3 Step Cards — Compact padding and gentle y-motion ensure they never clip */}
        <div className="steps grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
          {/* Step 1 */}
          <motion.div
            className="rounded-2xl border border-[#d8e3d2] bg-white p-5 sm:p-6 shadow-xs will-change-transform flex flex-col justify-between"
            style={{ x: c1X, y: c1Y, scale: c1Scale, opacity: c1Opacity }}
          >
            <div>
              <span className="step-number block text-xs font-bold text-[#2c6548] mb-2">01</span>
              <IconBulb size={26} className="text-[#2c6548] mb-3" aria-hidden="true" />
              <h3 className="font-display text-lg sm:text-xl font-bold text-[#173d2e] mb-2">Share your idea</h3>
              <p className="text-xs sm:text-sm leading-relaxed text-[#4b6051]">
                Present your project, set an ETH target and define milestones
                (e.g. 30% / 30% / 40%) that backers can inspect.
              </p>
            </div>
          </motion.div>

          {/* Step 2 */}
          <motion.div
            className="rounded-2xl border border-[#d8e3d2] bg-white p-5 sm:p-6 shadow-xs will-change-transform flex flex-col justify-between"
            style={{ y: c2Y, scale: c2Scale, opacity: c2Opacity }}
          >
            <div>
              <span className="step-number block text-xs font-bold text-[#2c6548] mb-2">02</span>
              <IconHeartHandshake size={26} className="text-[#2c6548] mb-3" aria-hidden="true" />
              <h3 className="font-display text-lg sm:text-xl font-bold text-[#173d2e] mb-2">Find your supporters</h3>
              <p className="text-xs sm:text-sm leading-relaxed text-[#4b6051]">
                Backers send contributions directly into non-custodial smart contract
                escrow until the deadline is reached.
              </p>
            </div>
          </motion.div>

          {/* Step 3 */}
          <motion.div
            className="rounded-2xl border border-[#d8e3d2] bg-white p-5 sm:p-6 shadow-xs will-change-transform flex flex-col justify-between"
            style={{ x: c3X, y: c3Y, scale: c3Scale, opacity: c3Opacity }}
          >
            <div>
              <span className="step-number block text-xs font-bold text-[#2c6548] mb-2">03</span>
              <IconPlant2 size={26} className="text-[#2c6548] mb-3" aria-hidden="true" />
              <h3 className="font-display text-lg sm:text-xl font-bold text-[#173d2e] mb-2">Unlock milestones</h3>
              <p className="text-xs sm:text-sm leading-relaxed text-[#4b6051]">
                Submit receipts and proof of work. Campus verifiers approve stages
                one by one, unlocking withdrawals step-by-step.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  Section 03: Transparency (6 Pillars)                              */
/* ================================================================== */
function TransparencySection() {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });

  const kickerOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  const line1X = useTransform(scrollYProgress, [0, 0.42], [-35, 0]);
  const line1Opacity = useTransform(scrollYProgress, [0, 0.2, 0.42], [0.2, 0.7, 1]);

  const line2X = useTransform(scrollYProgress, [0.06, 0.45], [35, 0]);
  const line2Opacity = useTransform(scrollYProgress, [0.06, 0.25, 0.45], [0.2, 0.7, 1]);

  const subOpacity = useTransform(scrollYProgress, [0.1, 0.4], [0, 1]);
  const subY = useTransform(scrollYProgress, [0.1, 0.4], [15, 0]);

  return (
    <div
      ref={targetRef}
      id="transparency"
      className="relative box-border h-[200vh] border-t border-[#e1e8dc] bg-[#f9faf5]"
    >
      <div className="sticky top-0 flex min-h-screen w-full flex-col justify-center px-[8%] py-10 md:py-14 max-w-[1440px] mx-auto">
        <motion.div
          className="section-kicker mb-2"
          style={{ opacity: kickerOpacity }}
        >
          <span>03 / TRANSPARENCY</span>
          <span>CLARITY AT EVERY STEP</span>
        </motion.div>

        <div className="transparency-heading mb-5 md:mb-6">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#224735]">
            <motion.span
              className="block"
              style={{ x: line1X, opacity: line1Opacity }}
            >
              Know where your
            </motion.span>
            <motion.em
              className="block font-serif italic text-[#2c6548] mt-1"
              style={{ x: line2X, opacity: line2Opacity }}
            >
              support goes.
            </motion.em>
          </h2>
          <motion.p
            className="mt-2 text-xs sm:text-sm text-[#4b6051] max-w-xl"
            style={{ opacity: subOpacity, y: subY }}
          >
            We believe trust is built on verifiable mathematics. Here is how
            every campaign on KALP keeps supporters protected and informed from day one.
          </motion.p>
        </div>

        <div className="transparency-grid grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
          {TRANSPARENCY_PILLARS.map((pillar, i) => {
            const col = (i % 3) - 1; // -1, 0, 1
            const row = Math.floor(i / 3); // 0, 1
            return (
              <TransparencyCard
                key={pillar.title}
                pillar={pillar}
                col={col}
                row={row}
                progress={scrollYProgress}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function TransparencyCard({
  pillar,
  col,
  row,
  progress,
}: {
  pillar: (typeof TRANSPARENCY_PILLARS)[number];
  col: number;
  row: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  progress: any;
}) {
  const Icon = pillar.icon;
  const x = useTransform(progress, [0.1, 0.52], [col * 40, 0]);
  const y = useTransform(progress, [0.1, 0.52], [row === 0 ? -18 : 22, 0]);
  const scale = useTransform(progress, [0.1, 0.52], [0.93, 1]);
  const opacity = useTransform(progress, [0.1, 0.32, 0.52], [0, 0.65, 1]);

  return (
    <motion.div
      className="transparency-card rounded-2xl border border-[#dbe6d5] bg-white p-4 sm:p-5 shadow-xs will-change-transform"
      style={{ x, y, scale, opacity }}
    >
      <div className="transparency-icon-box mb-2.5 inline-flex p-2 rounded-xl bg-[#eef4ea] text-[#173d2e]" aria-hidden="true">
        <Icon size={22} stroke={1.8} />
      </div>
      <h3 className="font-display text-sm sm:text-base font-bold text-[#173d2e] mb-1">{pillar.title}</h3>
      <p className="text-xs sm:text-xs leading-relaxed text-[#506657]">{pillar.description}</p>
    </motion.div>
  );
}

/* ================================================================== */
/*  Section 04: Ethereum Smart Contracts                              */
/* ================================================================== */
function BlockchainSection() {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });

  const kickerOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  const leftHeadingX = useTransform(scrollYProgress, [0.08, 0.5], [-50, 0]);
  const leftHeadingOpacity = useTransform(scrollYProgress, [0.08, 0.3, 0.5], [0, 0.65, 1]);

  const rightButtonsX = useTransform(scrollYProgress, [0.08, 0.5], [50, 0]);
  const rightButtonsOpacity = useTransform(scrollYProgress, [0.08, 0.3, 0.5], [0, 0.65, 1]);

  // 3 Cards gentle float
  const c1X = useTransform(scrollYProgress, [0.1, 0.52], [-50, 0]);
  const c1Y = useTransform(scrollYProgress, [0.1, 0.52], [20, 0]);
  const c1Scale = useTransform(scrollYProgress, [0.1, 0.52], [0.93, 1]);
  const c1Opacity = useTransform(scrollYProgress, [0.1, 0.32, 0.52], [0, 0.65, 1]);

  const c2Y = useTransform(scrollYProgress, [0.1, 0.52], [28, 0]);
  const c2Scale = useTransform(scrollYProgress, [0.1, 0.52], [0.92, 1]);
  const c2Opacity = useTransform(scrollYProgress, [0.1, 0.32, 0.52], [0, 0.65, 1]);

  const c3X = useTransform(scrollYProgress, [0.1, 0.52], [50, 0]);
  const c3Y = useTransform(scrollYProgress, [0.1, 0.52], [20, 0]);
  const c3Scale = useTransform(scrollYProgress, [0.1, 0.52], [0.93, 1]);
  const c3Opacity = useTransform(scrollYProgress, [0.1, 0.32, 0.52], [0, 0.65, 1]);

  // Spec strip
  const stripY = useTransform(scrollYProgress, [0.2, 0.6], [30, 0]);
  const stripScale = useTransform(scrollYProgress, [0.2, 0.6], [0.95, 1]);
  const stripOpacity = useTransform(scrollYProgress, [0.2, 0.4, 0.6], [0, 0.65, 1]);

  return (
    <div
      ref={targetRef}
      id="blockchain"
      className="relative box-border h-[200vh] border-t border-[#e1e8dc] bg-[#fbfcf8]"
    >
      <div className="sticky top-0 flex min-h-screen w-full flex-col justify-center px-[8%] py-10 md:py-14 max-w-[1440px] mx-auto">
        <motion.div
          className="section-kicker mb-2"
          style={{ opacity: kickerOpacity }}
        >
          <span>04 / ETHEREUM SMART CONTRACTS</span>
          <span>NON-CUSTODIAL ESCROW &amp; MILESTONE RELEASES</span>
        </motion.div>

        <div className="how-heading flex flex-col md:flex-row items-start md:items-end justify-between gap-5 mb-5 md:mb-6">
          <motion.div
            style={{ x: leftHeadingX, opacity: leftHeadingOpacity }}
            className="will-change-transform"
          >
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#224735]">
              Code-governed trust.
              <br />
              <em className="font-serif italic text-[#2c6548]">Zero intermediaries.</em>
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#4b6051] max-w-xl">
              Every student campaign on KALP is backed by our audited{" "}
              <strong className="text-[#173d2e]">KalpCrowdfund.sol</strong> Ethereum smart contract. Funds are held in
              decentralized escrow on the Sepolia testnet and released in verified milestone shares.
            </p>
          </motion.div>

          <motion.div
            style={{ x: rightButtonsX, opacity: rightButtonsOpacity }}
            className="flex items-center gap-3 flex-wrap will-change-transform"
          >
            <a
              className="button button-outline inline-flex items-center gap-2 rounded-xl border border-[#173d2e] px-4 py-2 text-xs sm:text-sm font-semibold text-[#173d2e] hover:bg-[#173d2e] hover:text-white transition-all"
              href="https://sepolia.etherscan.io"
              target="_blank"
              rel="noreferrer"
            >
              Verify on Sepolia <IconExternalLink size={15} aria-hidden="true" />
            </a>
            <Link
              className="button button-dark inline-flex items-center gap-2 rounded-xl bg-[#173d2e] px-4 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-[#23533c] transition-all"
              to="/start-campaign"
            >
              Deploy Campaign <IconArrowUpRight size={15} aria-hidden="true" />
            </Link>
          </motion.div>
        </div>

        {/* 3 Blockchain Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5 mb-5">
          <motion.div
            className="transparency-card rounded-2xl border border-[#dbe6d5] bg-white p-4 sm:p-5 shadow-xs will-change-transform"
            style={{ borderLeft: "4px solid #2c6548", x: c1X, y: c1Y, scale: c1Scale, opacity: c1Opacity }}
          >
            <div className="transparency-icon-box mb-2.5 inline-flex p-2 rounded-xl bg-[#eef4ea] text-[#2c6548]" aria-hidden="true">
              <IconLockCheck size={22} />
            </div>
            <h3 className="font-display text-base sm:text-lg font-bold text-[#173d2e] mb-1">1. Milestone Escrow</h3>
            <p className="text-xs sm:text-xs leading-relaxed text-[#506657]">
              Creators set their ETH goal, deadline, and milestone breakdown in basis points (e.g. 3000 / 3000 / 4000 = 100%). Funds are locked in the smart contract until earned.
            </p>
          </motion.div>

          <motion.div
            className="transparency-card rounded-2xl border border-[#dbe6d5] bg-white p-4 sm:p-5 shadow-xs will-change-transform"
            style={{ borderLeft: "4px solid #789d65", y: c2Y, scale: c2Scale, opacity: c2Opacity }}
          >
            <div className="transparency-icon-box mb-2.5 inline-flex p-2 rounded-xl bg-[#eef4ea] text-[#789d65]" aria-hidden="true">
              <IconShieldCheck size={22} />
            </div>
            <h3 className="font-display text-base sm:text-lg font-bold text-[#173d2e] mb-1">2. Verifier Approval Gate</h3>
            <p className="text-xs sm:text-xs leading-relaxed text-[#506657]">
              A designated verifier (campus administrator or multisig wallet) reviews project milestones, receipts, and deliverables before approving milestone withdrawal tranches.
            </p>
          </motion.div>

          <motion.div
            className="transparency-card rounded-2xl border border-[#dbe6d5] bg-white p-4 sm:p-5 shadow-xs will-change-transform"
            style={{ borderLeft: "4px solid #9dc282", x: c3X, y: c3Y, scale: c3Scale, opacity: c3Opacity }}
          >
            <div className="transparency-icon-box mb-2.5 inline-flex p-2 rounded-xl bg-[#eef4ea] text-[#9dc282]" aria-hidden="true">
              <IconRotateClockwise size={22} />
            </div>
            <h3 className="font-display text-base sm:text-lg font-bold text-[#173d2e] mb-1">3. Guaranteed Backer Refunds</h3>
            <p className="text-xs sm:text-xs leading-relaxed text-[#506657]">
              If a project fails to meet its goal by the deadline, or if a project is cancelled by the verifier, backers can withdraw 100% of their refund directly via the contract.
            </p>
          </motion.div>
        </div>

        {/* Contract specifications strip */}
        <motion.div
          className="rounded-xl border border-[#d5e0d1] bg-[#edf3e9] p-3.5 sm:p-4 flex flex-wrap items-center justify-between gap-3 will-change-transform"
          style={{ y: stripY, scale: stripScale, opacity: stripOpacity }}
        >
          <div className="flex items-center gap-3">
            <IconFileCode size={24} className="text-[#234c38]" />
            <div>
              <div className="text-[10px] font-extrabold tracking-wider uppercase text-[#678761]">
                Smart Contract
              </div>
              <strong className="text-xs sm:text-sm text-[#173d2e] font-mono">
                KalpCrowdfund.sol · 12/12 Automated Tests Passing
              </strong>
            </div>
          </div>
          <div className="flex items-center gap-3 text-[11px] sm:text-xs text-[#3d5445] flex-wrap">
            <span>Network: <strong className="text-[#173d2e]">Ethereum Sepolia</strong></span>
            <span>Standard: <strong className="text-[#173d2e]">EVM Solidity ^0.8.24</strong></span>
            <span>Audit: <strong className="text-[#173d2e]">ReentrancyGuard &amp; Ownable</strong></span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  Section 05: Platform Community Impact Stats                        */
/* ================================================================== */
function PlatformStatsSection({ stats }: { stats: any }) {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });

  const kickerOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  const statItems = [
    { label: "Active campaigns", val: new Intl.NumberFormat().format(stats.totalActiveCampaigns) },
    { label: "Completed projects", val: new Intl.NumberFormat().format(stats.totalCompletedCampaigns) },
    { label: "Supporters & donors", val: new Intl.NumberFormat().format(stats.totalVerifiedDonors) },
    { label: "Total funds raised", val: formatCampaignAmount(stats.totalFundsCollected, stats.currency) },
  ];

  return (
    <div
      ref={targetRef}
      className="relative box-border h-[170vh] border-t border-b border-[#e1e8dc] bg-[#f9faf5]"
    >
      <div className="sticky top-0 flex min-h-screen w-full flex-col justify-center px-[8%] py-12 md:py-16 max-w-[1440px] mx-auto">
        <motion.div
          className="section-kicker mb-6"
          style={{ opacity: kickerOpacity }}
        >
          <span>COMMUNITY IMPACT</span>
          <span>EVERY NUMBER TELLS A REAL STORY</span>
        </motion.div>

        <div className="stats-grid grid grid-cols-2 md:grid-cols-4 gap-5">
          {statItems.map((item, index) => {
            const distance = index - 1.5;
            return (
              <StatCard
                key={item.label}
                label={item.label}
                val={item.val}
                distance={distance}
                progress={scrollYProgress}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  val,
  distance,
  progress,
}: {
  label: string;
  val: string;
  distance: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  progress: any;
}) {
  const x = useTransform(progress, [0.1, 0.5], [distance * 40, 0]);
  const y = useTransform(progress, [0.1, 0.5], [20, 0]);
  const scale = useTransform(progress, [0.1, 0.5], [0.92, 1]);
  const opacity = useTransform(progress, [0.1, 0.3, 0.5], [0, 0.65, 1]);

  return (
    <motion.div
      className="stat-item rounded-2xl border border-[#dbe6d5] bg-white p-5 sm:p-6 shadow-xs will-change-transform text-center md:text-left"
      style={{ x, y, scale, opacity }}
    >
      <span className="stat-label block text-xs font-semibold text-[#667d6e] uppercase tracking-wider mb-2">
        {label}
      </span>
      <strong className="stat-value font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#173d2e]">
        {val}
      </strong>
    </motion.div>
  );
}

/* ================================================================== */
/*  Section 06: Bottom CTA                                            */
/* ================================================================== */
function BottomCtaSection() {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });

  const headingX = useTransform(scrollYProgress, [0.1, 0.5], [-45, 0]);
  const headingOpacity = useTransform(scrollYProgress, [0.1, 0.3, 0.5], [0, 0.65, 1]);

  const buttonX = useTransform(scrollYProgress, [0.1, 0.5], [45, 0]);
  const buttonScale = useTransform(scrollYProgress, [0.1, 0.5], [0.92, 1]);
  const buttonOpacity = useTransform(scrollYProgress, [0.1, 0.3, 0.5], [0, 0.65, 1]);

  return (
    <div
      ref={targetRef}
      className="relative box-border h-[150vh] bg-[#f9faf5]"
    >
      <div className="sticky top-0 flex min-h-screen w-full flex-col justify-center px-[8%] py-12 md:py-16 max-w-[1440px] mx-auto">
        <div className="bottom-cta flex flex-col md:flex-row items-start md:items-center justify-between gap-8 rounded-3xl border border-[#d8e3d2] bg-gradient-to-br from-[#f2f7ec] to-[#e6efe1] p-8 md:p-14 shadow-sm">
          <motion.div
            style={{ x: headingX, opacity: headingOpacity }}
            className="will-change-transform max-w-2xl"
          >
            <span className="block text-xs font-extrabold uppercase tracking-widest text-[#2c6548] mb-3">
              COMMUNITY INNOVATION
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#173d2e] leading-tight">
              Have an idea <em className="font-serif italic text-[#2c6548]">worth building?</em>
            </h2>
            <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#4b6051]">
              Your next big idea deserves a chance to grow. Start sharing it with
              people who believe in making things happen.
            </p>
          </motion.div>

          <motion.div
            style={{ x: buttonX, scale: buttonScale, opacity: buttonOpacity }}
            className="will-change-transform shrink-0"
          >
            <Link
              className="button button-dark inline-flex items-center gap-2 rounded-2xl bg-[#173d2e] px-7 py-4 text-base font-bold text-white shadow-md hover:bg-[#23533c] hover:shadow-lg transition-all"
              to="/start-campaign"
            >
              Start a Campaign <IconArrowUpRight size={20} aria-hidden="true" />
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
