import { useId, useMemo, useRef, useLayoutEffect } from "react";
import { spotlightStore } from "../js/spotlightStore";

/**
 * Spotlight beam — жёсткий направленный луч света (как от прожектора),
 * а не мягкое радиальное свечение. Треугольный конус с затуханием по
 * длине через linearGradient + легкая растушёвка краёв.
 *
 * Публикует свою экранную позицию в spotlightStore, чтобы FogLayer
 * мог "прокусить" туман сразу в нескольких местах независимо.
 *
 * Луч и дырка в тумане видны сразу, без ожидания появления элемента
 * в вьюпорте — позиция просто живо пересчитывается при любых
 * изменениях лейаута (resize/scroll/загрузка шрифтов и картинок).
 */
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

  // Луч виден сразу (opacity: 1), пульсация — просто периодическая
  // анимация без "въезда"/reveal.
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

  // Публикуем позицию в store синхронно, до первой отрисовки браузером
  // (useLayoutEffect), без rAF-тика — дырка в тумане появляется в том
  // же кадре, что и сам спотлайт, без единого пропущенного тика.
  useLayoutEffect(() => {
    if (!clearsFog) return;

    // baseline — результат ПОСЛЕДНЕГО настоящего замера (getBoundingClientRect)
    // вместе со scrollX/scrollY на тот момент. На scroll мы больше НЕ читаем
    // layout заново — просто сдвигаем сохранённую позицию на дельту скролла.
    // Раньше getBoundingClientRect() дёргался на каждый scroll-тик — это
    // был главный источник лагов при скролле (форсированный layout +
    // полная пересборка CSS mask-image в FogLayer на каждый кадр).
    const baseline = { rect: null, scrollX: 0, scrollY: 0 };
    const lastPublished = { current: null };

    const publish = () => {
      if (!baseline.rect) return;
      const dx = window.scrollX - baseline.scrollX;
      const dy = window.scrollY - baseline.scrollY;
      const rect = baseline.rect;

      // Округляем до целых px — суб-пиксельная точность тут не нужна,
      // а FogLayer теперь дёшево обновляет только CSS-переменные, но
      // незачем дёргать даже их на изменения меньше 1px во время скролла.
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

    // Настоящий (дорогой) замер — вызывается только при реальном
    // изменении лейаута: маунт, resize, ResizeObserver, шрифты, картинки.
    const measure = () => {
      const el = glowRef.current;
      if (!el) return;
      let rect = el.getBoundingClientRect();

      // Если размеры ещё нулевые (например, контейнер ждёт картинку/шрифт,
      // чтобы досчитать финальную высоту через flex/grid) — не блокируем
      // появление дырки ожиданием точного размера. Берём грубую оценку по
      // ближайшему спозиционированному предку.
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

    // Любая картинка на странице (даже соседняя, не сам спотлайт),
    // которая догружается позже, может поменять layout флекс/грид
    // контейнера, в котором сидит спотлайт. Слушаем 'load' в фазе
    // capture, т.к. событие load у <img> не всплывает.
    const onAnyImageLoad = (e) => {
      if (e.target && e.target.tagName === "IMG") {
        scheduleMeasure();
      }
    };
    document.addEventListener("load", onAnyImageLoad, true);

    const ro = new ResizeObserver(scheduleMeasure);
    if (glowRef.current) ro.observe(glowRef.current);
    if (svgEl?.parentElement) ro.observe(svgEl.parentElement);
    // Раньше здесь ещё был ro.observe(document.body) — ловил вообще любое
    // изменение лейаута на странице (даже в далёких, не связанных блоках),
    // что означало лишний measure()+publish() на каждый такой чих. Убрали:
    // соседние блоки, которые реально сдвигают колонку со спотлайтом,
    // почти всегда сами участвуют в изменении родителя/картинок/шрифтов,
    // которые уже отслеживаются выше.

    window.addEventListener("resize", scheduleMeasure);
    // capture: true — ловим scroll и во вложенных скролл-контейнерах
    // (событие scroll не всплывает). passive — не мешаем самому скроллу.
    window.addEventListener("scroll", scheduleScrollPublish, {
      passive: true,
      capture: true,
    });

    // Первая публикация — синхронно, до отрисовки.
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
            /* Было x/y=-200%, width/height=500% при stdDeviation=70 —
               браузер растеризовал область в 25 раз больше самой частицы
               на каждую из fogCount частиц, каждый кадр. Урезано под
               реальный радиус блюра. */
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

        {/* Невидимый маркер для измерения позиции ядра свечения */}
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