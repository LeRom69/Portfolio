// useAlignedGrid.js
import { useEffect } from "react";

/**
 * Пересчитывает размер ячейки сетки так, чтобы целое число ячеек
 * точно укладывалось между отступами контейнера — первая и последняя
 * линия при этом всегда совпадают с краями контентных блоков сайта
 * И с --gutter, который использует title-marker.
 *
 * Больше НЕ дублирует формулу clamp() из CSS — читает уже разрешённые
 * браузером значения --gutter и --cell-target напрямую через
 * getComputedStyle(). Это работает благодаря @property в index.css
 * (syntax: '<length>'), которая заставляет браузер резолвить clamp()
 * в конкретные px вместо хранения как необработанной строки токенов.
 */
export function useAlignedGrid(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const readPx = (varName, fallback) => {
      const raw = getComputedStyle(el).getPropertyValue(varName).trim();
      const val = parseFloat(raw);
      return Number.isFinite(val) ? val : fallback;
    };

    const recalc = () => {
      const width = el.getBoundingClientRect().width;
      if (!width) return;

      // читаем уже вычисленные браузером значения из index.css :root
      // (--gutter и --cell-target зарегистрированы через @property)
      const gutter = readPx("--gutter", 58);
      const desiredCell = readPx("--cell-target", 110);

      const available = Math.max(0, width - gutter * 2);
      const count = Math.max(1, Math.round(available / desiredCell));
      const actualCell = available / count;

      el.style.setProperty("--cell", `${actualCell}px`);
      el.style.setProperty("--edge", `${gutter}px`);
    };

    recalc();

    const ro = new ResizeObserver(recalc);
    ro.observe(el);

    // --gutter/--cell-target зависят от vw, а не только от ширины
    // контейнера — ResizeObserver не поймает изменение window при
    // неизменном размере самого контейнера
    window.addEventListener("resize", recalc);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", recalc);
    };
  }, [ref]);
}