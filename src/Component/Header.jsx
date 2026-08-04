import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import "../css/header.css";
import { useLang } from "../Languages/LanguageContext";
import translations from "../Languages/translations";

export default function Header() {
  const { lang, toggle } = useLang();
  const t = translations[lang].nav;

  const [scroll, setScroll] = useState(false);
  const [worksOpen, setWorksOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileClosing, setMobileClosing] = useState(false);
  const [mobileWorksOpen, setMobileWorksOpen] = useState(false);

  const closeTimer = useRef(null);
  const burgerCloseTimer = useRef(null);
  const drawerRef = useRef(null);
  const location = useLocation();

  const path = location.pathname;
  const onProjectPage = path.startsWith("/uiux-design/") || path.startsWith("/visual-design/");

  const isHome = path === "/" && !onProjectPage && activeSection === "home";
  const isContact = !onProjectPage && activeSection === "contact";
  const isWorks =
    onProjectPage ||
    (path === "/" &&
      (activeSection === "uiux-design" ||
        activeSection === "visual-design" ||
        activeSection === "illustrations"));

  useEffect(() => {
    // Троттлим через rAF: scroll может стрелять чаще, чем рендерится кадр,
    // а setScroll с одним и тем же boolean и так не дал бы лишний рендер,
    // но сам вызов колбэка + чтение window.scrollY на каждое событие —
    // лишняя работа, которую можно свести к одному разу за кадр.
    let rafId = null;
    const onScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        setScroll(window.scrollY > 20);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    if (path !== "/") return;
    const ids = ["home", "uiux-design", "visual-design", "illustrations", "contact"];
    const elements = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Берём из всех текущих пересечений только тот элемент, чей центр
        // ближе всего к центру viewport, а не первый попавшийся из entries.
        // Иначе при коротких секциях (например, visual-design) при быстром
        // скролле в узкую полосу observer'а одновременно попадает несколько
        // секций, и активной становится случайная — та, что оказалась
        // последней в массиве entries, а не та, что реально видна по центру.
        const visible = entries.filter((e) => e.isIntersecting);
        if (!visible.length) return;

        const viewportCenter = window.innerHeight / 2;
        const closest = visible.reduce((best, e) => {
          const rect = e.target.getBoundingClientRect();
          const elCenter = rect.top + rect.height / 2;
          const dist = Math.abs(elCenter - viewportCenter);
          return dist < best.dist ? { id: e.target.id, dist } : best;
        }, { id: null, dist: Infinity });

        if (closest.id) setActiveSection(closest.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [path, location]);

  // Закрытие drawer с анимацией бургера
  const closeMobile = () => {
    if (!mobileOpen) return;
    setMobileClosing(true);
    setMobileOpen(false);
    clearTimeout(burgerCloseTimer.current);
    // длительность должна совпадать с transition бургера/drawer в CSS
    burgerCloseTimer.current = setTimeout(() => {
      setMobileClosing(false);
    }, 350);
  };

  const toggleMobile = () => {
    if (mobileOpen) {
      closeMobile();
    } else {
      clearTimeout(burgerCloseTimer.current);
      setMobileClosing(false);
      setMobileOpen(true);
    }
  };

  const burgerRef = useRef(null);
  // закрыть drawer при клике вне
  useEffect(() => {
    if (!mobileOpen) return;
    const handler = (e) => {
      if (
        drawerRef.current && !drawerRef.current.contains(e.target) &&
        burgerRef.current && !burgerRef.current.contains(e.target)
      ) {
        closeMobile();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [mobileOpen]);

  // закрыть drawer при переходе
  useEffect(() => {
    closeMobile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  useEffect(() => () => clearTimeout(burgerCloseTimer.current), []);

  const openMenu = () => { clearTimeout(closeTimer.current); setWorksOpen(true); };
  const closeMenu = () => { closeTimer.current = setTimeout(() => setWorksOpen(false), 250); };

  return (
    <>
      <div className={`ai-bar ${scroll ? "shrink" : ""}`}>

        {/* LEFT */}
        <div className="ai-left">
          <span className="ai-logo">
            <img src="/sprites/logo.svg" alt="VR Logo" />
          </span>
          <span className="ai-name">V.<br/>ROMANISHYNA</span>
        </div>

        {/* CENTER — desktop nav */}
        <nav className="ai-nav">
          <a href="/" className={isHome ? "active" : ""}>{t.home}</a>

          <div className="ai-dd" onMouseEnter={openMenu} onMouseLeave={closeMenu}>
            <button className={isWorks ? "active" : ""}>
              {t.works}
              <svg className={`ai-chevron ${worksOpen ? "open" : ""}`} width="10" height="10" viewBox="0 0 10 10">
                <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <div className={`ai-menu ${worksOpen ? "open" : ""}`}>
              <span className="ai-menu-line" />
              <a href="/#uiux-design" className={`dd-item ${activeSection === "uiux-design" ? "active" : ""}`}>
                <span>{t.ui}</span>
              </a>
              <span className="dd-line"><span className="dd-track" /><span className="dd-dot" /></span>
              <a href="/#visual-design" className={`dd-item ${activeSection === "visual-design" ? "active" : ""}`}>
                <span>{t.branding}</span>
              </a>
              <span className="dd-line"><span className="dd-track" /><span className="dd-dot" /></span>
              <a href="/#illustrations" className={`dd-item ${activeSection === "illustrations" ? "active" : ""}`}>
                <span>{t.illustrations}</span>
              </a>
              <span className="dd-line"><span className="dd-track" /><span className="dd-dot" /></span>
            </div>
          </div>

          <a href="/#contact" className={isContact ? "active" : ""}>{t.contact}</a>
        </nav>

        {/* RIGHT — desktop lang */}
        <div className="ai-right">
          <div className="lang" onClick={toggle}>
            <span className={`lang-pill ${lang === "UA" ? "shift" : ""}`} />
            <span className={lang === "EN" ? "on" : ""}>EN</span>
            <span className={lang === "UA" ? "on" : ""}>UA</span>
          </div>
        </div>

        {/* BURGER — mobile only */}
        <button
          ref={burgerRef}
          className={`ai-burger ${mobileOpen ? "open" : ""} ${mobileClosing ? "closing" : ""}`}
          aria-label="Menu"
          aria-expanded={mobileOpen}
          onClick={toggleMobile}
        >
          <span /><span /><span />
        </button>
      </div>

      {/* MOBILE DRAWER */}
      <div
        ref={drawerRef}
        className={`ai-drawer ${mobileOpen ? "open" : ""} ${mobileClosing ? "closing" : ""}`}
        aria-hidden={!mobileOpen}
      >

        <a href="/" className={isHome ? "active" : ""}>
          <span>{t.home}</span>
        </a>

        <div className="ai-drawer-line" />

        <button
          className={`ai-drawer-works-toggle ${isWorks ? "active" : ""}`}
          onClick={() => setMobileWorksOpen((v) => !v)}
        >
          <span>{t.works}</span>
          <svg
            className={`ai-drawer-chevron ${mobileWorksOpen ? "open" : ""}`}
            width="10" height="10" viewBox="0 0 10 10"
          >
            <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className={`ai-drawer-sub ${mobileWorksOpen ? "open" : ""}`}>
          <a href="/#uiux-design" className={activeSection === "uiux-design" ? "active" : ""}>
            <span>{t.ui}</span>
          </a>
          <a href="/#visual-design" className={activeSection === "visual-design" ? "active" : ""}>
            <span>{t.branding}</span>
          </a>
          <a href="/#illustrations" className={activeSection === "illustrations" ? "active" : ""}>
            <span>{t.illustrations}</span>
          </a>
        </div>

        <div className="ai-drawer-line" />

        <a href="/#contact" className={isContact ? "active" : ""}>
          <span>{t.contact}</span>
        </a>

        {/* Lang switch внутри drawer */}
        <div className="ai-drawer-lang">
          <button
            className={`ai-drawer-lang-btn ${lang === "EN" ? "on" : ""}`}
            onClick={() => lang !== "EN" && toggle()}
          >
            EN
          </button>
          <button
            className={`ai-drawer-lang-btn ${lang === "UA" ? "on" : ""}`}
            onClick={() => lang !== "UA" && toggle()}
          >
            UA
          </button>
        </div>
      </div>
    </>
  );
}