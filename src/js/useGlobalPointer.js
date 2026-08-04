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

// hover update — троттлим до одного React-ререндера за кадр.
// Раньше setPointer дёргал emit() на КАЖДЫЙ mousemove (сотни раз/сек),
// и все компоненты на usePointerSync() ре-рендерились чаще, чем
// браузер вообще успевает отрисовать кадр — отсюда лаги.
export function setPointer(x, y) {
  pendingX = x;
  pendingY = y;
  if (rafId === null) {
    rafId = requestAnimationFrame(flushHover);
  }
}

// click update — оставляем немедленным: кликов мало, и clickTime
// должен быть точным, троттлить их не нужно и вредно.
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

// react subscription
export function usePointerSync() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => state
  );
}