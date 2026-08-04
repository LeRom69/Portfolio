import { useEffect } from "react";
import { initPointer, subscribePointer } from "../js/pointerStore";
import { setPointer } from "../js/useGlobalPointer";

// Раньше здесь висел собственный window.addEventListener("mousemove", ...),
// который дублировал точно такой же слушатель в pointerStore.js — на КАЖДОЕ
// движение мыши на странице срабатывали два независимых глобальных
// обработчика, делающих одно и то же (два разных стора координат курсора).
//
// Теперь useGlobalMouse не заводит свой mousemove, а переиспользует уже
// существующую подписку pointerStore (там слушатель уже один на всё
// приложение и уже троттлится через rAF) и просто пробрасывает координаты
// дальше в useGlobalPointer — для всех, кто использует usePointerSync /
// getPointerState (например GridOverlay), ничего не меняется.
export function useGlobalMouse() {
  useEffect(() => {
    initPointer();
    return subscribePointer((p) => {
      setPointer(p.x, p.y);
    });
  }, []);
}