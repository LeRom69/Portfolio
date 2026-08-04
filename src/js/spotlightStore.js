/**
 * spotlightStore
 *
 * Глобальный key-value store для позиций всех активных Spotlight.
 * Каждый <Spotlight> публикует свою дырку под собственным уникальным id
 * (useId из React), поэтому несколько прожекторов могут работать
 * одновременно и независимо — FogLayer просто рисует по одной
 * radial-gradient-маске на каждую запись в этой Map.
 */

const holes = new Map();
const listeners = new Set();

// Если на странице несколько <Spotlight> (например, About + секция
// проекта), каждый вызов set() раньше вызывал notify() СРАЗУ — и если
// несколько прожекторов обновлялись в один и тот же кадр (например, при
// скролле), FogLayer пересобирал свою (дорогую) CSS mask-image СТОЛЬКО
// РАЗ, сколько было прожекторов, за один кадр. Теперь все set()/remove()
// в рамках одного кадра схлопываются в один notify().
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
  /**
   * Зарегистрировать/обновить дырку конкретного Spotlight.
   * id должен быть стабильным и уникальным на весь жизненный цикл
   * компонента (передаётся useId из Spotlight.jsx).
   */
  set(id, data) {
    holes.set(id, { id, ...data });
    scheduleNotify();
  },

  /**
   * Убрать дырку — вызывается при размонтировании Spotlight.
   */
  remove(id) {
    if (holes.delete(id)) {
      scheduleNotify();
    }
  },

  /**
   * Текущий снимок всех активных дырок в виде массива.
   * Порядок — порядок вставки (Map это гарантирует), это не важно для
   * рендера маски, но полезно для стабильности при отладке.
   */
  getHoles() {
    return Array.from(holes.values());
  },

  /**
   * Подписка на любые изменения (set/remove любого id).
   * Возвращает функцию отписки.
   */
  subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
};