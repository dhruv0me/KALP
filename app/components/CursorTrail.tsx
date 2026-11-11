import { useEffect } from "react";

export function CursorTrail() {
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)")
        .matches
    ) {
      return;
    }

    const dot = document.createElement("div");
    dot.className = "cursor-trail";
    dot.setAttribute("aria-hidden", "true");
    document.body.appendChild(dot);

    let x = -100;
    let y = -100;
    let tx = -100;
    let ty = -100;
    let scale = 1;
    let targetScale = 1;
    let frame = 0;

    const handleMove = (event: PointerEvent) => {
      tx = event.clientX;
      ty = event.clientY;
      dot.style.opacity = "1";
      const target = event.target as HTMLElement | null;
      const isInteractive = Boolean(
        target?.closest("a, button, select, input, [role='button']"),
      );
      targetScale = isInteractive ? 1.55 : 1;
    };

    const handleLeave = () => {
      dot.style.opacity = "0";
    };

    const animate = () => {
      x += (tx - x) * 0.16;
      y += (ty - y) * 0.16;
      scale += (targetScale - scale) * 0.2;
      dot.style.transform = `translate3d(${x - 8}px, ${y - 8}px, 0) scale(${scale.toFixed(3)})`;
      frame = requestAnimationFrame(animate);
    };

    window.addEventListener("pointermove", handleMove, { passive: true });
    document.addEventListener("pointerleave", handleLeave);
    frame = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      document.removeEventListener("pointerleave", handleLeave);
      cancelAnimationFrame(frame);
      dot.remove();
    };
  }, []);

  return null;
}

