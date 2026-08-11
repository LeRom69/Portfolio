const holes = new Map();
const listeners = new Set();

let rafId = null;
function notify() {
  for (const fn of listeners) fn();
}
function scheduleNotify() {
  if (rafId !== null) return;
  rafId = requestAnimationFrame(() => {
    rafId = null;
    notify();
  });
}

export const spotlightStore = {

  set(id, data) {
    holes.set(id, { id, ...data });
    scheduleNotify();
  },

  remove(id) {
    if (holes.delete(id)) {
      scheduleNotify();
    }
  },

  getHoles() {
    return Array.from(holes.values());
  },

  subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
};