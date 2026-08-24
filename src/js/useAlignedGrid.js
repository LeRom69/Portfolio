// useAlignedGrid.js
import { useEffect } from "react";

export function useAlignedGrid(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const readPx = (varName, fallback) => {
      const raw = getComputedStyle(el).getPropertyValue(varName).trim();
      const val = parseFloat(raw);
      return Number.isFinite(val) ? val : fallback;
    };

    const getCanonicalWidth = () => {
      return (
        document.documentElement.clientWidth ||
        el.getBoundingClientRect().width
      );
    };

    let lastWidth = null;

    const recalc = () => {
      const width = getCanonicalWidth();
      if (!width) return;

      // На мобильных resize стреляет и от скрытия/показа адресной строки —
      // при этом меняется только высота. Пересчитываем сетку только
      // если реально изменилась ширина.
      if (width === lastWidth) return;
      lastWidth = width;

      const gutter = readPx("--gutter", 58);
      const desiredCell = readPx("--cell-target", 110);

      const available = Math.max(0, width - gutter * 2);
      const count = Math.max(1, Math.round(available / desiredCell));
      const actualCell = available / count;

      el.style.setProperty("--cell", `${actualCell}px`);
      el.style.setProperty("--edge", `${gutter}px`);
    };

    recalc();

    const ro = new ResizeObserver(recalc);
    ro.observe(el);

    window.addEventListener("resize", recalc);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", recalc);
    };
  }, [ref]);
}