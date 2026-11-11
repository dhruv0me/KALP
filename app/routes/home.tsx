import {
  IconArrowUpRight,
  IconBulb,
  IconHeartHandshake,
  IconPlant2,
  IconSparkles,
} from "@tabler/icons-react";
import { Link } from "react-router";
import { HeroSection } from "@/components/home/HeroSection";
import { PlatformStats } from "@/components/home/PlatformStats";
import { usePlatformStats } from "@/hooks/use-campaigns";

export function meta() {
  return [
    { title: "KALP — Transparent Crowdfunding for Campus Innovation" },
    {
      name: "description",
      content:
        "Transparent, blockchain-oriented crowdfunding for student projects, college events, hackathon projects, and college startups.",
    },
  ];
}

export default function HomeRoute() {
  const { stats } = usePlatformStats();

  return (
    <main>
      <HeroSection />

      <section className="intro-section" id="about">
        <div className="section-kicker">
          <span>01 / ABOUT US</span>
          <IconSparkles size={18} aria-hidden="true" />
        </div>
        <div className="intro-grid">
          <h2>
            Transparent backing for
            <br />
            <em>campus innovation.</em>
          </h2>
          <div>
            <p>
              KALP connects students, clubs, hackathon teams, and campus
              founders with supporters who value clarity. Every campaign tracks
              real milestones, funding targets, and verified records from the
              database — never fabricated metrics.
            </p>
            <Link className="text-link" to="/explore">
              Explore public campaigns{" "}
              <IconArrowUpRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="how-section" id="how-it-works">
        <div className="section-kicker">
          <span>02 / HOW IT WORKS</span>
          <span>DESIGNED FOR ACCOUNTABILITY</span>
        </div>
        <div className="how-heading">
          <h2>
            Clear records from
            <br />
            <em>idea to outcome.</em>
          </h2>
          <p>
            Browse student projects, college events, hackathon builds, and
            campus startups with open visibility into real campaign progress.
          </p>
        </div>
        <div className="steps">
          <div>
            <span className="step-number">01</span>
            <IconBulb size={27} aria-hidden="true" />
            <h3>Share your project</h3>
            <p>
              Present a student project, college event, hackathon build, or
              startup with a clear funding goal and timeline.
            </p>
          </div>
          <div>
            <span className="step-number">02</span>
            <IconHeartHandshake size={27} aria-hidden="true" />
            <h3>Discover &amp; verify</h3>
            <p>
              Supporters filter by category, country, or completion status and
              inspect real campaign data before getting involved.
            </p>
          </div>
          <div>
            <span className="step-number">03</span>
            <IconPlant2 size={27} aria-hidden="true" />
            <h3>Build in the open</h3>
            <p>
              Signed-in members access protected actions while every public
              progress indicator reflects actual recorded data.
            </p>
          </div>
        </div>
        <p className="availability-note">
          On-chain settlement and payment processing are not yet connected in
          this preview.
        </p>
      </section>

      <PlatformStats stats={stats} />

      <section className="bottom-cta">
        <div>
          <span>DISCOVER VERIFIED STUDENT INITIATIVES</span>
          <h2>
            Ready to explore what&apos;s <em>next?</em>
          </h2>
        </div>
        <Link className="button button-dark" to="/explore">
          Explore Campaigns <IconArrowUpRight size={18} aria-hidden="true" />
        </Link>
      </section>
    </main>
  );
}

