import { useLayoutEffect, useRef } from "react";
import { spotlightStore } from "../js/spotlightStore";
import "../css/fog.css";

// Максимум одновременных "дырок" (активных Spotlight на странице).
// Почти всегда их 1-3, поэтому запас с большим избытком. Если реально
// смонтировано больше — лишние просто не получат дырку (не критично,
// сами просили не гнаться за идеальной точностью, а снизить нагрузку).
const MAX_HOLES = 6;

// Инертные значения для незанятого слота: r=0 и strength=1 (полностью
// "чёрная" маска в этой точке) — то есть слот физически ничего не
// прожигает в тумане, пока не занят конкретным Spotlight.
const INERT = { x: "-99999px", y: "-99999px", r: "0px", feather: "1px", strength: "1" };

function buildMaskTemplate() {
  const cursor =
    `radial-gradient(circle at var(--x, 50vw) var(--y, 50vh), ` +
    `transparent 0px, transparent 150px, black 350px)`;

  const slots = Array.from({ length: MAX_HOLES }, (_, i) => {
    const x = `var(--h${i}x, ${INERT.x})`;
    const y = `var(--h${i}y, ${INERT.y})`;
    const r = `var(--h${i}r, ${INERT.r})`;
    const f = `var(--h${i}f, ${INERT.feather})`;
    const s = `var(--h${i}s, ${INERT.strength})`;
    return (
      `radial-gradient(circle at ${x} ${y}, ` +
      `rgba(0, 0, 0, ${s}) 0px, rgba(0, 0, 0, ${s}) ${r}, ` +
      `black calc(${r} + ${f}))`
    );
  });

  return [cursor, ...slots].join(", ");
}

// Строится один раз на модуль — сама СТРОКА mask-image никогда больше
// не пересобирается и не переприсваивается. Всё дальнейшее обновление
// позиций дырок идёт исключительно через CSS custom properties
// (el.style.setProperty), это на порядки дешевле, чем каждый раз
// заново парсить и применять новый multi-gradient mask-image.
const MASK_TEMPLATE = buildMaskTemplate();
const MASK_COMPOSITE = Array(1 + MAX_HOLES).fill("intersect").join(", ");
const MASK_COMPOSITE_WEBKIT = Array(1 + MAX_HOLES).fill("source-in").join(", ");

export default function FogLayer() {
  const fogRef = useRef(null);

  // id спотлайта -> номер слота (0..MAX_HOLES-1). Слоты переиспользуются.
  const slotOfId = useRef(new Map());
  const freeSlots = useRef(null);

  const setSlotVars = (el, i, data) => {
    if (!data) {
      el.style.setProperty(`--h${i}x`, INERT.x);
      el.style.setProperty(`--h${i}y`, INERT.y);
      el.style.setProperty(`--h${i}r`, INERT.r);
      el.style.setProperty(`--h${i}f`, INERT.feather);
      el.style.setProperty(`--h${i}s`, INERT.strength);
      return;
    }
    el.style.setProperty(`--h${i}x`, `${data.x}px`);
    el.style.setProperty(`--h${i}y`, `${data.y}px`);
    el.style.setProperty(`--h${i}r`, `${data.r}px`);
    el.style.setProperty(`--h${i}f`, `${data.feather}px`);
    el.style.setProperty(`--h${i}s`, `${data.strength}`);
  };

  useLayoutEffect(() => {
    const el = fogRef.current;
    if (!el) return;

    // Маска и mask-composite ставятся ОДИН РАЗ. Дальше — только vars.
    el.style.transition = "none";
    el.style.maskImage = MASK_TEMPLATE;
    el.style.webkitMaskImage = MASK_TEMPLATE;
    el.style.maskComposite = MASK_COMPOSITE;
    el.style.webkitMaskComposite = MASK_COMPOSITE_WEBKIT;

    freeSlots.current = Array.from({ length: MAX_HOLES }, (_, i) => i);

    const sync = () => {
      const raw = spotlightStore.getHoles();
      const seenIds = new Set();

      for (const h of raw) {
        const id = h.id ?? h.key;
        if (
          !Number.isFinite(h.x) ||
          !Number.isFinite(h.y) ||
          !Number.isFinite(h.r) ||
          h.r <= 0
        ) {
          continue;
        }
        seenIds.add(id);

        let slot = slotOfId.current.get(id);
        if (slot === undefined) {
          slot = freeSlots.current.pop();
          if (slot === undefined) continue; // слотов не осталось — пропускаем
          slotOfId.current.set(id, slot);
        }

        // Округляем — суб-пиксельная точность тут не нужна, а лишний
        // repaint от дробных значений (особенно во время скролла) это
        // чистые потери.
        setSlotVars(el, slot, {
          x: Math.round(h.x),
          y: Math.round(h.y),
          r: Math.round(h.r),
          feather: h.feather,
          strength: h.strength,
        });
      }

      // Освобождаем слоты для размонтированных Spotlight.
      for (const [id, slot] of slotOfId.current) {
        if (!seenIds.has(id)) {
          slotOfId.current.delete(id);
          freeSlots.current.push(slot);
          setSlotVars(el, slot, null);
        }
      }
    };

    sync();
    const unsubscribe = spotlightStore.subscribe(sync);
    return () => {
      unsubscribe();
    };
  }, []);

  // Курсор мыши — троттлинг через rAF, обновляем только 2 CSS-переменные.
  useLayoutEffect(() => {
    const el = fogRef.current;
    if (!el) return;

    let rafId = null;
    let lastX = null;
    let lastY = null;

    const apply = () => {
      rafId = null;
      if (lastX === null) return;
      el.style.setProperty("--x", `${lastX}px`);
      el.style.setProperty("--y", `${lastY}px`);
    };

    const onMove = (e) => {
      lastX = e.clientX;
      lastY = e.clientY;
      if (rafId === null) {
        rafId = requestAnimationFrame(apply);
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={fogRef}
      className="fog-layer"
      style={{
        willChange: "mask-image, -webkit-mask-image",
        transform: "translateZ(0)",
      }}
    />
  );
}