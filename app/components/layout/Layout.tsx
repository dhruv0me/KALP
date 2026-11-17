import { HeaderActionsProvider } from "@agent-native/toolkit/app-shell";
import ReactLenis from "lenis/react";
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
    if (hash) {
      const targetId = hash.slice(1);
      const timer = window.setTimeout(() => {
        scrollToSectionId(targetId);
      }, 100);
      return () => {
        window.clearTimeout(timer);
      };
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname, hash]);

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.08,
        duration: 1.4,
        smoothWheel: true,
      }}
    >
      <HeaderActionsProvider>
        <LanguageProvider>
          <div className="min-h-screen w-full flex flex-col bg-[#f9faf5] text-foreground">
            <div
              ref={mainRef}
              className="agent-native-app-main min-w-0 flex-1 flex flex-col bg-[#f9faf5]"
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
    </ReactLenis>
  );
}
