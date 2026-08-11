import { useId, useMemo, useRef, useLayoutEffect } from "react";
import { spotlightStore } from "../js/spotlightStore";

export function Spotlight({
  className = "",
  fill = "#bcd0ff99",
  top = "-4%",
  left = "-4%",
  angle = 52,
  spreadAngle = 52,
  length = 1300,
  softness = 34,
  pulse = true,
  pulseDuration = 4,
  pulseMin = 0.85,
  pulseMax = 1,
  fog = true,
  fogCount = 3,
  fogSpread = 160,
  fogBlur = 36,
  fogOpacity = 0.12,
  clearsFog = true,
  fogClearPadding = 30,
  fogClearFeather = 380,
  fogClearStrength = 0.1,
}) {
  const id = useId().replace(/:/g, "");
  const glowRef = useRef(null);

  const geo = useMemo(() => {
    const rad = (deg) => (deg * Math.PI) / 180;
    const a = rad(angle);
    const half = rad(spreadAngle / 2);

    const apex = { x: 0, y: 0 };
    const p1 = {
      x: Math.cos(a - half) * length,
      y: Math.sin(a - half) * length,
    };
    const p2 = {
      x: Math.cos(a + half) * length,
      y: Math.sin(a + half) * length,
    };
    const farMid = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };

    const hotspot = { x: farMid.x * 0.22, y: farMid.y * 0.22 };
    const hotspotR = length * Math.tan(half) * 0.22 + 60;

    const margin = 80;
    const minX = Math.min(apex.x, p1.x, p2.x) - margin;
    const minY = Math.min(apex.y, p1.y, p2.y) - margin;
    const maxX = Math.max(apex.x, p1.x, p2.x) + margin;
    const maxY = Math.max(apex.y, p1.y, p2.y) + margin;
    const width = maxX - minX;
    const height = maxY - minY;

    return { apex, p1, p2, farMid, hotspot, hotspotR, minX, minY, width, height };
  }, [angle, spreadAngle, length]);

  const animation = pulse
    ? `spotlight-pulse-${id} ${pulseDuration}s ease-in-out infinite`
    : "none";

  const fogParticles = useMemo(() => {
    if (!fog) return [];
    return Array.from({ length: fogCount }, (_, i) => {
      const ang = (i / fogCount) * Math.PI * 2 + Math.random() * 0.8;
      const dist = fogSpread * (0.4 + Math.random() * 0.6);
      return {
        key: i,
        ox: geo.hotspot.x + Math.cos(ang) * fogSpread * 0.2,
        oy: geo.hotspot.y + Math.sin(ang) * fogSpread * 0.15,
        dx: Math.cos(ang) * dist,
        dy: Math.sin(ang) * dist,
        r: 90 + Math.random() * 120,
        dur: 7 + Math.random() * 5,
        delay: Math.random() * 4,
      };
    });
  }, [fog, fogCount, fogSpread, geo.hotspot]);

  useLayoutEffect(() => {
    if (!clearsFog) return;

    const baseline = { rect: null, scrollX: 0, scrollY: 0 };
    const lastPublished = { current: null };

    const publish = () => {
      if (!baseline.rect) return;
      const dx = window.scrollX - baseline.scrollX;
      const dy = window.scrollY - baseline.scrollY;
      const rect = baseline.rect;

      const x = Math.round(rect.left + rect.width / 2 - dx);
      const y = Math.round(rect.top + rect.height / 2 - dy);
      const r = Math.round(Math.max(rect.width, rect.height) / 2 + fogClearPadding);

      const last = lastPublished.current;
      if (last && last.x === x && last.y === y && last.r === r) return;
      lastPublished.current = { x, y, r };

      spotlightStore.set(id, {
        x,
        y,
        r,
        feather: fogClearFeather,
        strength: fogClearStrength,
      });
    };

    const measure = () => {
      const el = glowRef.current;
      if (!el) return;
      let rect = el.getBoundingClientRect();

      if (rect.width === 0 && rect.height === 0) {
        const svgEl = el.ownerSVGElement;
        const parent = svgEl?.offsetParent || svgEl?.parentElement;
        if (!parent) return;
        const prect = parent.getBoundingClientRect();
        if (prect.width === 0 && prect.height === 0) return;
        rect = prect;
      }

      baseline.rect = rect;
      baseline.scrollX = window.scrollX;
      baseline.scrollY = window.scrollY;

      publish();
    };

    let measureRaf = null;
    const scheduleMeasure = () => {
      if (measureRaf !== null) return;
      measureRaf = requestAnimationFrame(() => {
        measureRaf = null;
        measure();
      });
    };

    let scrollRaf = null;
    const scheduleScrollPublish = () => {
      if (scrollRaf !== null) return;
      scrollRaf = requestAnimationFrame(() => {
        scrollRaf = null;
        publish();
      });
    };

    const svgEl = glowRef.current?.ownerSVGElement;

    window.addEventListener("load", scheduleMeasure);
    document.fonts?.ready?.then(scheduleMeasure);

    const onAnyImageLoad = (e) => {
      if (e.target && e.target.tagName === "IMG") {
        scheduleMeasure();
      }
    };
    document.addEventListener("load", onAnyImageLoad, true);

    const ro = new ResizeObserver(scheduleMeasure);
    if (glowRef.current) ro.observe(glowRef.current);
    if (svgEl?.parentElement) ro.observe(svgEl.parentElement);

    window.addEventListener("resize", scheduleMeasure);

    window.addEventListener("scroll", scheduleScrollPublish, {
      passive: true,
      capture: true,
    });

    measure();

    return () => {
      document.removeEventListener("load", onAnyImageLoad, true);
      window.removeEventListener("load", scheduleMeasure);
      window.removeEventListener("resize", scheduleMeasure);
      window.removeEventListener("scroll", scheduleScrollPublish, true);
      ro.disconnect();
      if (measureRaf !== null) cancelAnimationFrame(measureRaf);
      if (scrollRaf !== null) cancelAnimationFrame(scrollRaf);

      spotlightStore.remove(id);
    };
  }, [clearsFog, id, fogClearPadding, fogClearFeather, fogClearStrength]);

  return (
    <>
      <style>{`
        @keyframes spotlight-pulse-${id} {
          0%, 100% { opacity: ${pulseMax}; }
          50%      { opacity: ${pulseMin}; }
        }
        @keyframes spotlight-fog-${id} {
          0%   { opacity: 0; transform: translate(0px, 0px) scale(0.6); }
          25%  { opacity: ${fogOpacity}; }
          100% { opacity: 0; transform: translate(var(--fog-dx), var(--fog-dy)) scale(1.6); }
        }
        .spotlight-${id} {
          animation: ${animation};
          opacity: 1;
          transform-origin: ${-geo.minX}px ${-geo.minY}px;
        }
        .spotlight-fog-${id} {
          animation-name: spotlight-fog-${id};
          animation-timing-function: ease-out;
          animation-iteration-count: infinite;
          opacity: 0;
          transform-box: fill-box;
          transform-origin: center;
        }
      `}</style>
      <svg
        className={`spotlight-${id} ${className}`}
        style={{
          position: "absolute",
          top,
          left,
          width: geo.width,
          height: geo.height,
          pointerEvents: "none",
          zIndex: 998,
          overflow: "visible",
        }}
        viewBox={`${geo.minX} ${geo.minY} ${geo.width} ${geo.height}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
      >
        <defs>
          <linearGradient
            id={`spotlight-grad-${id}`}
            gradientUnits="userSpaceOnUse"
            x1={geo.apex.x}
            y1={geo.apex.y}
            x2={geo.farMid.x}
            y2={geo.farMid.y}
          >
            <stop offset="0%" stopColor={fill} stopOpacity="0.95" />
            <stop offset="35%" stopColor={fill} stopOpacity="0.55" />
            <stop offset="75%" stopColor={fill} stopOpacity="0.16" />
            <stop offset="100%" stopColor={fill} stopOpacity="0" />
          </linearGradient>

          <filter
            id={`spotlight-edge-${id}`}
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
            filterUnits="objectBoundingBox"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur stdDeviation={softness} />
          </filter>

          {fog && (

            <filter
              id={`spotlight-fog-filter-${id}`}
              x="-120%"
              y="-120%"
              width="340%"
              height="340%"
              filterUnits="objectBoundingBox"
              colorInterpolationFilters="sRGB"
            >
              <feGaussianBlur stdDeviation={fogBlur} />
            </filter>
          )}
        </defs>

        <polygon
          points={`${geo.apex.x},${geo.apex.y} ${geo.p1.x},${geo.p1.y} ${geo.p2.x},${geo.p2.y}`}
          fill={`url(#spotlight-grad-${id})`}
          filter={`url(#spotlight-edge-${id})`}
        />

        <circle
          ref={glowRef}
          cx={geo.hotspot.x}
          cy={geo.hotspot.y}
          r={geo.hotspotR}
          fill="transparent"
        />

        {fog && (
          <g>
            {fogParticles.map((p) => (
              <circle
                key={p.key}
                className={`spotlight-fog-${id}`}
                cx={p.ox}
                cy={p.oy}
                r={p.r}
                fill={fill}
                filter={`url(#spotlight-fog-filter-${id})`}
                style={{
                  "--fog-dx": `${p.dx}px`,
                  "--fog-dy": `${p.dy}px`,
                  animationDuration: `${p.dur}s`,
                  animationDelay: `${p.delay}s`,
                  willChange: "transform, opacity",
                }}
              />
            ))}
          </g>
        )}
      </svg>
    </>
  );
}

export function SpotlightContainer({
  children,
  className = "",
  style = {},
  spotlightProps = {},
  background = "transparent",
}) {
  return (
    <div
      className={className}
      style={{
        position: "relative",
        background,
        ...style,
      }}
    >
      <Spotlight {...spotlightProps} />
      <div style={{ position: "relative", zIndex: 10 }}>{children}</div>
    </div>
  );
}

export default SpotlightContainer;