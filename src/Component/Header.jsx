import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  const [mobileLinksOpen, setMobileLinksOpen] = useState(false);

  const [headerHover, setHeaderHover] = useState(false);

  /*
   * ==========================================
   * SHRINK
   * ==========================================
   */

  const [navigationShrink, setNavigationShrink] = useState(() => {
    return sessionStorage.getItem("header-shrink") === "true";
  });

  /*
   * Блокирует автоматическое снятие shrink
   * во время перехода между страницами.
   *
   * Особенно важно при переходе на Home,
   * когда scrollY может стать 0.
   */
  const navigationShrinkLock = useRef(false);

  const closeTimer = useRef(null);
  const burgerCloseTimer = useRef(null);
  const drawerRef = useRef(null);
  const burgerRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();

  const path = location.pathname;

  const onProjectPage =
    path.startsWith("/visual-design/") ||
    path.startsWith("/uiux-design/");

  const isHome =
    !onProjectPage &&
    activeSection === "home";

  const isContact =
    !onProjectPage &&
    activeSection === "contact";

  const isWorks =
    onProjectPage ||
    activeSection === "uiux-design" ||
    activeSection === "visual-design" ||
    activeSection === "illustrations";

  /*
   * ==========================================
   * SHRINK — SAVE BEFORE NAVIGATION
   * ==========================================
   */

  const preserveShrink = () => {
    if (navigationShrink) {
      sessionStorage.setItem(
        "header-shrink",
        "true"
      );

      /*
       * ВАЖНО:
       * как только сохраняем shrink перед
       * переходом — блокируем его снятие.
       */
      navigationShrinkLock.current = true;
    }
  };

  /*
   * ==========================================
   * HEADER HOVER
   * ==========================================
   */

  const handleHeaderEnter = () => {
    setHeaderHover(true);
    setNavigationShrink(true);
  };

  const handleHeaderLeave = () => {
    setHeaderHover(false);

    /*
     * Если shrink был заблокирован
     * переходом — теперь пользователь
     * реально покинул Header.
     *
     * Разрешаем обычную логику снова.
     */
    if (navigationShrinkLock.current) {
      navigationShrinkLock.current = false;
    }

    /*
     * Если мы наверху страницы,
     * после ухода мыши shrink убираем.
     */
    if (window.scrollY <= 20) {
      setNavigationShrink(false);

      sessionStorage.removeItem(
        "header-shrink"
      );
    }
  };

  /*
   * ==========================================
   * SCROLL
   * ==========================================
   */

  useEffect(() => {
    let rafId = null;

    const onScroll = () => {
      if (rafId !== null) {
        return;
      }

      rafId = requestAnimationFrame(() => {
        rafId = null;

        const isScrolled =
          window.scrollY > 20;

        setScroll(isScrolled);

        /*
         * ======================================
         * NAVIGATION LOCK
         * ======================================
         *
         * Во время перехода scrollY может
         * временно стать 0.
         *
         * Но shrink нельзя снимать.
         */
        if (navigationShrinkLock.current) {
          setNavigationShrink(true);
          return;
        }

        /*
         * Скролл вниз включает shrink.
         */
        if (isScrolled) {
          setNavigationShrink(true);
          return;
        }

        /*
         * Вернулись наверх.
         *
         * Если мышь не на Header —
         * shrink снимается.
         */
        if (!headerHover) {
          setNavigationShrink(false);

          sessionStorage.removeItem(
            "header-shrink"
          );
        }
      });
    };

    window.addEventListener(
      "scroll",
      onScroll,
      {
        passive: true,
      }
    );

    /*
     * Начальное состояние.
     */
    const initialScrolled =
      window.scrollY > 20;

    setScroll(initialScrolled);

    if (initialScrolled) {
      setNavigationShrink(true);
    }

    return () => {
      window.removeEventListener(
        "scroll",
        onScroll
      );

      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [headerHover]);

  /*
   * ==========================================
   * ROUTE CHANGE
   * ==========================================
   */

  useEffect(() => {
    const wasNavigationShrink =
      sessionStorage.getItem(
        "header-shrink"
      ) === "true";

    /*
     * Если переход был из shrink —
     * продолжаем держать shrink.
     */
    if (wasNavigationShrink) {
      navigationShrinkLock.current = true;

      setNavigationShrink(true);
    }

    /*
     * ======================================
     * HOME
     * ======================================
     *
     * После завершения перехода
     * всегда ставим Home в начало.
     */
    if (location.pathname === "/") {
      requestAnimationFrame(() => {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "instant",
        });

        /*
         * НИЧЕГО НЕ РАЗБЛОКИРУЕМ.
         *
         * navigationShrinkLock остаётся true.
         *
         * Это важно:
         * scrollY = 0 не должен снять shrink.
         */
      });
    }

    /*
     * Переход уже завершён.
     *
     * Саму временную запись можно удалить,
     * потому что теперь shrink удерживает
     * navigationShrinkLock.
     */
    if (wasNavigationShrink) {
      sessionStorage.removeItem(
        "header-shrink"
      );
    }
  }, [location.pathname]);

  /*
   * ==========================================
   * SECTION DETECTION
   * ==========================================
   */

  useEffect(() => {
    if (path !== "/") {
      return;
    }

    const ids = [
      "home",
      "uiux-design",
      "visual-design",
      "illustrations",
      "contact",
    ];

    const elements = ids
      .map((id) =>
        document.getElementById(id)
      )
      .filter(Boolean);

    if (!elements.length) {
      return;
    }

    const observer =
      new IntersectionObserver(
        (entries) => {
          const visible =
            entries.filter(
              (entry) =>
                entry.isIntersecting
            );

          if (!visible.length) {
            return;
          }

          const viewportCenter =
            window.innerHeight / 2;

          const closest =
            visible.reduce(
              (best, entry) => {
                const rect =
                  entry.target.getBoundingClientRect();

                const elementCenter =
                  rect.top +
                  rect.height / 2;

                const distance =
                  Math.abs(
                    elementCenter -
                      viewportCenter
                  );

                return distance <
                  best.distance
                  ? {
                      id: entry.target.id,
                      distance,
                    }
                  : best;
              },
              {
                id: null,
                distance: Infinity,
              }
            );

          if (closest.id) {
            setActiveSection(
              closest.id
            );
          }
        },
        {
          rootMargin:
            "-45% 0px -45% 0px",
          threshold: 0,
        }
      );

    elements.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      observer.disconnect();
    };
  }, [path]);

  /*
   * ==========================================
   * NAVIGATION
   * ==========================================
   */

  const goHome = () => {
    /*
     * Сначала блокируем снятие shrink.
     */
    navigationShrinkLock.current = true;

    /*
     * Сохраняем shrink ДО navigate.
     */
    preserveShrink();

    closeMobile();

    /*
     * ======================================
     * УЖЕ НА HOME
     * ======================================
     */

    if (path === "/") {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant",
      });

      /*
       * Lock НЕ снимаем.
       *
       * Он будет снят только тогда,
       * когда мышь покинет Header.
       */
    } else {
      /*
       * ======================================
       * ПЕРЕХОД НА HOME
       * ======================================
       */

      navigate("/", {
        replace: false,
      });

      /*
       * Lock остаётся true.
       */
    }

    setActiveSection("home");
  };

  const goToSection = (sectionId) => {
    /*
     * Сохраняем shrink ДО navigate.
     */
    preserveShrink();

    if (path === "/") {
      const element =
        document.getElementById(
          sectionId
        );

      if (element) {
        element.scrollIntoView({
          behavior: "instant",
          block: "start",
        });
      }
    } else {
      navigate(`/#${sectionId}`);
    }

    setActiveSection(sectionId);

    setWorksOpen(false);
    setMobileWorksOpen(false);
    setMobileLinksOpen(false);

    closeMobile();
  };

  /*
   * ==========================================
   * MOBILE DRAWER
   * ==========================================
   */

  const closeMobile = () => {
    if (!mobileOpen) {
      return;
    }

    setMobileClosing(true);
    setMobileOpen(false);

    clearTimeout(
      burgerCloseTimer.current
    );

    burgerCloseTimer.current =
      setTimeout(() => {
        setMobileClosing(false);
      }, 350);
  };

  const toggleMobile = () => {
    if (mobileOpen) {
      closeMobile();
    } else {
      clearTimeout(
        burgerCloseTimer.current
      );

      setMobileClosing(false);
      setMobileOpen(true);
    }
  };

  /*
   * ==========================================
   * CLOSE DRAWER — OUTSIDE CLICK
   * ==========================================
   */

  useEffect(() => {
    if (!mobileOpen) {
      return;
    }

    const handler = (event) => {
      const clickedInsideDrawer =
        drawerRef.current?.contains(
          event.target
        );

      const clickedBurger =
        burgerRef.current?.contains(
          event.target
        );

      if (
        !clickedInsideDrawer &&
        !clickedBurger
      ) {
        closeMobile();
      }
    };

    document.addEventListener(
      "mousedown",
      handler
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handler
      );
    };
  }, [mobileOpen]);

  /*
   * ==========================================
   * CLOSE DRAWER — NAVIGATION
   * ==========================================
   */

  useEffect(() => {
    closeMobile();
  }, [
    location.pathname,
    location.hash,
  ]);

  /*
   * ==========================================
   * CLEANUP
   * ==========================================
   */

  useEffect(() => {
    return () => {
      clearTimeout(
        burgerCloseTimer.current
      );

      clearTimeout(
        closeTimer.current
      );
    };
  }, []);

  /*
   * ==========================================
   * WORKS DROPDOWN
   * ==========================================
   */

  const openMenu = () => {
    clearTimeout(
      closeTimer.current
    );

    setWorksOpen(true);
  };

  const closeMenu = () => {
    clearTimeout(
      closeTimer.current
    );

    closeTimer.current =
      setTimeout(() => {
        setWorksOpen(false);
      }, 100);
  };

  /*
   * ==========================================
   * RENDER
   * ==========================================
   */

  return (
    <>
      <div
        className={`ai-bar ${
          scroll ||
          headerHover ||
          navigationShrink
            ? "shrink"
            : ""
        }`}
        onMouseEnter={
          handleHeaderEnter
        }
        onMouseLeave={
          handleHeaderLeave
        }
      >
        {/* LEFT */}

        <div className="ai-left">
          <span
            className="ai-logo"
            onClick={goHome}
            aria-label="Home"
          >
            <img
              src={`${process.env.PUBLIC_URL}/sprites/logo.svg`}
              alt="VR Logo"
            />
          </span>

          <span className="ai-name">
            V.
            <br />
            ROMANISHYNA
          </span>
        </div>

        {/* CENTER */}

        <nav className="ai-nav">
          <button
            className={
              isHome
                ? "active"
                : ""
            }
            onClick={goHome}
          >
            {t.home}
          </button>

          <div
            className="ai-dd"
            onMouseEnter={openMenu}
            onMouseLeave={closeMenu}
          >
            <button
              className={
                isWorks
                  ? "active"
                  : ""
              }
              onClick={() =>
                setWorksOpen(
                  (value) => !value
                )
              }
            >
              {t.works}

              <svg
                className={`ai-chevron ${
                  worksOpen
                    ? "open"
                    : ""
                }`}
                width="10"
                height="10"
                viewBox="0 0 10 10"
              >
                <path
                  d="M2 3.5L5 6.5L8 3.5"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <div
              className={`ai-menu ${
                worksOpen
                  ? "open"
                  : ""
              }`}
            >
              <span className="ai-menu-line" />

              <button
                className={`dd-item ${
                  activeSection ===
                  "uiux-design"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  goToSection(
                    "uiux-design"
                  )
                }
              >
                <span>
                  {t.ui}
                </span>
              </button>

              <span className="dd-line">
                <span className="dd-track" />
                <span className="dd-dot" />
              </span>

              <button
                className={`dd-item ${
                  activeSection ===
                  "visual-design"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  goToSection(
                    "visual-design"
                  )
                }
              >
                <span>
                  {t.branding}
                </span>
              </button>

              <span className="dd-line">
                <span className="dd-track" />
                <span className="dd-dot" />
              </span>

              <button
                className={`dd-item ${
                  activeSection ===
                  "illustrations"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  goToSection(
                    "illustrations"
                  )
                }
              >
                <span>
                  {t.illustrations}
                </span>
              </button>

              <span className="dd-line">
                <span className="dd-track" />
                <span className="dd-dot" />
              </span>
            </div>
          </div>

          <button
            className={
              isContact
                ? "active"
                : ""
            }
            onClick={() =>
              goToSection("contact")
            }
          >
            {t.contact}
          </button>
        </nav>

        {/* RIGHT */}

        <div className="ai-right">
          <div
            className="lang"
            onClick={toggle}
          >
            <span
              className={`lang-pill ${
                lang === "UA"
                  ? "shift"
                  : ""
              }`}
            />

            <span
              className={
                lang === "EN"
                  ? "on"
                  : ""
              }
            >
              EN
            </span>

            <span
              className={
                lang === "UA"
                  ? "on"
                  : ""
              }
            >
              UA
            </span>
          </div>
        </div>

        {/* BURGER */}

        <button
          ref={burgerRef}
          className={`ai-burger ${
            mobileOpen
              ? "open"
              : ""
          } ${
            mobileClosing
              ? "closing"
              : ""
          }`}
          aria-label="Menu"
          aria-expanded={
            mobileOpen
          }
          onClick={toggleMobile}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* MOBILE DRAWER */}

      <div
        ref={drawerRef}
        className={`ai-drawer ${
          mobileOpen
            ? "open"
            : ""
        } ${
          mobileClosing
            ? "closing"
            : ""
        }`}
        aria-hidden={
          !mobileOpen
        }
      >
        <a
          className={
            isHome
              ? "active"
              : ""
          }
          onClick={goHome}
        >
          <span>
            {t.home}
          </span>
        </a>

        <div className="ai-drawer-line" />

        <button
          className={`ai-drawer-works-toggle ${
            isWorks
              ? "active"
              : ""
          }`}
          onClick={() =>
            setMobileWorksOpen(
              (v) => !v
            )
          }
        >
          <span>
            {t.works}
          </span>

          <svg
            className={`ai-drawer-chevron ${
              mobileWorksOpen
                ? "open"
                : ""
            }`}
            width="10"
            height="10"
            viewBox="0 0 10 10"
          >
            <path
              d="M2 3.5L5 6.5L8 3.5"
              stroke="currentColor"
              strokeWidth="1.4"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div
          className={`ai-drawer-sub ${
            mobileWorksOpen
              ? "open"
              : ""
          }`}
        >
          <a
            className={
              activeSection ===
              "uiux-design"
                ? "active"
                : ""
            }
            onClick={() =>
              goToSection(
                "uiux-design"
              )
            }
          >
            <span>
              {t.ui}
            </span>
          </a>

          <a
            className={
              activeSection ===
              "visual-design"
                ? "active"
                : ""
            }
            onClick={() =>
              goToSection(
                "visual-design"
              )
            }
          >
            <span>
              {t.branding}
            </span>
          </a>

          <a
            className={
              activeSection ===
              "illustrations"
                ? "active"
                : ""
            }
            onClick={() =>
              goToSection(
                "illustrations"
              )
            }
          >
            <span>
              {t.illustrations}
            </span>
          </a>
        </div>

        <div className="ai-drawer-line" />

        <a
          className={
            isContact
              ? "active"
              : ""
          }
          onClick={() =>
            goToSection("contact")
          }
        >
          <span>
            {t.contact}
          </span>
        </a>

        <div className="ai-drawer-line" />

        <button
          className={`ai-drawer-works-toggle ${
            mobileLinksOpen
              ? "active"
              : ""
          }`}
          onClick={() =>
            setMobileLinksOpen(
              (v) => !v
            )
          }
        >
          <span>
            {t.links}
          </span>

          <svg
            className={`ai-drawer-chevron ${
              mobileLinksOpen
                ? "open"
                : ""
            }`}
            width="10"
            height="10"
            viewBox="0 0 10 10"
          >
            <path
              d="M2 3.5L5 6.5L8 3.5"
              stroke="currentColor"
              strokeWidth="1.4"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div
          className={`ai-drawer-sub ${
            mobileLinksOpen
              ? "open"
              : ""
          }`}
        >
          <a
            href="https://www.behance.net/ValeriiaRomanishyna"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>
              Behance
            </span>
          </a>

          <a
            href="https://www.linkedin.com/in/valeriia-romanishyna69"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>
              LinkedIn
            </span>
          </a>

          <a
            href="mailto:v.designer007591@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>
              Email
            </span>
          </a>
        </div>

        {/* LANG SWITCH */}

        <div className="ai-drawer-lang">
          <button
            className={`ai-drawer-lang-btn ${
              lang === "EN"
                ? "on"
                : ""
            }`}
            onClick={() =>
              lang !== "EN" &&
              toggle()
            }
          >
            EN
          </button>

          <button
            className={`ai-drawer-lang-btn ${
              lang === "UA"
                ? "on"
                : ""
            }`}
            onClick={() =>
              lang !== "UA" &&
              toggle()
            }
          >
            UA
          </button>
        </div>
      </div>
    </>
  );
}

