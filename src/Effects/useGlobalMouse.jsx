import { useEffect } from "react";
import { initPointer, subscribePointer } from "../js/pointerStore";
import { setPointer } from "../js/useGlobalPointer";

const IDLE_MS = 120;                 // сколько ждать без "трекпадных" событий, прежде чем считать скролл законченным
const WHEEL_GAP_TRACKPAD = 80;       // мс между wheel-событиями — если короче, это непрерывный жест, не клик колеса
const TRACKPAD_DELTA_THRESHOLD = 50; // px — шаг колеса мыши обычно крупнее этого

export function useGlobalMouse() {
  useEffect(() => {
    initPointer();
    return subscribePointer((p) => {
      setPointer(p.x, p.y);
    });
  }, []);

  useEffect(() => {
    let idleTimer = null;
    let scrolling = false;
    let lastWheelTime = 0;

    const start = () => {
      clearTimeout(idleTimer);
      if (!scrolling) {
        scrolling = true;
        document.body.classList.add("is-scrolling");
      }
      idleTimer = setTimeout(stop, IDLE_MS);
    };

    const stop = () => {
      scrolling = false;
      document.body.classList.remove("is-scrolling");
    };

    // Тач — всегда считаем "трекпадным" поведением
    const onTouchMove = () => start();
    const onTouchEnd = () => {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(stop, IDLE_MS);
    };

    // Wheel — отличаем трекпад от колеса мыши
    const onWheel = (e) => {
      const now = performance.now();
      const gap = now - lastWheelTime;
      lastWheelTime = now;

      const looksLikeTrackpad =
        !Number.isInteger(e.deltaY) ||                    // дробная дельта — почти всегда трекпад
        Math.abs(e.deltaY) < TRACKPAD_DELTA_THRESHOLD ||   // мелкий шаг — палец, а не щелчок колеса
        gap < WHEEL_GAP_TRACKPAD;                          // события идут слишком часто для дискретных кликов

      if (looksLikeTrackpad) {
        start();
      }
      // обычное колесо мыши — is-scrolling не трогаем, глоу остаётся как есть
    };

    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: true });

    return () => {
      clearTimeout(idleTimer);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("wheel", onWheel);
      document.body.classList.remove("is-scrolling");
    };
  }, []);
}