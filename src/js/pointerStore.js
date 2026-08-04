let pointer = {
  x: 0,
  y: 0,
  scrollX: 0,
  scrollY: 0,
};

let listenersAttached = false;
let rafId = null;
const listeners = new Set();

function emit() {
  listeners.forEach((fn) => fn(pointer));
}

// Батчим все emit() в один раз за кадр — mousemove/scroll могут прилетать
// сотнями раз в секунду, а рендерить/писать в DOM чаще кадра смысла нет.
function scheduleEmit() {
  if (rafId !== null) return;
  rafId = requestAnimationFrame(() => {
    rafId = null;
    emit();
  });
}

export function subscribePointer(cb) {
  listeners.add(cb);
  cb(pointer);

  return () => listeners.delete(cb);
}

export function initPointer() {
  if (listenersAttached) return;
  listenersAttached = true;

  const onMove = (e) => {
    // Координаты пишем сразу (дёшево), а рассылку подписчикам — троттлим.
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    scheduleEmit();
  };

  const onScroll = () => {
    pointer.scrollX = window.scrollX;
    pointer.scrollY = window.scrollY;
    scheduleEmit();
  };

  window.addEventListener("mousemove", onMove, { passive: true });
  window.addEventListener("scroll", onScroll, { passive: true });

  onScroll();
}