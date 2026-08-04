import { useEffect, useRef } from "react";
import "../css/grid-vert.css";
import { usePointerSync, setPointerClick, getPointerState } from "../js/useGlobalPointer";
import { useAlignedGrid } from "../js/useAlignedGrid";

export default function GridOverlayVert({ children, className = "" }) {
  const gridRef = useRef(null);
  // Один вызов на весь компонент вместо двух — раньше usePointerSync()
  // вызывался ещё раз внутри deps ниже, создавая вторую лишнюю подписку.
  const pointerState = usePointerSync();
  useAlignedGrid(gridRef); // точная подгонка ячейки под края контейнера

  // Кэш rect — обновляем только когда реально меняется лейаут
  // (resize/scroll/ResizeObserver), а не 60 раз в секунду внутри rAF.
  const rectRef = useRef({ left: 0, top: 0 });
  // Последняя записанная позиция — чтобы не трогать style/DOM,
  // если мышь стоит на месте (rAF тогда просто крутится вхолостую).
  const lastRef = useRef({ x: NaN, y: NaN });

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;

    const updateRect = () => {
      rectRef.current = el.getBoundingClientRect();
    };
    updateRect();

    // См. GridOverlay-Main.jsx: раньше updateRect() (форсированный layout)
    // вызывался напрямую на каждый 'scroll', что при инерционном скролле
    // могло стрелять чаще, чем rAF, дробя кадр на несколько синхронных
    // layout-пересчётов — как раз в момент, когда играет clip-path
    // анимация волны. Схлопываем в один rAF-тик.
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

    let raf;
    const loop = () => {
      const mouse = getPointerState();
      const { left, top } = rectRef.current;
      const x = mouse.x - left;
      const y = mouse.y - top;

      // Раньше getBoundingClientRect() дергался тут на каждый кадр —
      // форсированный layout 60 раз/сек, даже когда мышь не двигалась.
      if (x !== lastRef.current.x || y !== lastRef.current.y) {
        el.style.setProperty("--x", `${x}px`);
        el.style.setProperty("--y", `${y}px`);
        lastRef.current = { x, y };
      }

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      if (rectRaf !== null) cancelAnimationFrame(rectRaf);
      ro.disconnect();
      window.removeEventListener("resize", scheduleUpdateRect);
      window.removeEventListener("scroll", scheduleUpdateRect);
    };
  }, []);

  const handleClick = (e) => {
    setPointerClick(e.clientX, e.clientY);
  };

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;

    const mouse = getPointerState();
    const rect = rectRef.current;

    el.style.setProperty("--wx", `${mouse.clickX - rect.left}px`);
    el.style.setProperty("--wy", `${mouse.clickY - rect.top}px`);

    el.classList.remove("wave-vert");
    void el.offsetWidth;
    el.classList.add("wave-vert");
  }, [pointerState.clickTime]);

  return (
    <div ref={gridRef} className={`grid-vert ${className}`} onClick={handleClick}>
      <div className="wave-layer-vert" />
      {children}
    </div>
  );
}