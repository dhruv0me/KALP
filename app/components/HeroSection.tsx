import {
  IconArrowDown,
  IconArrowRight,
  IconArrowUpRight,
  IconCode,
  IconCoins,
  IconHeartHandshake,
  IconRocket,
  IconShieldCheck,
  IconSparkles,
} from "@tabler/icons-react";
import type { ReactNode } from "react";
import { Link } from "react-router";
import { scrollToSectionId } from "@/components/Navbar";
import { useLanguage } from "@/hooks/use-language";

interface HeroSectionProps {
  illustration?: ReactNode;
}

export function DefaultHeroIllustration() {
  return (
    <div
      className="hero-art"
      aria-label="Illustration of transparent donations, connected student projects, and campus innovation"
      role="img"
    >
      <div className="art-orbit orbit-one" />
      <div className="art-orbit orbit-two" />
      <div className="art-sun" />

      <svg
        className="art-network-lines"
        viewBox="0 0 420 420"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M95 140 C 160 155, 185 185, 210 215"
          stroke="#9dc282"
          strokeWidth="1.6"
          strokeDasharray="5 5"
        />
        <path
          d="M325 130 C 265 150, 235 180, 210 215"
          stroke="#9dc282"
          strokeWidth="1.6"
          strokeDasharray="5 5"
        />
        <path
          d="M210 215 C 180 265, 130 285, 105 295"
          stroke="#9dc282"
          strokeWidth="1.6"
          strokeDasharray="5 5"
        />
        <path
          d="M210 215 C 245 265, 290 285, 325 295"
          stroke="#9dc282"
          strokeWidth="1.6"
          strokeDasharray="5 5"
        />
        <circle cx="210" cy="215" r="34" fill="#234c38" />
        <circle
          cx="210"
          cy="215"
          r="46"
          stroke="#a9c67b"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
      </svg>

      <div className="art-core-hub" aria-hidden="true">
        <IconShieldCheck size={28} stroke={1.7} />
        <span>OPEN LEDGER</span>
      </div>

      <div className="art-star star-one" aria-hidden="true">
        ✳
      </div>
      <div className="art-star star-two" aria-hidden="true">
        ✦
      </div>
      <div className="art-star star-three" aria-hidden="true">
        ✳
      </div>

      <div className="art-card art-card-one">
        <IconCoins size={21} aria-hidden="true" />
        <span>
          VERIFIED SUPPORT
          <br />
          <strong>TRACEABLE FUNDS</strong>
        </span>
      </div>

      <div className="art-card art-card-two">
        <IconHeartHandshake size={21} aria-hidden="true" />
        <span>
          STUDENT PROJECTS
          <br />
          <strong>&amp; CAMPUS EVENTS</strong>
        </span>
      </div>

      <div className="art-card art-card-three">
        <IconCode size={19} aria-hidden="true" />
        <span>
          HACKATHONS
          <br />
          <strong>OPEN BUILDS</strong>
        </span>
      </div>

      <div className="art-card art-card-four">
        <IconRocket size={19} aria-hidden="true" />
        <span>
          COLLEGE STARTUPS
          <br />
          <strong>SHARED TRUST</strong>
        </span>
      </div>

      <div className="art-dot dot-one" />
      <div className="art-dot dot-two" />
    </div>
  );
}

export function HeroSection({ illustration }: HeroSectionProps) {
  const { copy } = useLanguage();

  return (
    <section className="hero">
      <div className="hero-copy">
        <div className="eyebrow">
          <span className="eyebrow-dot" />
          {copy.hero.eyebrow}
        </div>
        <h1>
          {copy.hero.headlineLine1}
          <br />
          <em>{copy.hero.headlineEmphasis}</em> {copy.hero.headlineLine2End}
        </h1>
        <p>{copy.hero.description}</p>
        <div className="hero-buttons">
          <Link className="button button-dark" to="/explore">
            {copy.hero.exploreCta}{" "}
            <IconArrowUpRight size={18} aria-hidden="true" />
          </Link>
          <Link className="button button-outline" to="/start-campaign">
            {copy.hero.startCta} <IconArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
        <div className="hero-note">
          <span className="note-icon" aria-hidden="true">
            <IconSparkles size={16} />
          </span>
          <span>
            Built for student projects, college events, hackathons, and campus
            startups.
          </span>
        </div>
      </div>

      <div className="hero-illustration-slot">
        {illustration ?? <DefaultHeroIllustration />}
      </div>

      <a
        className="scroll-indicator"
        href="#about"
        onClick={(event) => {
          event.preventDefault();
          scrollToSectionId("about");
        }}
      >
        <span>{copy.hero.scrollIndicator}</span>
        <IconArrowDown size={16} aria-hidden="true" />
      </a>
      <span className="hero-side-label" aria-hidden="true">
        TRANSPARENT CAMPUS CROWDFUNDING
      </span>
    </section>
  );
}

