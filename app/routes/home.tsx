import {
  IconArrowUpRight,
  IconBulb,
  IconChecklist,
  IconCoin,
  IconFileInvoice,
  IconFlag,
  IconHeartHandshake,
  IconMessages,
  IconPlant2,
  IconSparkles,
  IconTrophy,
} from "@tabler/icons-react";
import { Link } from "react-router";
import { HeroSection } from "@/components/home/HeroSection";
import { PlatformStats } from "@/components/home/PlatformStats";
import { usePlatformStats } from "@/hooks/use-campaigns";

export function meta() {
  return [
    { title: "KALP — Community Crowdfunding for Campus Innovation" },
    {
      name: "description",
      content:
        "A community-driven crowdfunding platform where good ideas find support. Discover student projects, campus events, hackathons, and student startups.",
    },
  ];
}

const TRANSPARENCY_PILLARS = [
  {
    icon: IconFlag,
    title: "Funding goals",
    description:
      "Every project states a clear, upfront target so you know exactly what is required to turn the idea into reality.",
  },
  {
    icon: IconCoin,
    title: "Contributions",
    description:
      "Every contribution is counted with real numbers and attributed directly to the campaign you chose to support.",
  },
  {
    icon: IconChecklist,
    title: "Project milestones",
    description:
      "Creators outline stages of development, making it easy to track how the initiative is progressing.",
  },
  {
    icon: IconFileInvoice,
    title: "Expense records",
    description:
      "Student teams upload budgets, quotes, and documentation so supporters can see how funds are put to work.",
  },
  {
    icon: IconMessages,
    title: "Campaign updates",
    description:
      "Direct logs, photos, and messages from the students on the ground building their vision.",
  },
  {
    icon: IconTrophy,
    title: "Completed project outcomes",
    description:
      "From working prototypes to completed college events, final outcomes and learnings are celebrated openly.",
  },
] as const;

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
            Good ideas grow
            <br />
            <em>when people come together.</em>
          </h2>
          <div>
            <p>
              KALP brings students, college communities, hackathon teams and
              aspiring founders closer to people who believe in their ideas. We
              make it easier to discover projects, contribute towards meaningful
              goals and follow their progress.
            </p>
            <Link className="text-link" to="/explore">
              Explore Campaigns <IconArrowUpRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="how-section" id="how-it-works">
        <div className="section-kicker">
          <span>02 / HOW IT WORKS</span>
          <span>FROM CONCEPT TO COMPLETION</span>
        </div>
        <div className="how-heading">
          <h2>
            From a simple idea
            <br />
            <em>to something real.</em>
          </h2>
          <p>
            Three simple steps to connect promising campus projects with a
            supportive community.
          </p>
        </div>
        <div className="steps">
          <div>
            <span className="step-number">01</span>
            <IconBulb size={27} aria-hidden="true" />
            <h3>Share your idea</h3>
            <p>
              Present your project, set a funding goal and explain what you want
              to achieve.
            </p>
          </div>
          <div>
            <span className="step-number">02</span>
            <IconHeartHandshake size={27} aria-hidden="true" />
            <h3>Find your supporters</h3>
            <p>
              Let people discover your campaign, contribute and become part of
              your journey.
            </p>
          </div>
          <div>
            <span className="step-number">03</span>
            <IconPlant2 size={27} aria-hidden="true" />
            <h3>Show your progress</h3>
            <p>
              Share milestones, updates and expense records as your project
              moves forward.
            </p>
          </div>
        </div>
      </section>

      <section className="transparency-section" id="transparency">
        <div className="section-kicker">
          <span>03 / TRANSPARENCY</span>
          <span>CLARITY AT EVERY STEP</span>
        </div>
        <div className="transparency-heading">
          <h2>
            Know where your
            <br />
            <em>support goes.</em>
          </h2>
          <p>
            We believe trust is built on openness. Here is how every campaign on
            KALP keeps supporters informed from day one.
          </p>
        </div>
        <div className="transparency-grid">
          {TRANSPARENCY_PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div key={pillar.title} className="transparency-card">
                <div className="transparency-icon-box" aria-hidden="true">
                  <Icon size={24} stroke={1.8} />
                </div>
                <h3>{pillar.title}</h3>
                <p>{pillar.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      <PlatformStats stats={stats} />

      <section className="bottom-cta">
        <div>
          <span>COMMUNITY INNOVATION</span>
          <h2>
            Have an idea <em>worth building?</em>
          </h2>
          <p className="bottom-cta-desc">
            Your next big idea deserves a chance to grow. Start sharing it with
            people who believe in making things happen.
          </p>
        </div>
        <Link className="button button-dark" to="/start-campaign">
          Start a Campaign <IconArrowUpRight size={18} aria-hidden="true" />
        </Link>
      </section>
    </main>
  );
}
