import React, { useId } from "react";
import "../css/glow-button.css";

export default function GlowButton({ children = "Get Started", onClick }) {

  const uid = useId().replace(/:/g, "");

  const [w, setW] = React.useState(280);
  const [h, setH] = React.useState(50);
  const ref = React.useRef(null);
  const svgRef = React.useRef(null);

  React.useLayoutEffect(() => {
    if (!ref.current) return;

    let raf = 0;
    const measure = () => {
      raf = 0;
      if (!ref.current) return;
      const nw = ref.current.offsetWidth;
      const nh = ref.current.offsetHeight;
      setW((prev) => (prev === nw ? prev : nw));
      setH((prev) => (prev === nh ? prev : nh));
    };
    const schedule = () => {
      if (raf) return;
      raf = requestAnimationFrame(measure);
    };

    measure();

    const ro = new ResizeObserver(schedule);
    ro.observe(ref.current);
    return () => {
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };

  }, [children]);

  React.useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl || typeof svgEl.pauseAnimations !== "function") return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          svgEl.unpauseAnimations();
        } else {
          svgEl.pauseAnimations();
        }
      },
      { threshold: 0 }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  const r = 10; 
  const H = h; 
  const d = `M${r},2 H${w - r} Q${w - 2},2 ${w - 2},${r} V${H - r} Q${w - 2},${H - 2} ${w - r},${H - 2} H${r} Q2,${H - 2} 2,${H - r} V${r} Q2,2 ${r},2 Z`;

  return (
    <button ref={ref} className="glow-btn" onClick={onClick}>
      <svg
        ref={svgRef}
        className="glow-btn-svg"
        viewBox={`0 0 ${w} ${h}`}
        preserveAspectRatio="none"
      >
        <defs>
          {/* Только маска — она уникальна для каждой кнопки, т.к. движется по её собственному пути */}
          <mask id={`mask-${uid}`}>
            <rect width="100%" height="100%" fill="black" />
            <circle r="60" fill="url(#glow-btn-fade)">
              <animateMotion dur="2.5s" repeatCount="indefinite">
                <mpath href={`#p-${uid}`} />
              </animateMotion>
            </circle>
          </mask>
        </defs>

        <path id={`p-${uid}`} d={d} fill="none" stroke="none" />

        <path d={d} fill="none" stroke="rgba(160,108,255,0.15)" strokeWidth="1.5" />

        <path
          d={d}
          fill="none"
          stroke="url(#glow-btn-eg)"
          strokeWidth="3"
          filter="url(#glow-btn-glow)"
          mask={`url(#mask-${uid})`}
        />

        <circle r="5" fill="#fff" filter="url(#glow-btn-spark)">
          <animateMotion dur="2.5s" repeatCount="indefinite">
            <mpath href={`#p-${uid}`} />
          </animateMotion>
        </circle>
      </svg>

      <span className="glow-btn-text">{children}</span>
    </button>
  );
}