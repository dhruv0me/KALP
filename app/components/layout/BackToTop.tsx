import { IconArrowUp } from "@tabler/icons-react";
import { useEffect, useState } from "react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const main = document.querySelector(".agent-native-app-main");
    const update = () => {
      const mainScroll = main instanceof HTMLElement ? main.scrollTop : 0;
      setVisible(Math.max(mainScroll, window.scrollY) > 360);
    };

    update();
    main?.addEventListener("scroll", update, { passive: true });
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      main?.removeEventListener("scroll", update);
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
        document
          .querySelector(".agent-native-app-main")
          ?.scrollTo({ top: 0, behavior: "smooth" });
        if (typeof window !== "undefined" && window.scrollY !== 0) {
          window.scrollTo({ top: 0, behavior: "instant" });
        }
      }}
    >
      <IconArrowUp size={20} aria-hidden="true" />
    </button>
  );
}

