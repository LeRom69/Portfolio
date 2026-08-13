import { useEffect } from "react";
import { initPointer, subscribePointer } from "../js/pointerStore";
import { setPointer } from "../js/useGlobalPointer";

const SCROLL_IDLE_DELAY = 150;

export function useGlobalMouse() {
  useEffect(() => {
    initPointer();
    return subscribePointer((p) => {
      setPointer(p.x, p.y);
    });
  }, []);

  useEffect(() => {
    let timeoutId = null;

    const onScroll = () => {
      document.body.classList.add("is-scrolling");
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        document.body.classList.remove("is-scrolling");
      }, SCROLL_IDLE_DELAY);
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(timeoutId);
      document.body.classList.remove("is-scrolling");
    };
  }, []);
}