"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import ReactLenis from "lenis/react";
import {
  IconCheck,
  IconClock,
  IconFileCheck,
  IconLock,
  IconShieldCheck,
} from "@tabler/icons-react";
import React, { useRef } from "react";
import type { Campaign } from "@/lib/campaigns";
import { formatCampaignAmount } from "@/lib/campaigns";
import { cn } from "@/lib/utils";

interface CampaignScrollStoryProps {
  campaign: Campaign;
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */
export function CampaignScrollStory({ campaign }: CampaignScrollStoryProps) {
  const storyRef = useRef<HTMLDivElement | null>(null);
  const milestoneRef = useRef<HTMLDivElement | null>(null);
  const proofsRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress: storyProgress } = useScroll({
    target: storyRef,
    offset: ["start start", "end end"],
  });

  const { scrollYProgress: milestoneProgress } = useScroll({
    target: milestoneRef,
    offset: ["start start", "end end"],
  });

  const { scrollYProgress: proofsProgress } = useScroll({
    target: proofsRef,
    offset: ["start start", "end end"],
  });

  /* --- Title words --- */
  const titleWords = campaign.title.split(" ");
  const titleCenter = Math.floor(titleWords.length / 2);

  /* --- Milestones --- */
  const milestones =
    campaign.milestones && campaign.milestones.length > 0
      ? campaign.milestones
      : defaultMilestones(campaign);

  const milestoneCenter = Math.floor(milestones.length / 2);

  /* --- Proof items --- */
  const proofItems = [
    {
      title: "Student Identity Verified",
      subtitle:
        "Campus administrator verified the creator's enrollment via institutional email & ID badge.",
      tag: "Identity",
      icon: IconShieldCheck,
    },
    {
      title: "Non-Custodial Smart Contract Escrow",
      subtitle:
        "Every donation is locked in a verified Ethereum smart contract. No central entity can withdraw arbitrarily.",
      tag: "Ethereum",
      icon: IconLock,
    },
    {
      title: "Milestone-Gated Release (30 / 30 / 40)",
      subtitle:
        "Funds are released only after verified proof of work and campus verifier sign-off at each stage.",
      tag: "Milestone",
      icon: IconCheck,
    },
    {
      title: "100% Automated Backer Refund",
      subtitle:
        "If the fundraising target is missed before deadline, every backer can claim an instant full refund on-chain.",
      tag: "Refund",
      icon: IconFileCheck,
    },
  ];
  const proofsCenter = Math.floor(proofItems.length / 2);

  return (
    <ReactLenis root={false}>
      <div className="campaign-scroll-story mt-8">
        {/* Sticky hint */}
        <div className="sticky top-6 left-1/2 z-30 mb-[-3rem] grid -translate-x-1/2 content-start justify-items-center gap-2 text-center pointer-events-none">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#173d2e]/40">
            Scroll to explore ↓
          </span>
        </div>

        {/* ====== Stage 1 — Title convergence ====== */}
        <div ref={storyRef} className="relative h-[200vh]">
          <div className="sticky top-0 flex h-screen w-full flex-col items-center justify-center overflow-hidden px-[4vw]">
            {/* animated title */}
            <div
              className="flex w-full max-w-4xl flex-wrap items-center justify-center gap-x-3 gap-y-2 text-center"
              style={{ perspective: "600px" }}
            >
              {titleWords.map((word, i) => (
                <ScrollWord
                  key={`${word}-${i}`}
                  word={word}
                  distance={i - titleCenter}
                  progress={storyProgress}
                />
              ))}
            </div>

            {/* description fades in */}
            <motion.p
              className="mx-auto mt-6 max-w-2xl text-center text-base leading-relaxed text-[#2c4033] md:text-lg"
              style={{
                opacity: useTransform(storyProgress, [0.35, 0.55], [0, 1]),
                y: useTransform(storyProgress, [0.35, 0.55], [24, 0]),
              }}
            >
              {campaign.description}
            </motion.p>

            {/* meta badges */}
            <motion.div
              className="mt-5 flex flex-wrap items-center justify-center gap-3 text-xs font-medium text-[#4a6352]"
              style={{
                opacity: useTransform(storyProgress, [0.5, 0.65], [0, 1]),
              }}
            >
              <span className="rounded-md bg-[#e4ede0] px-2.5 py-1">
                📍 {campaign.country}
              </span>
              <span className="rounded-md bg-[#e4ede0] px-2.5 py-1">
                🏷️ {campaign.category}
              </span>
              {campaign.currency && (
                <span className="rounded-md bg-[#e4ede0] px-2.5 py-1">
                  💰 {campaign.currency}
                </span>
              )}
            </motion.div>
          </div>
        </div>

        {/* ====== Stage 2 — Milestone Escrow Roadmap ====== */}
        <div ref={milestoneRef} className="relative h-[200vh]">
          <div className="sticky top-0 flex h-screen w-full flex-col items-center justify-center overflow-hidden px-[4vw]">
            {/* section header */}
            <motion.div
              className="mb-8 text-center"
              style={{
                opacity: useTransform(milestoneProgress, [0, 0.15], [0, 1]),
                y: useTransform(milestoneProgress, [0, 0.15], [30, 0]),
              }}
            >
              <span className="text-xs font-bold uppercase tracking-widest text-[#2c6548]">
                Smart Contract Escrow
              </span>
              <h3 className="mt-1 font-display text-2xl font-bold tracking-tight text-[#173d2e] md:text-3xl">
                Verified Milestone Roadmap
              </h3>
              <p className="mx-auto mt-2 max-w-xl text-sm text-[#4b6051]">
                Funds are released strictly in stages upon faculty verification
                and verifiable proof submission.
              </p>
            </motion.div>

            {/* milestone cards */}
            <div className="grid w-full max-w-5xl gap-5 md:grid-cols-3">
              {milestones.map((ms, i) => (
                <ScrollMilestoneCard
                  key={ms.id || i}
                  milestone={ms}
                  index={i}
                  distance={i - milestoneCenter}
                  currency={campaign.currency}
                  progress={milestoneProgress}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ====== Stage 3 — Trust & Proof Ledger ====== */}
        <div ref={proofsRef} className="relative h-[200vh]">
          <div className="sticky top-0 flex h-screen w-full flex-col items-center justify-center overflow-hidden px-[4vw]">
            <div className="w-full max-w-4xl rounded-2xl border border-white/10 bg-[#173d2e] p-8 md:p-12 shadow-lg">
              {/* header */}
              <motion.div
                className="mb-8 text-center"
                style={{
                  opacity: useTransform(proofsProgress, [0, 0.15], [0, 1]),
                  y: useTransform(proofsProgress, [0, 0.15], [30, 0]),
                }}
              >
                <span className="text-xs font-bold uppercase tracking-widest text-[#a9c67b]">
                  Transparent Governance
                </span>
                <h3 className="mt-1 text-2xl font-bold tracking-tight text-white md:text-3xl">
                  Smart Contract Proof Ledger
                </h3>
                <p className="mx-auto mt-2 max-w-xl text-sm text-[#d4e4cc]">
                  Every donation is protected by cryptographic escrow,
                  campus-verified gates, and on-chain accountability.
                </p>
              </motion.div>

              {/* proof cards */}
              <div className="grid gap-4 sm:grid-cols-2">
                {proofItems.map((proof, i) => (
                  <ScrollProofCard
                    key={proof.title}
                    proof={proof}
                    distance={i - proofsCenter}
                    progress={proofsProgress}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ReactLenis>
  );
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function ScrollWord({
  word,
  distance,
  progress,
}: {
  word: string;
  distance: number;
  progress: any;
}) {
  const x = useTransform(progress, [0, 0.5], [distance * 60, 0]);
  const rotateX = useTransform(progress, [0, 0.5], [distance * 30, 0]);
  const opacity = useTransform(progress, [0, 0.2, 0.5], [0.15, 0.5, 1]);

  return (
    <motion.span
      className="inline-block font-display text-3xl font-bold tracking-tight text-[#173d2e] will-change-transform sm:text-4xl md:text-5xl lg:text-6xl"
      style={{ x, rotateX, opacity }}
    >
      {word}
    </motion.span>
  );
}

function ScrollMilestoneCard({
  milestone,
  index,
  distance,
  currency,
  progress,
}: {
  milestone: any;
  index: number;
  distance: number;
  currency: string | null;
  progress: any;
}) {
  const y = useTransform(
    progress,
    [0.1, 0.5],
    [Math.abs(distance) * 80 + 60, 0],
  );
  const scale = useTransform(progress, [0.1, 0.5], [0.85, 1]);
  const opacity = useTransform(progress, [0.1, 0.35, 0.55], [0, 0.6, 1]);

  const isApproved =
    milestone.approvalStatus === "approved" ||
    milestone.completionStatus === "completed";
  const isInProgress = milestone.completionStatus === "in_progress";
  const stageLabel = ["30%", "30%", "40%"][index] ?? "33%";

  return (
    <motion.div
      className={cn(
        "relative flex flex-col justify-between rounded-xl border p-5 will-change-transform",
        isApproved
          ? "border-[#b8d4b0] bg-[#f7faf5] shadow-sm"
          : isInProgress
            ? "border-[#ebd7a7] bg-[#fefcf6] shadow-sm"
            : "border-[#e5e9e2] bg-[#fbfcfb]",
      )}
      style={{ y, scale, opacity }}
    >
      <div>
        <div className="flex items-center justify-between gap-2">
          <span className="rounded-full bg-[#e8efe5] px-2.5 py-0.5 text-xs font-semibold text-[#173d2e]">
            Stage {index + 1} ({stageLabel})
          </span>
          {isApproved ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#dcfce7] px-2 py-0.5 text-[11px] font-medium text-[#166534]">
              <IconCheck size={12} /> Approved
            </span>
          ) : isInProgress ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#fef3c7] px-2 py-0.5 text-[11px] font-medium text-[#92400e]">
              <IconClock size={12} /> In Progress
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#f1f5f9] px-2 py-0.5 text-[11px] font-medium text-[#64748b]">
              <IconLock size={12} /> Escrow Locked
            </span>
          )}
        </div>
        <h4 className="mt-3 font-display text-base font-bold text-[#173d2e]">
          {milestone.title}
        </h4>
        <p className="mt-2 text-xs leading-relaxed text-[#4b6051]">
          {milestone.description}
        </p>
      </div>
      <div className="mt-4 border-t border-[#e2ece0] pt-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#627768]">Allocation</span>
          <strong className="font-semibold text-[#173d2e]">
            {formatCampaignAmount(milestone.proposedBudget, currency)}
          </strong>
        </div>
        {milestone.deadline && (
          <div className="mt-1 flex items-center justify-between text-[11px] text-[#718777]">
            <span>Timeline</span>
            <span>{milestone.deadline}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function ScrollProofCard({
  proof,
  distance,
  progress,
}: {
  proof: {
    title: string;
    subtitle: string;
    tag: string;
    icon: any;
  };
  distance: number;
  progress: any;
}) {
  const Icon = proof.icon;
  const x = useTransform(progress, [0.1, 0.5], [distance * 60, 0]);
  const scale = useTransform(progress, [0.1, 0.5], [0.88, 1]);
  const opacity = useTransform(progress, [0.1, 0.35, 0.55], [0, 0.6, 1]);

  return (
    <motion.div
      className="flex items-start gap-4 rounded-xl border border-white/15 bg-white/5 p-4 backdrop-blur-xs will-change-transform transition-colors hover:bg-white/10"
      style={{ x, scale, opacity }}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#a9c67b] text-[#173d2e]">
        <Icon size={20} />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between gap-2">
          <h4 className="text-sm font-semibold text-white">{proof.title}</h4>
          <span className="shrink-0 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium text-[#cbe5ab]">
            {proof.tag}
          </span>
        </div>
        <p className="mt-1 text-xs leading-relaxed text-[#c6d7c2]">
          {proof.subtitle}
        </p>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Default milestones when none are in the database                   */
/* ------------------------------------------------------------------ */
function defaultMilestones(campaign: Campaign) {
  const target = campaign.targetAmount || 100000;
  return [
    {
      id: `${campaign.id}-m1`,
      title: "Project Setup & Research Feasibility",
      description:
        "Initial equipment acquisition, circuit simulation, and lab validation under campus advisor supervision.",
      proposedBudget: Math.round(target * 0.3),
      deadline: "Phase 1 (Month 1–2)",
      completionStatus: "completed",
      approvalStatus: "approved",
    },
    {
      id: `${campaign.id}-m2`,
      title: "Hardware Prototype & Field Testing",
      description:
        "Full assembly of the working hardware module, firmware deployment, and campus power grid telemetry.",
      proposedBudget: Math.round(target * 0.3),
      deadline: "Phase 2 (Month 3–4)",
      completionStatus: "in_progress",
      approvalStatus: "pending",
    },
    {
      id: `${campaign.id}-m3`,
      title: "Final Deployment & Campus Showcase",
      description:
        "Final installation, documentation release, student workshop, and open-source project submission.",
      proposedBudget: Math.round(target * 0.4),
      deadline: "Phase 3 (Month 5)",
      completionStatus: "pending",
      approvalStatus: "pending",
    },
  ];
}
