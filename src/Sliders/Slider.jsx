import React, { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import AutoHeight from "embla-carousel-auto-height";

import Lightbox from "../Component/LightBox";
import { subscribePointer, initPointer } from "../js/pointerStore";

import "../css/slider.css";

/* ---------------- SLIDER ---------------- */

export default function Slider({ slides = [] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { align: "center", loop: true },
    [AutoHeight()]
  );

  const [scale, setScale] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [ready, setReady] = useState(false);

  // 
  const zoomWrapRefs = useRef([]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

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

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    const viewport = emblaApi.rootNode();
    const images = viewport.querySelectorAll("img");

    let loaded = 0;
    const total = images.length;

    const done = () => {
      loaded++;
      if (loaded >= total) {
        emblaApi.reInit();
        updateScale();
        onSelect();
        setReady(true);
      }
    };

    if (total === 0) {
      setReady(true);
    } else {
      images.forEach((img) => {
        if (img.complete) done();
        else {
          img.addEventListener("load", done, { once: true });
          img.addEventListener("error", done, { once: true });
        }
      });
    }

    updateScale();
    onSelect();

    emblaApi.on("scroll", updateScale);
    emblaApi.on("select", updateScale);
    emblaApi.on("select", onSelect);

    return () => {
      emblaApi.off("scroll", updateScale);
      emblaApi.off("select", updateScale);
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, updateScale, onSelect]);

  // === Glow border 
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

  const total = slides.length;
  const progressWidth =
    total > 1 ? (selectedIndex / (total - 1)) * 100 : 0;

  return (
    <>
      <div className="embla-wrapper">
        <div className="embla__controls">
          <button className="embla__ctrl-btn left" onClick={scrollPrev} style={{ transform: "rotate(-90deg)" }}>
              <img src={`${process.env.PUBLIC_URL}/sprites/icons/arrow.svg`} alt="" />
          </button>

          <button
            className="embla__zoom-btn-mobile"
            onClick={() => setLightboxIndex(selectedIndex)}
          >
            <img src={`${process.env.PUBLIC_URL}/sprites/icons/zoom.svg`} alt="" />
          </button>

          <div className="embla__progress-track">
            <div
              className="embla__progress-fill"
              style={{ width: `${progressWidth}%` }}
            />
          </div>

          <button className="embla__ctrl-btn" onClick={scrollNext} style={{ transform: "rotate(90deg)" }}>
            <img src={`${process.env.PUBLIC_URL}/sprites/icons/arrow.svg`} alt="" />
          </button>
        </div>

        <div
          className="embla"
          style={{
            visibility: ready ? "visible" : "hidden",
            minHeight: ready ? undefined : "300px",
          }}
        >
          <div className="embla__viewport" ref={emblaRef}>
            <div className="embla__container">
              {slides.map((img, i) => (
                <div className="embla__slide" key={i}>
                  <div
                    className="embla__inner"
                    style={{ transform: `scale(${scale[i] ?? 0.8})` }}
                  >
                    <div
                      className={
                        "embla__zoom-wrap" +
                        (i === selectedIndex ? " embla__zoom-wrap--active" : "")
                      }
                      ref={(el) => (zoomWrapRefs.current[i] = el)}
                      onClick={() => setLightboxIndex(i)}
                      onMouseLeave={() => handleZoomWrapLeave(i)}
                    >
                      <img src={img} alt="" />
                      <div className="embla__zoom-icon">
                        <img src={`${process.env.PUBLIC_URL}/sprites/icons/zoom.svg`} alt="" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          images={slides}
          startIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}
