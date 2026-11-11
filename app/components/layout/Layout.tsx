import { HeaderActionsProvider } from "@agent-native/toolkit/app-shell";
import { useEffect, useRef } from "react";
import { useLocation } from "react-router";
import { BackToTop } from "@/components/BackToTop";
import { CursorTrail } from "@/components/CursorTrail";
import { Footer } from "@/components/Footer";
import { Navbar, scrollToSectionId } from "@/components/Navbar";
import { LanguageProvider } from "@/hooks/use-language";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { pathname, hash } = useLocation();
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (hash) {
      const targetId = hash.slice(1);
      const timer = window.setTimeout(() => {
        scrollToSectionId(targetId);
      }, 60);
      return () => window.clearTimeout(timer);
    }
    mainRef.current?.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname, hash]);

  return (
    <HeaderActionsProvider>
      <LanguageProvider>
        <div className="flex h-screen w-full flex-col overflow-hidden bg-background text-foreground">
          <div
            ref={mainRef}
            className="agent-native-app-main min-w-0 flex-1 overflow-y-auto overscroll-contain"
          >
            <CursorTrail />
            <Navbar />
            {children}
            <Footer />
            <BackToTop />
          </div>
        </div>
      </LanguageProvider>
    </HeaderActionsProvider>
  );
}
