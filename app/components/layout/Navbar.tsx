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
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Logo } from "@/components/layout/Logo";
import { UserAvatar } from "@/components/layout/UserAvatar";
import { useLanguage } from "@/hooks/use-language";
import { useSession } from "@/hooks/use-session";
import { clearSessionCookie } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

export function scrollToSectionId(id: string) {
  if (id === "home") {
    // @ts-expect-error lenis attached to window
    if (typeof window !== "undefined" && window.__lenis) {
      // @ts-expect-error lenis
      window.__lenis.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    return;
  }

  if (id === "contact") {
    const target = document.getElementById("contact");
    if (target) {
      // @ts-expect-error lenis attached to window
      if (typeof window !== "undefined" && window.__lenis) {
        // @ts-expect-error lenis
        window.__lenis.scrollTo(target, { duration: 1.2 });
      } else {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth",
      });
    }
    return;
  }

  const target = document.getElementById(id);
  if (!target) return;

  const rect = target.getBoundingClientRect();
  const targetTop = rect.top + window.pageYOffset;
  // For tall pinned sections (> 900px), scroll slightly into the stage where elements are centered and assembled
  const scrollOffset = target.offsetHeight > 900 ? window.innerHeight * 0.38 : 0;
  const destination = Math.max(0, targetTop + scrollOffset - 72);

  // @ts-expect-error lenis attached to window
  if (typeof window !== "undefined" && window.__lenis) {
    // @ts-expect-error lenis
    window.__lenis.scrollTo(destination, { duration: 1.2 });
  } else {
    window.scrollTo({ top: destination, behavior: "smooth" });
  }
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("home");

  const langPickerRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { authenticated, email } = useSession();
  const { code, language, languages, copy, setLanguage } = useLanguage();
  const signInHref = "/auth";

  // Active section scroll spy to match navbar links dynamically
  useEffect(() => {
    if (pathname === "/explore") {
      setActiveSection("explore");
      return;
    }

    if (pathname !== "/home" && pathname !== "/home/") {
      setActiveSection("");
      return;
    }

    let rafId: number | null = null;

    const handleScroll = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = null;

        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const docHeight = document.documentElement.scrollHeight;

        // Bottom / contact check
        if (windowHeight + scrollY >= docHeight - 240) {
          setActiveSection("contact");
          return;
        }

        const sections = [
          { id: "transparency", el: document.getElementById("blockchain") },
          { id: "transparency", el: document.getElementById("transparency") },
          { id: "how-it-works", el: document.getElementById("how-it-works") },
          { id: "about", el: document.getElementById("about") },
        ];

        let matched = "home";
        for (const sec of sections) {
          if (!sec.el) continue;
          const rect = sec.el.getBoundingClientRect();
          // Check if top of section is at or above middle of viewport
          if (rect.top <= windowHeight * 0.45 && rect.bottom >= 100) {
            matched = sec.id;
            break;
          }
        }

        setActiveSection(matched);
      });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname]);

  // Click outside menus
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
    event.preventDefault();
    setActiveSection(sectionId);
    if (pathname === "/home" || pathname === "/home/") {
      scrollToSectionId(sectionId);
    } else {
      navigate(`/home#${sectionId}`);
    }
  };

  const navItems = [
    { id: "home", label: copy.nav.home, to: "/home" },
    { id: "about", label: copy.nav.about, to: "/home#about" },
    { id: "how-it-works", label: copy.nav.howItWorks, to: "/home#how-it-works" },
    { id: "transparency", label: copy.nav.transparency ?? "Transparency", to: "/home#transparency" },
    { id: "explore", label: copy.nav.explore, to: "/explore" },
    { id: "contact", label: copy.nav.contact, to: "/home#contact" },
  ];

  return (
    <header className="site-header">
      <div className="nav-inner">
        <Logo onClick={() => setOpen(false)} />

        <nav
          className={open ? "nav-links open" : "nav-links"}
          aria-label="Main navigation"
        >
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <Link
                key={item.id}
                to={item.to}
                onClick={(event) => {
                  if (item.id === "explore") {
                    setOpen(false);
                    setActiveSection("explore");
                    return;
                  }
                  handleSectionClick(event, item.id);
                }}
                className={cn(
                  "relative py-1 px-0.5 text-xs font-semibold tracking-wide transition-colors duration-200 no-underline",
                  isActive
                    ? "text-[#173d2e] font-bold"
                    : "text-[#4a5f51] hover:text-[#173d2e]"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <span>{item.label}</span>
                {isActive && (
                  <motion.span
                    layoutId="activeNavUnderline"
                    className="absolute -bottom-1 left-0 right-0 h-[2.5px] rounded-full bg-[#2c6548]"
                    transition={{
                      type: "spring",
                      stiffness: 420,
                      damping: 32,
                    }}
                  />
                )}
              </Link>
            );
          })}

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
              aria-label={`${copy.nav.language}: ${language.name}`}
              title={`${language.name} (${language.nativeName}) · ${language.region}`}
            >
              <IconWorld size={16} aria-hidden="true" />
              <span className="language-trigger-native">
                {language.name}
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
