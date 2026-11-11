import { appPath } from "@agent-native/core/client/api-path";
import {
  IconArrowUpRight,
  IconCheck,
  IconChevronDown,
  IconLogout,
  IconMenu2,
  IconUserCircle,
  IconWorld,
  IconX,
} from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { Logo } from "@/components/Logo";
import { useLanguage } from "@/hooks/use-language";
import { useSession } from "@/hooks/use-session";

export function scrollToSectionId(id: string) {
  const target = document.getElementById(id);
  if (target) {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langPickerRef = useRef<HTMLDivElement>(null);
  const { pathname, hash } = useLocation();
  const { authenticated, email } = useSession();
  const { code, language, languages, copy, setLanguage } = useLanguage();
  const signInHref = appPath("/sign-in");

  useEffect(() => {
    if (!langOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (
        langPickerRef.current &&
        !langPickerRef.current.contains(event.target as Node)
      ) {
        setLangOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setLangOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [langOpen]);

  const handleLogout = async () => {
    setOpen(false);
    const { signOut } = await import("@agent-native/core/client");
    await signOut();
  };

  const handleSectionClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    sectionId: string,
  ) => {
    setOpen(false);
    if (pathname === "/") {
      event.preventDefault();
      window.history.replaceState(null, "", `/#${sectionId}`);
      scrollToSectionId(sectionId);
    }
  };

  return (
    <header className="site-header">
      <div className="nav-inner">
        <Logo onClick={() => setOpen(false)} />

        <nav
          className={open ? "nav-links open" : "nav-links"}
          aria-label="Main navigation"
        >
          <Link
            onClick={() => setOpen(false)}
            to="/"
            aria-current={pathname === "/" && !hash ? "page" : undefined}
          >
            {copy.nav.home}
          </Link>
          <Link
            to="/#about"
            onClick={(event) => handleSectionClick(event, "about")}
          >
            {copy.nav.about}
          </Link>
          <Link
            onClick={() => setOpen(false)}
            to="/explore"
            aria-current={pathname === "/explore" ? "page" : undefined}
          >
            {copy.nav.explore}
          </Link>
          <Link
            to="/#how-it-works"
            onClick={(event) => handleSectionClick(event, "how-it-works")}
          >
            {copy.nav.howItWorks}
          </Link>
          <Link
            to="/#contact"
            onClick={(event) => handleSectionClick(event, "contact")}
          >
            {copy.nav.contact}
          </Link>

          <div className="mobile-nav-actions">
            {authenticated ? (
              <div className="mobile-auth-row">
                <span className="profile-badge">
                  <IconUserCircle size={17} aria-hidden="true" />
                  <span>{email ?? "Account"}</span>
                </span>
                <button
                  type="button"
                  className="logout-button"
                  onClick={() => void handleLogout()}
                >
                  <IconLogout size={15} aria-hidden="true" />
                  {copy.nav.logout}
                </button>
              </div>
            ) : (
              <a className="login-link-mobile" href={signInHref}>
                <IconUserCircle size={17} aria-hidden="true" />
                {copy.nav.login}
              </a>
            )}
          </div>
        </nav>

        <div className="nav-actions">
          <div className="language-picker" ref={langPickerRef}>
            <button
              type="button"
              className="language-trigger"
              onClick={() => setLangOpen((prev) => !prev)}
              aria-haspopup="listbox"
              aria-expanded={langOpen}
              aria-label={`${copy.nav.language}: ${language.name} (${language.nativeName})`}
              title={`${language.nativeName} · ${language.region}`}
            >
              <IconWorld size={16} aria-hidden="true" />
              <span className="language-trigger-code">
                {language.code.toUpperCase()}
              </span>
              <span className="language-trigger-native">
                {language.nativeName}
              </span>
              <IconChevronDown
                size={14}
                aria-hidden="true"
                className={langOpen ? "language-chevron open" : "language-chevron"}
              />
            </button>

            {langOpen && (
              <div
                className="language-menu"
                role="listbox"
                aria-label={copy.nav.selectLanguage}
              >
                <div className="language-menu-header">
                  <span>{copy.nav.selectLanguage}</span>
                  <span>{languages.length}</span>
                </div>
                <div className="language-menu-list">
                  {languages.map((item) => {
                    const selected = item.code === code;
                    return (
                      <button
                        key={item.code}
                        type="button"
                        role="option"
                        aria-selected={selected}
                        className={
                          selected
                            ? "language-option active"
                            : "language-option"
                        }
                        onClick={() => {
                          setLanguage(item.code);
                          setLangOpen(false);
                        }}
                      >
                        <div className="language-option-main">
                          <span
                            className="language-option-native"
                            lang={item.code}
                            dir={item.dir}
                          >
                            {item.nativeName}
                          </span>
                          <span className="language-option-meta">
                            {item.name} · {item.region}
                          </span>
                        </div>
                        <div className="language-option-right">
                          <span className="language-option-code">
                            {item.code.toUpperCase()}
                          </span>
                          {selected && (
                            <IconCheck size={14} aria-hidden="true" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {authenticated ? (
            <div className="auth-controls">
              <span className="profile-badge" title={email ?? "Signed in"}>
                <IconUserCircle size={18} aria-hidden="true" />
                <span className="profile-email">{email ?? "Member"}</span>
              </span>
              <button
                type="button"
                className="logout-button"
                onClick={() => void handleLogout()}
                aria-label={copy.nav.logout}
              >
                <IconLogout size={15} aria-hidden="true" />
                <span>{copy.nav.logout}</span>
              </button>
            </div>
          ) : (
            <a
              className="login-link"
              href={signInHref}
              aria-label={copy.nav.login}
            >
              <IconUserCircle size={17} aria-hidden="true" />
              <span>{copy.nav.login}</span>
              <IconArrowUpRight size={15} aria-hidden="true" />
            </a>
          )}
        </div>

        <button
          type="button"
          className="menu-button"
          onClick={() => setOpen((prev) => !prev)}
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
        >
          {open ? <IconX aria-hidden="true" /> : <IconMenu2 aria-hidden="true" />}
        </button>
      </div>
    </header>
  );
}
