import {
  IconArrowDown,
  IconArrowRight,
  IconArrowUpRight,
  IconBulb,
  IconCode,
  IconCoins,
  IconHeartHandshake,
  IconRocket,
  IconShieldCheck,
  IconSparkles,
} from "@tabler/icons-react";
import { useState, type ReactNode } from "react";
import { Link } from "react-router";
import { scrollToSectionId } from "@/components/layout/Navbar";
import { useLanguage } from "@/hooks/use-language";

interface HeroSectionProps {
  illustration?: ReactNode;
}

export function DefaultHeroIllustration() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    setTilt({ x: Math.max(-1, Math.min(1, x)), y: Math.max(-1, Math.min(1, y)) });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const tiltStyle = {
    "--tilt-x": tilt.x,
    "--tilt-y": tilt.y,
  } as React.CSSProperties;

  return (
    <div
      className="hero-art hero-art-interactive"
      aria-label="Illustration of transparent campus crowdfunding and community collaboration"
      role="img"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={tiltStyle}
    >
      <div className="art-orbit orbit-one" />
      <div className="art-orbit orbit-two" />
      <div className="art-sun" />
      <div className="art-halo" />

      <svg
        className="art-network-lines"
        viewBox="0 0 420 420"
        fill="none"
        aria-hidden="true"
      >
        <path
          className="animated-dash-path"
          d="M95 140 C 160 155, 185 185, 210 215"
          stroke="#9dc282"
          strokeWidth="1.8"
          strokeDasharray="6 6"
        />
        <path
          className="animated-dash-path reverse"
          d="M325 130 C 265 150, 235 180, 210 215"
          stroke="#9dc282"
          strokeWidth="1.8"
          strokeDasharray="6 6"
        />
        <path
          className="animated-dash-path"
          d="M210 215 C 180 265, 130 285, 105 295"
          stroke="#9dc282"
          strokeWidth="1.8"
          strokeDasharray="6 6"
        />
        <path
          className="animated-dash-path reverse"
          d="M210 215 C 245 265, 290 285, 325 295"
          stroke="#9dc282"
          strokeWidth="1.8"
          strokeDasharray="6 6"
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
        <span>KALP COMMUNITY</span>
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
          MEANINGFUL GOALS
          <br />
          <strong>REAL PROGRESS</strong>
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
          <strong>CREATIVE BUILDS</strong>
        </span>
      </div>

      <div className="art-card art-card-four">
        <IconRocket size={19} aria-hidden="true" />
        <span>
          COLLEGE STARTUPS
          <br />
          <strong>SHARED GOALS</strong>
        </span>
      </div>

      <div className="art-floating-pill pill-one" aria-hidden="true">
        <IconBulb size={13} />
        <span>Idea to Outcome</span>
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
          A PLACE WHERE GOOD IDEAS FIND SUPPORT
        </div>
        <h1>
          Big ideas need people
          <br />
          <em>who believe</em> in them.
        </h1>
        <p>
          Discover student projects, support campus innovation and follow every
          step from idea to achievement.
        </p>
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
          <span>Every number tells a real story.</span>
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
        COMMUNITY CROWDFUNDING
      </span>
    </section>
  );
}

