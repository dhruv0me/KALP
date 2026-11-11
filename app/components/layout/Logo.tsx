import { appPath } from "@agent-native/core/client/api-path";
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
      <img
        src={appPath("/kalp-logo.png")}
        alt="KALP"
        className="brand-logo-img"
      />
      <span className="sr-only">KALP — Transparent Campus Funding</span>
    </Link>
  );
}
