import { useEffect, useRef } from "react";
import "../css/page-loader.css";

import GridOverlay from "../Grids/GridOverlay";

const PARTICLE_COUNT = 90;
const TAU = Math.PI * 2;

// two accent colors particles interpolate between as they fall inward
const COLOR_OUTER = [124, 156, 255]; // periwinkle
const COLOR_INNER = [255, 255, 255]; // white-hot at the core

// wheel geometry
const WHEEL_RADIUS = 16;
const WHEEL_THICKNESS = 3;
const WHEEL_SWEEP = Math.PI * 1.15; // arc length of the spinning segment
const WHEEL_SPEED = TAU * 0.9; // radians / second

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function mix(t) {
  return [
    Math.round(lerp(COLOR_OUTER[0], COLOR_INNER[0], t)),
    Math.round(lerp(COLOR_OUTER[1], COLOR_INNER[1], t)),
    Math.round(lerp(COLOR_OUTER[2], COLOR_INNER[2], t)),
  ];
}

function makeParticle(seedOuter = true) {
  return {
    angle: Math.random() * TAU,
    // start near the rim, or (only for initial seeding) anywhere along the path
    progress: seedOuter ? Math.random() * 0.25 : 0,
    speed: 0.16 + Math.random() * 0.14,
    spin: (Math.random() < 0.5 ? -1 : 1) * (0.35 + Math.random() * 0.5),
    size: 1 + Math.random() * 1.6,
  };
}

function drawWheel(ctx, cx, cy, rotation) {
  // faint full track so the wheel reads as a ring, not just a floating arc
  ctx.beginPath();
  ctx.strokeStyle = "rgba(255,255,255,0.18)";
  ctx.lineWidth = WHEEL_THICKNESS;
  ctx.arc(cx, cy, WHEEL_RADIUS, 0, TAU);
  ctx.stroke();

  // spinning segment, plain white, rounded caps like a classic spinner
  ctx.beginPath();
  ctx.lineCap = "round";
  ctx.lineWidth = WHEEL_THICKNESS;
  ctx.strokeStyle = "rgba(255,255,255,0.95)";
  ctx.arc(cx, cy, WHEEL_RADIUS, rotation, rotation + WHEEL_SWEEP);
  ctx.stroke();
}

export default function PageLoader() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const particles = Array.from({ length: PARTICLE_COUNT }, () =>
      makeParticle(true)
    );

    let raf;
    let last = performance.now();
    let wheelRotation = 0;

    const renderStaticFrame = () => {
      const cx = width / 2;
      const cy = height / 2;
      const maxR = Math.min(width, height) * 0.42;
      ctx.clearRect(0, 0, width, height);
      // a few settled particles, no motion
      [0.12, 0.22, 0.32, 0.42, 0.52, 0.62].forEach((t, i) => {
        const angle = (i / 6) * TAU;
        const r = maxR * (1 - t) * 0.3;
        const [r1, g1, b1] = mix(t);
        ctx.beginPath();
        ctx.fillStyle = `rgba(${r1},${g1},${b1},0.9)`;
        ctx.arc(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r, 2, 0, TAU);
        ctx.fill();
      });
      drawWheel(ctx, cx, cy, -Math.PI / 2);
    };

    const draw = (now) => {
      const dt = Math.min(now - last, 48) / 1000;
      last = now;

      const cx = width / 2;
      const cy = height / 2;
      const maxR = Math.min(width, height) * 0.42;

      // trail fade instead of a hard clear -> comet tails
      ctx.fillStyle = "rgba(0, 3, 13, 0.77)";
      ctx.fillRect(0, 0, width, height);

      particles.forEach((p) => {
        p.progress += p.speed * dt;
        p.angle += p.spin * dt * (1 + p.progress * 1.8); // spins faster near the core
        if (p.progress >= 1) {
          Object.assign(p, makeParticle(false));
        }

        const r = maxR * (1 - p.progress);
        const x = cx + Math.cos(p.angle) * r;
        const y = cy + Math.sin(p.angle) * r;
        const [cr, cg, cb] = mix(p.progress);
        const alpha = 0.25 + p.progress * 0.7;

        ctx.beginPath();
        ctx.fillStyle = `rgba(${cr},${cg},${cb},${alpha.toFixed(3)})`;
        ctx.arc(x, y, p.size * (0.6 + p.progress * 0.8), 0, TAU);
        ctx.fill();
      });

      // center: a spinning loading wheel instead of a converging point
      wheelRotation += WHEEL_SPEED * dt;
      drawWheel(ctx, cx, cy, wheelRotation);

      raf = requestAnimationFrame(draw);
    };

    if (prefersReducedMotion) {
      renderStaticFrame();
    } else {
      raf = requestAnimationFrame(draw);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="page-loader" role="status" aria-label="Loading">
      <canvas ref={canvasRef} className="page-loader-canvas" />
      <GridOverlay className="grid-unified--vertical-only" waveClassName="wave" />
    </div>
  );
}