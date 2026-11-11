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
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Logo } from "@/components/layout/Logo";
import { UserAvatar } from "@/components/layout/UserAvatar";
import { useLanguage } from "@/hooks/use-language";
import { useSession } from "@/hooks/use-session";
import { clearSessionCookie } from "@/lib/auth-client";

export function scrollToSectionId(id: string) {
  if (typeof window !== "undefined" && window.scrollY !== 0) {
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  const target = document.getElementById(id);
  const main = document.querySelector<HTMLElement>(".agent-native-app-main");

  if (!target) return;

  if (main) {
    if (id === "contact") {
      main.scrollTo({
        top: main.scrollHeight,
        behavior: "smooth",
      });
      return;
    }

    const mainRect = main.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const targetTop = targetRect.top - mainRect.top + main.scrollTop;

    main.scrollTo({
      top: Math.max(0, targetTop - 70),
      behavior: "smooth",
    });
    return;
  }

  if (id === "contact") {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  } else {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const langPickerRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { pathname, hash } = useLocation();
  const { authenticated, email } = useSession();
  const { code, language, languages, copy, setLanguage } = useLanguage();
  const signInHref = "/auth";

  useEffect(() => {
    if (!langOpen && !userMenuOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (langPickerRef.current && !langPickerRef.current.contains(target)) {
        setLangOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(target)) {
        setUserMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setLangOpen(false);
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [langOpen, userMenuOpen]);

  const handleLogout = async () => {
    setOpen(false);
    setUserMenuOpen(false);
    await clearSessionCookie();
    queryClient.setQueryData(["action", "get-session", {}], {
      authenticated: false,
      email: null,
    });
    await queryClient.invalidateQueries();
    if (
      pathname.startsWith("/start-campaign") ||
      pathname.startsWith("/member/")
    ) {
      navigate("/home");
    }
  };

  const handleSectionClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    sectionId: string,
  ) => {
    setOpen(false);
    if (pathname === "/home" || pathname === "/home/") {
      event.preventDefault();
      window.history.replaceState(null, "", `/home#${sectionId}`);
      scrollToSectionId(sectionId);
    }
  };

  const isHomeRoute = pathname === "/home" || pathname === "/home/";

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
            to="/home"
            aria-current={isHomeRoute && !hash ? "page" : undefined}
          >
            {copy.nav.home}
          </Link>
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
          <Link
            onClick={() => setOpen(false)}
            to="/explore"
            aria-current={pathname === "/explore" ? "page" : undefined}
          >
            {copy.nav.explore}
          </Link>
          <Link
            to="/home#contact"
            onClick={(event) => handleSectionClick(event, "contact")}
          >
            {copy.nav.contact}
          </Link>

          <div className="mobile-nav-actions">
            {authenticated ? (
              <div className="mobile-auth-row">
                <span className="profile-badge">
                  <UserAvatar email={email} size={28} />
                  <span>{email ?? "Member"}</span>
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
              <Link
                className="login-link-mobile"
                to={signInHref}
                onClick={() => setOpen(false)}
              >
                <IconUserCircle size={17} aria-hidden="true" />
                {copy.nav.login}
              </Link>
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
            <div className="user-menu-wrap" ref={userMenuRef}>
              <button
                type="button"
                className="user-avatar-button"
                onClick={() => setUserMenuOpen((prev) => !prev)}
                aria-haspopup="menu"
                aria-expanded={userMenuOpen}
                aria-label={email ? `Account menu (${email})` : "Account menu"}
                title={email ?? "Member account"}
              >
                <UserAvatar email={email} size={38} />
              </button>

              {userMenuOpen && (
                <div className="user-menu-dropdown" role="menu">
                  <div className="user-menu-header">
                    <UserAvatar email={email} size={32} />
                    <div className="user-menu-meta">
                      <strong>Signed in</strong>
                      <span>{email ?? "KALP Member"}</span>
                    </div>
                  </div>
                  <Link
                    to="/start-campaign"
                    role="menuitem"
                    className="user-menu-item"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <span>Creator Studio &amp; Saved</span>
                    <IconArrowUpRight size={14} aria-hidden="true" />
                  </Link>
                  <button
                    type="button"
                    role="menuitem"
                    className="user-menu-item user-menu-logout"
                    onClick={() => void handleLogout()}
                  >
                    <span>{copy.nav.logout}</span>
                    <IconLogout size={14} aria-hidden="true" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              className="login-link"
              to={signInHref}
              aria-label={copy.nav.login}
            >
              <IconUserCircle size={17} aria-hidden="true" />
              <span>{copy.nav.login}</span>
              <IconArrowUpRight size={15} aria-hidden="true" />
            </Link>
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
