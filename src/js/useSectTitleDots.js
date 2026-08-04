import { useEffect, useState, useRef, useCallback } from "react";

export function useSectTitleDots() {
  const [visibleTitles, setVisibleTitles] = useState({});
  const observerRef = useRef(null);

  const getObserver = useCallback(() => {
    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          setVisibleTitles((prev) => {
            const updated = { ...prev };
            entries.forEach((entry) => {
              const id = entry.target.id;
              if (!id) return;
              updated[id] = entry.isIntersecting;
            });
            return updated;
          });
        },
        { threshold: 0.5 }
      );
    }
    return observerRef.current;
  }, []);

  const registerTitle = useCallback((el) => {
    const observer = getObserver();
    if (el) observer.observe(el);
  }, [getObserver]);

  useEffect(() => {
    return () => observerRef.current?.disconnect();
  }, []);

  return { visibleTitles, registerTitle };
}