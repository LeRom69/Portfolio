import { useSyncExternalStore } from "react";

let state = {
  x: 0,
  y: 0,
  clickX: 0,
  clickY: 0,
  clickTime: 0,
};

const listeners = new Set();

let rafId = null;
let pendingX = state.x;
let pendingY = state.y;

function emit() {
  listeners.forEach((l) => l());
}

function flushHover() {
  rafId = null;
  state = { ...state, x: pendingX, y: pendingY };
  emit();
}

export function setPointer(x, y) {
  pendingX = x;
  pendingY = y;
  if (rafId === null) {
    rafId = requestAnimationFrame(flushHover);
  }
}

export function setPointerClick(x, y) {
  state = {
    ...state,
    clickX: x,
    clickY: y,
    clickTime: Date.now(),
  };
  emit();
}

export function getPointerState() {
  return state;
}

export function usePointerSync() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => state
  );
}

if (typeof window !== "undefined") {

window.addEventListener(
  "click",
  (e) => {

    const interactive = e.target.closest(
      "button, a, input, textarea, select, [role='button'], [role='link']"
    );

    if (interactive) return;

    setPointerClick(e.clientX, e.clientY);

    const stack = document.elementsFromPoint(
      e.clientX,
      e.clientY
    );

    const gridEl =
      stack.find(
        (n) =>
          n.classList?.contains("grid-unified") &&
          n.classList.contains("pointer-inside")
      ) ||
      stack.find((n) =>
        n.classList?.contains("grid-unified")
      );

    if (!gridEl) return;

    const rect = gridEl.getBoundingClientRect();

    const wx = e.clientX - rect.left;
    const wy = e.clientY - rect.top;

    gridEl.style.setProperty("--wx", `${wx}px`);
    gridEl.style.setProperty("--wy", `${wy}px`);

    const waveClassName =
      gridEl.dataset.waveClass || "wave";

    gridEl.classList.remove(waveClassName);

    void gridEl.offsetWidth;

    gridEl.classList.add(waveClassName);
  },
  true
);
}