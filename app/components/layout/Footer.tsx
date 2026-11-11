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
    if (pathname === "/") {
      event.preventDefault();
      window.history.replaceState(null, "", `/#${sectionId}`);
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
            to="/#about"
            onClick={(event) => handleSectionClick(event, "about")}
          >
            {copy.nav.about}
          </Link>
          <Link to="/explore">{copy.nav.explore}</Link>
          <Link
            to="/#how-it-works"
            onClick={(event) => handleSectionClick(event, "how-it-works")}
          >
            {copy.nav.howItWorks}
          </Link>
          <Link to="/start-campaign">{copy.footer.startCta}</Link>
        </div>
        <div className="footer-contact">
          <strong>{copy.footer.contactTitle}</strong>
          <span>{copy.footer.contactBody}</span>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} KALP</span>
        <span>{copy.footer.builtFor}</span>
      </div>
    </footer>
  );
}

