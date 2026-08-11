import React, { useEffect, useRef } from "react";
import { initPointer, subscribePointer } from "../js/pointerStore";
import "../css/line.css";

export default function Line() {
  const lineRef = useRef(null);

  useEffect(() => {
    initPointer();

    const unsub = subscribePointer((p) => {
      if (!lineRef.current) return;

      const rect = lineRef.current.getBoundingClientRect();

      const x = p.x - rect.left;
      const y = p.y - rect.top;

      lineRef.current.style.setProperty("--px", `${x}px`);
      lineRef.current.style.setProperty("--py", `${y}px`);
    });

    return () => unsub();
  }, []);

  return <div ref={lineRef} className="line" />;
}