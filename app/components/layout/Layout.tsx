import { HeaderActionsProvider } from "@agent-native/toolkit/app-shell";
import { useEffect, useRef } from "react";
import { useLocation } from "react-router";
import { BackToTop } from "@/components/layout/BackToTop";
import { CursorTrail } from "@/components/layout/CursorTrail";
import { Footer } from "@/components/layout/Footer";
import { Navbar, scrollToSectionId } from "@/components/layout/Navbar";
import { LanguageProvider } from "@/hooks/use-language";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { pathname, hash } = useLocation();
  const mainRef = useRef<HTMLDivElement>(null);
  const isStandaloneAuthRoute =
    pathname === "/" || pathname === "/auth" || pathname === "/auth/";

  useEffect(() => {
    const resetWindowScroll = () => {
      if (typeof window !== "undefined" && window.scrollY !== 0) {
        window.scrollTo({ top: 0, behavior: "instant" });
      }
    };

    resetWindowScroll();
    window.addEventListener("scroll", resetWindowScroll, { passive: true });

    if (hash) {
      const targetId = hash.slice(1);
      const timer = window.setTimeout(() => {
        scrollToSectionId(targetId);
        resetWindowScroll();
      }, 80);
      return () => {
        window.clearTimeout(timer);
        window.removeEventListener("scroll", resetWindowScroll);
      };
    }
    mainRef.current?.scrollTo({ top: 0, behavior: "auto" });

    return () => window.removeEventListener("scroll", resetWindowScroll);
  }, [pathname, hash]);

  return (
    <HeaderActionsProvider>
      <LanguageProvider>
        <div className="flex h-screen w-full flex-col overflow-hidden bg-[#f9faf5] text-foreground">
          <div
            ref={mainRef}
            className="agent-native-app-main min-w-0 flex-1 overflow-y-auto overscroll-contain flex flex-col bg-[#f9faf5]"
          >
            <CursorTrail />
            {!isStandaloneAuthRoute && <Navbar />}
            <div className="flex-1 flex flex-col">{children}</div>
            {!isStandaloneAuthRoute && <Footer />}
            {!isStandaloneAuthRoute && <BackToTop />}
          </div>
        </div>
      </LanguageProvider>
    </HeaderActionsProvider>
  );
}
