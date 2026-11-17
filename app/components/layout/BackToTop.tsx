import { IconArrowUp } from "@tabler/icons-react";
import { useEffect, useState } from "react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => {
      setVisible(window.scrollY > 360);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
    };
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      className="back-top"
      aria-label="Back to top"
      onClick={() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
    >
      <IconArrowUp size={20} aria-hidden="true" />
    </button>
  );
}

