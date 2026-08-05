import React, { useEffect, useRef, useState } from "react";
import "../css/roadmap.css";

import GlowButton from "../Component/GlowButton";
import { subscribePointer, initPointer } from "../js/pointerStore";

import { useLang } from "../Languages/LanguageContext";
import translations from "../Languages/translations";

const icons = [
  `${process.env.PUBLIC_URL}/sprites/icons/bulb.svg`,
  `${process.env.PUBLIC_URL}/sprites/icons/warframe.svg`,
  `${process.env.PUBLIC_URL}/sprites/icons/palette.svg`,
  `${process.env.PUBLIC_URL}/sprites/icons/design.svg`,
];

export default function Roadmap() {
  const { lang } = useLang();
  const steps = translations[lang].roadmapGd.map((s, i) => ({ ...s, icon: icons[i] }));

  const stepRefs = useRef([]);
  // Курсор храним в ref, а НЕ в state — раньше subscribePointer(setPointer)
  // ре-рендерил весь Roadmap (включая все GlowButton со сложным SVG) на
  // КАЖДОЕ движение мыши по всей странице, даже когда курсор был далеко
  // от роадмапа. Теперь ref обновляется бесплатно (без ре-рендера), а
  // React state трогаем только когда реально наведён шаг (см. ниже).
  const pointerRef = useRef({ x: 0, y: 0 });
  const [activeIndex, setActiveIndex] = useState(-1);
  const [energy, setEnergy] = useState(null);
  const hideTimer = useRef(null);

  useEffect(() => {
    initPointer();
    return subscribePointer((p) => {
      pointerRef.current = p;
    });
  }, []);

  useEffect(() => {
    if (activeIndex === -1) {
      hideTimer.current = setTimeout(() => {
        setEnergy((prev) => {
          if (!prev) return null;
          return { ...prev, visible: false };
        });
      }, 100);
      return () => clearTimeout(hideTimer.current);
    }

    clearTimeout(hideTimer.current);

    const el = stepRefs.current[activeIndex];
    if (!el) return;

    // rect считаем один раз при входе в hover, а не на каждый мышемув —
    // getBoundingClientRect форсирует layout, дёргать его 60 раз/сек не нужно.
    const rect = el.getBoundingClientRect();
    const x1 = rect.left + rect.width / 2;

    let rafId = requestAnimationFrame(function tick() {
      setEnergy({
        visible: true,
        x1,
        x2: pointerRef.current.x,
      });
      rafId = requestAnimationFrame(tick);
    });

    return () => cancelAnimationFrame(rafId);
  }, [activeIndex]);

  return (
    <div className="roadmap">
      <div className="roadmap-line" />

      {energy && (
        <div
          className={`roadmap-energy ${energy.visible ? "active" : ""}`}
          style={{
            left: Math.min(energy.x1, energy.x2) - 140,
            width: Math.abs(energy.x2 - energy.x1) + 280,
          }}
        />
      )}

      {steps.map((step, i) => (
        <div
          className="roadmap-step-wrapper"
          key={i}
          onMouseEnter={() => setActiveIndex(i)}
          onMouseLeave={() => setActiveIndex(-1)}
          ref={(el) => (stepRefs.current[i] = el)}
        >
          <div className={`roadmap-step ${activeIndex === i ? "active" : ""}`}>
            <div className="roadmap-icon">
              <GlowButton>
                <img className="icon-img" src={step.icon} alt={step.title} />
              </GlowButton>
            </div>

            <div className="roadmap-content">
              <div className="title">{step.title}</div>
              <div className="desc">{step.desc}</div>
              <div className="shadow" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
