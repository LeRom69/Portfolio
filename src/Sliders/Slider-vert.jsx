import React, { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import AutoHeight from "embla-carousel-auto-height";

import Lightbox from "../Component/LightBox";
import { subscribePointer, initPointer } from "../js/pointerStore";

import "../css/slider-vert.css";

// ── Основной слайдер ───────────────────────────────────────
export default function Slider({ slidesVrt = [] }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scale, setScale] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  // рефы на все .embla__slide-zoom-wrap, чтобы обновлять --x/--y только у активного
  const zoomWrapRefs = useRef([]);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { axis: "y", align: "center", loop: true },
    [AutoHeight()]
  );

  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    axis: "x",
    containScroll: "keepSnaps",
    dragFree: true,
  });

  const updateScale = useCallback(() => {
    if (!emblaApi) return;
    const progress = emblaApi.scrollProgress();
    const snaps = emblaApi.scrollSnapList();
    setScale(
      snaps.map((snap) => {
        let diff = Math.abs(snap - progress);
        diff = Math.min(diff, 1 - diff);
        return Math.max(0.75, 1 - diff * 0.8);
      })
    );
  }, [emblaApi]);

  const onThumbClick = useCallback(
    (index) => {
      if (!emblaApi || !emblaThumbsApi) return;
      emblaApi.scrollTo(index);
    },
    [emblaApi, emblaThumbsApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi || !emblaThumbsApi) return;
    const index = emblaApi.selectedScrollSnap();
    setSelectedIndex(index);
    emblaThumbsApi.scrollTo(index);
  }, [emblaApi, emblaThumbsApi]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  // Открыть лупу на текущем слайде (для мобильной кнопки)
  const openCurrentZoom = useCallback(() => {
    setLightboxIndex(selectedIndex);
  }, [selectedIndex]);

  useEffect(() => {
    if (!emblaApi) return;
    updateScale();
    onSelect();
    emblaApi.on("scroll", updateScale);
    emblaApi.on("select", updateScale);
    emblaApi.on("reInit", updateScale);
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("scroll", updateScale);
      emblaApi.off("select", updateScale);
      emblaApi.off("reInit", updateScale);
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, updateScale, onSelect]);

  // === Glow border (mouse follow) только для активного слайда ===
  useEffect(() => {
    initPointer();

    const unsubscribe = subscribePointer((pointer) => {
      const el = zoomWrapRefs.current[selectedIndex];
      if (!el) return;

      const rect = el.getBoundingClientRect();

      const x = ((pointer.x - rect.left) / rect.width) * 100;
      const y = ((pointer.y - rect.top) / rect.height) * 100;

      const isInside =
        pointer.x >= rect.left &&
        pointer.x <= rect.right &&
        pointer.y >= rect.top &&
        pointer.y <= rect.bottom;

      if (!isInside) return;

      el.style.setProperty("--x", `${x}%`);
      el.style.setProperty("--y", `${y}%`);
    });

    return unsubscribe;
  }, [selectedIndex]);

  const handleZoomWrapLeave = (i) => {
    if (i !== selectedIndex) return;
    const el = zoomWrapRefs.current[i];
    if (!el) return;
    el.style.setProperty("--x", "50%");
    el.style.setProperty("--y", "50%");
  };

  const total = slidesVrt.length;
  const progress = total > 1 ? (selectedIndex / (total - 1)) * 100 : 0;

  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" && window.innerWidth <= 1024
  );

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1024px)");
    const handleChange = (e) => setIsMobile(e.matches);

    handleChange(mq); // выставить актуальное значение сразу
    mq.addEventListener("change", handleChange);

    return () => mq.removeEventListener("change", handleChange);
  }, []);

  return (  
    <>
      <div className="embla-vertical">
        {/* Сайдбар: кнопки + прогресс */}
        <div className="embla-sidebar">
          <button
            className="embla-zoom-btn-mobile"
            onClick={openCurrentZoom}
            aria-label="Открыть в полном размере"
          >
            <img src="/sprites/icons/zoom.svg" alt="" />
          </button>

          <button className="embla-btn left" onClick={scrollPrev} aria-label="Предыдущий">
            <img src="/sprites/icons/arrow.svg" alt="" />
          </button>

          <div className="embla-progress-track">
            <div
              className="embla-progress-fill"
              style={
                isMobile
                  ? { width: `${progress}%` }
                  : { height: `${progress}%` }
              }
            />
          </div>

          <button className="embla-btn" onClick={scrollNext} aria-label="Следующий" style={{ transform: "rotate(-180deg)" }}>
            <img src="/sprites/icons/arrow.svg" alt="" />
          </button>
        </div>

        {/* Основная область */}
        <div className="embla-main">
          <div className="embla-vert">
            <div className="embla__viewport-vert" ref={emblaRef}>
              <div className="embla__container-vert">
                {slidesVrt.map((img, i) => (
                  <div className="embla__slide-vert" key={i}>
                    <div
                      className="embla__inner-vert"
                      style={{ transform: `scale(${scale[i] ?? 0.8})` }}
                    >
                      <div
                        className={
                          "embla__slide-zoom-wrap" +
                          (i === selectedIndex ? " embla__slide-zoom-wrap--active" : "")
                        }
                        ref={(el) => (zoomWrapRefs.current[i] = el)}
                        onClick={() => setLightboxIndex(i)}
                        onMouseLeave={() => handleZoomWrapLeave(i)}
                      >
                        <img src={img} alt="" draggable={false} />
                        <div className="embla__zoom-icon">
                          <img src="/sprites/icons/zoom.svg" alt="" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="embla-thumbs">
            <div className="embla-thumbs__viewport" ref={emblaThumbsRef}>
              <div className="embla-thumbs__container">
                {slidesVrt.map((img, i) => (
                  <div
                    className={"embla-thumbs__slide" + (i === selectedIndex ? " embla-thumbs__slide--selected" : "")}
                    key={i}
                  >
                    <button
                      type="button"
                      className="embla-thumbs__slide__button"
                      onClick={() => onThumbClick(i)}
                      aria-label={`Перейти к слайду ${i + 1}`}
                    >
                      <img src={img} alt="" draggable={false} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          images={slidesVrt}
          startIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}