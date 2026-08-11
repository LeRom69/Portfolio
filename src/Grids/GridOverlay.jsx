import { useRef, useEffect } from "react";
import "../css/grid-unified.css";
import { useGridPointerFx } from "../js/useGridPointerFx";

export default function GridOverlay({ heroRef, className = "", waveClassName = "wave" }) {
  const gridRef = useRef(null);

  useGridPointerFx(gridRef, waveClassName);

  useEffect(() => {
    const gridEl = gridRef.current;
    const heroEl = heroRef?.current;
    if (!gridEl || !heroEl) return;

    const updateMainHeight = () => {
      const rect = heroEl.getBoundingClientRect();
      gridEl.style.setProperty("--main-h", `${rect.height}px`);
    };
    updateMainHeight();

    const ro = new ResizeObserver(updateMainHeight);
    ro.observe(heroEl);
    window.addEventListener("resize", updateMainHeight);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updateMainHeight);
    };
  }, [heroRef]);

  return (
    <div
      ref={gridRef}
      className={`grid-unified ${className}`}
      data-wave-class={waveClassName}
    >
      <div className="grid-unified__h-lines" />
      <div className="grid-unified__glow" />
      <div className="wave-layer" />
    </div>
  );
}