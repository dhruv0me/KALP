import { useEffect } from "react";

export function CursorTrail() {
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !window.matchMedia(
        "(pointer: fine) and (prefers-reduced-motion: no-preference)",
      ).matches
    ) {
      return;
    }

    const ring = document.createElement("div");
    ring.className = "cursor-ring";
    ring.setAttribute("aria-hidden", "true");

    const dot = document.createElement("div");
    dot.className = "cursor-dot";
    dot.setAttribute("aria-hidden", "true");

    document.body.appendChild(ring);
    document.body.appendChild(dot);

    let rx = -100;
    let ry = -100;
    let dx = -100;
    let dy = -100;
    let targetX = -100;
    let targetY = -100;
    let ringScale = 1;
    let targetRingScale = 1;
    let isHovering = false;
    let frame = 0;

    const handlePointerMove = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      ring.style.opacity = "1";
      dot.style.opacity = "1";

      const target = event.target as HTMLElement | null;
      const interactive = Boolean(
        target?.closest(
          "a, button, select, input, textarea, [role='button'], label, .category, .status-pill",
        ),
      );
      isHovering = interactive;
      targetRingScale = interactive ? 1.75 : 1;
    };

    const handlePointerLeave = () => {
      ring.style.opacity = "0";
      dot.style.opacity = "0";
    };

    const animate = () => {
      // Ring follows with smooth damping
      rx += (targetX - rx) * 0.18;
      ry += (targetY - ry) * 0.18;
      ringScale += (targetRingScale - ringScale) * 0.22;

      // Inner dot follows tightly
      dx += (targetX - dx) * 0.55;
      dy += (targetY - dy) * 0.55;

      ring.style.transform = `translate3d(${rx - 14}px, ${ry - 14}px, 0) scale(${ringScale.toFixed(3)})`;
      dot.style.transform = `translate3d(${dx - 3}px, ${dy - 3}px, 0)`;

      if (isHovering) {
        ring.classList.add("cursor-ring-active");
      } else {
        ring.classList.remove("cursor-ring-active");
      }

      frame = requestAnimationFrame(animate);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.addEventListener("pointerleave", handlePointerLeave);
    frame = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerleave", handlePointerLeave);
      cancelAnimationFrame(frame);
      ring.remove();
      dot.remove();
    };
  }, []);

  return null;
}
