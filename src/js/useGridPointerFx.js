import { useEffect, useRef } from "react";
import { getPointerState } from "./useGlobalPointer";
import { useAlignedGrid } from "./useAlignedGrid";


export function useGridPointerFx(gridRef, waveClassName) {
  useAlignedGrid(gridRef);


  const rectRef = useRef({ left: 0, top: 0, width: 0, height: 0 });

  const lastRef = useRef({ x: NaN, y: NaN });

  const insideRef = useRef(null);

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;

    const updateRect = () => {
      rectRef.current = el.getBoundingClientRect();
    };
    updateRect();

    let rectRaf = null;
    const scheduleUpdateRect = () => {
      if (rectRaf !== null) return;
      rectRaf = requestAnimationFrame(() => {
        rectRaf = null;
        updateRect();
      });
    };

    const ro = new ResizeObserver(scheduleUpdateRect);
    ro.observe(el);
    window.addEventListener("resize", scheduleUpdateRect);
    window.addEventListener("scroll", scheduleUpdateRect, { passive: true });

    let isVisible = false;
    const io = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      scheduleUpdateRect();
    }, { threshold: [0, 1] });
    io.observe(el);


    let raf;
    const loop = () => {
      if (isVisible) {
        const mouse = getPointerState();
        const { left, top, width, height } = rectRef.current;
        const x = mouse.x - left;
        const y = mouse.y - top;

        if (x !== lastRef.current.x || y !== lastRef.current.y) {
          el.style.setProperty("--x", `${x}px`);
          el.style.setProperty("--y", `${y}px`);
          lastRef.current = { x, y };
        }

        const inside = x >= 0 && x <= width && y >= 0 && y <= height;
        if (inside !== insideRef.current) {
          el.classList.toggle("pointer-inside", inside);
          insideRef.current = inside;
        }
      }

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      if (rectRaf !== null) cancelAnimationFrame(rectRaf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("resize", scheduleUpdateRect);
      window.removeEventListener("scroll", scheduleUpdateRect);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}