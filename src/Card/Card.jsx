import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Link } from "react-router-dom";
import { subscribePointer, initPointer } from "../js/pointerStore";
import { useLang } from "../Languages/LanguageContext";
import translations from "../Languages/translations";

// Helper: resolve a field that may be a string or { EN, UA } object
export function localize(field, lang) {
  if (!field) return field;
  if (typeof field === "object" && ("EN" in field || "UA" in field)) {
    return field[lang] ?? field.EN ?? "";
  }
  return field;
}

export default function Card({
  title,
  desc,
  cover,
  link,
  children,
  webName,
  index
}) {
  const ref = useRef(null);
  // Кэш rect карточки. Раньше getBoundingClientRect() вызывался на каждое
  // обновление позиции мыши, причём в КАЖДОЙ карточке на странице —
  // при списке из 10+ проектов это 10+ layout-read'ов за кадр,
  // вперемешку с записью style у соседних карточек (layout thrashing).
  // Теперь rect считается один раз и обновляется только при реальном
  // изменении лейаута (resize/scroll/ResizeObserver).
  const rectRef = useRef(null);
  const { lang } = useLang();
  const t = translations[lang].card;

  const resolvedTitle = localize(title, lang);
  const resolvedDesc = localize(desc, lang);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    initPointer();

    const updateRect = () => {
      rectRef.current = el.getBoundingClientRect();
    };
    updateRect();

    const ro = new ResizeObserver(updateRect);
    ro.observe(el);
    window.addEventListener("resize", updateRect);
    window.addEventListener("scroll", updateRect, { passive: true });

    const unsubscribe = subscribePointer((pointer) => {
      const rect = rectRef.current;
      if (!rect) return;

      const isInside =
        pointer.x >= rect.left &&
        pointer.x <= rect.right &&
        pointer.y >= rect.top &&
        pointer.y <= rect.bottom;

      if (!isInside) return;

      const x = ((pointer.x - rect.left) / rect.width) * 100;
      const y = ((pointer.y - rect.top) / rect.height) * 100;

      el.style.setProperty("--x", `${x}%`);
      el.style.setProperty("--y", `${y}%`);
    });

    return () => {
      unsubscribe();
      ro.disconnect();
      window.removeEventListener("resize", updateRect);
      window.removeEventListener("scroll", updateRect);
    };
  }, []);

  const handleLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--x", `50%`);
    el.style.setProperty("--y", `50%`);
  };

return (
  <a
     href={`${import.meta.env.BASE_URL}${link}/${webName}`}
    className="creation-card"
    ref={ref}
    onMouseLeave={handleLeave}
  >
    {cover && (
      <img
        src={cover}
        alt={resolvedTitle}
        className="creation-media"
        loading="lazy"
        decoding="async"
      />
    )}

    <div className="creation-overlay">
      {resolvedTitle && (
        <h3 className="card-title">{resolvedTitle}</h3>
      )}

      {resolvedDesc && (
        <p className="card-desc">{resolvedDesc}</p>
      )}
    <div className="creation-overlay">
      {resolvedTitle && (
        <h3 className="card-title">{resolvedTitle}</h3>
      )}

      {resolvedDesc && (
        <p className="card-desc">{resolvedDesc}</p>
      )}

      <span className="card-link">
        {t.viewProject}
      </span>
      <span className="card-link">
        {t.viewProject}
      </span>

      {children}
    </div>
  </a>
);
}

