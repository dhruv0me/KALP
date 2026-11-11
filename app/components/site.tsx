export { BackToTop } from "@/components/BackToTop";
export { CursorTrail } from "@/components/CursorTrail";
export { Footer } from "@/components/Footer";
export { Logo } from "@/components/Logo";
export { Navbar } from "@/components/Navbar";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
