import { Link } from "react-router";

interface LogoProps {
  onClick?: () => void;
}

export function Logo({ onClick }: LogoProps) {
  return (
    <Link
      to="/"
      onClick={onClick}
      className="brand"
      aria-label="KALP — Transparent Campus Crowdfunding home"
    >
      <span className="brand-mark" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </span>
      <span>
        KALP
        <small>TRANSPARENT CAMPUS FUNDING</small>
      </span>
    </Link>
  );
}

