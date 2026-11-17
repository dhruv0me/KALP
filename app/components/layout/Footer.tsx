import { Link, useLocation } from "react-router";
import { Logo } from "@/components/layout/Logo";
import { scrollToSectionId } from "@/components/layout/Navbar";
import { useLanguage } from "@/hooks/use-language";

export function Footer() {
  const { pathname } = useLocation();
  const { copy } = useLanguage();

  const handleSectionClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    sectionId: string,
  ) => {
    event.preventDefault();
    if (pathname === "/home" || pathname === "/home/") {
      scrollToSectionId(sectionId);
    }
  };

  return (
    <footer id="contact" className="footer">
      <div className="footer-top">
        <div>
          <Logo />
          <p>{copy.footer.tagline}</p>
        </div>
        <div className="footer-links">
          <Link
            to="/home#about"
            onClick={(event) => handleSectionClick(event, "about")}
          >
            {copy.nav.about}
          </Link>
          <Link
            to="/home#how-it-works"
            onClick={(event) => handleSectionClick(event, "how-it-works")}
          >
            {copy.nav.howItWorks}
          </Link>
          <Link
            to="/home#transparency"
            onClick={(event) => handleSectionClick(event, "transparency")}
          >
            {copy.nav.transparency ?? "Transparency"}
          </Link>
          <Link to="/explore">{copy.nav.explore}</Link>
          <Link to="/start-campaign">{copy.footer.startCta}</Link>
          <Link to="/auth">{copy.nav.login ?? "Sign in"}</Link>
        </div>
        <div className="footer-contact">
          <strong>{copy.footer.contactTitle}</strong>
          <span>{copy.footer.contactBody}</span>
          <div style={{ marginTop: "8px", display: "flex", flexDirection: "column", gap: "4px" }}>
            <a
              href="mailto:support@kalp.fund"
              style={{ color: "#2c6548", fontWeight: 700, fontSize: "12px", textDecoration: "underline" }}
            >
              support@kalp.fund
            </a>
            <span style={{ fontSize: "11px", color: "#6c8471" }}>
              Campus partnerships &amp; inquiries: contact@kalp.fund
            </span>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} KALP</span>
        <span>{copy.footer.builtFor}</span>
      </div>
    </footer>
  );
}

