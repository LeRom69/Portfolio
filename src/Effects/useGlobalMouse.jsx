import { useEffect } from "react";
import { initPointer, subscribePointer } from "../js/pointerStore";
import { setPointer } from "../js/useGlobalPointer";

export function useGlobalMouse() {
  useEffect(() => {
    initPointer();
    return subscribePointer((p) => {
      setPointer(p.x, p.y);
    });
  }, []);
}