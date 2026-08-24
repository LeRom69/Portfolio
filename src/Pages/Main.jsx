import GridOverlay from "../Grids/GridOverlay";
import { useGlobalMouse } from "../Effects/useGlobalMouse";

import { useRef, useEffect, useState } from "react";

import Fog from "../Effects/Fog";
import GlowButton from "../Component/GlowButton";
import GlowButtonDefs from "../Component/GlowButtonDefs";
import GlowMarquee from "../Component/GlowMarquee";

import Card from "../Card/Card";
import Form from "../Card/ContactSection";

import Typewriter from "../Effects/TypewriterEffect";
import EncryptedText from "../Effects/EncryptedText";
import { SpotlightContainer } from "../Effects/Spotlight";

import "../css/index.css";
import "../css/card.css";

import { useSectTitleDots } from "../js/useSectTitleDots";
import TitleDot from "../Effects/TitleDot";

import { initPointer } from "../js/pointerStore";

import Header from "../Component/Header";

import projectsUi from "../data/project-ui";
import projectsGd from "../data/project-gd";

import { useLocation } from "react-router-dom";

import { useLang } from "../Languages/LanguageContext";
import translations from "../Languages/translations";

// ----------------------------------------
// MOBILE DETECTION
// ----------------------------------------

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined"
      ? window.innerWidth <= breakpoint
      : false
  );

  useEffect(() => {
    const onResize = () => {
      setIsMobile(window.innerWidth <= breakpoint);
    };

    window.addEventListener("resize", onResize);

    onResize();

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [breakpoint]);

  return isMobile;
}

// ----------------------------------------
// APP
// ----------------------------------------

export default function App() {
  useGlobalMouse();

  const { visibleTitles, registerTitle } =
    useSectTitleDots();

  const isMobile = useIsMobile();

  const { lang } = useLang();
  const t = translations[lang];

  const location = useLocation();

  const heroRef = useRef(null);

  // ----------------------------------------
  // POINTER
  // ----------------------------------------

  useEffect(() => {
    initPointer();
  }, []);

  // ----------------------------------------
  // HASH NAVIGATION
  // ----------------------------------------

  useEffect(() => {
    if (!location.hash) return;

    const id = location.hash.substring(1);

    const timer = setTimeout(() => {
      const element = document.getElementById(id);

      if (!element) return;

      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [location.hash]);

  // ----------------------------------------
  // ABOUT SPOTLIGHT
  // ----------------------------------------

  const spotlightPropsAbout = isMobile
    ? {
      fill: "#9492ba27",
      top: "-180px",
      left: "-120px",
      length: "950",
    }
    : {
      fill: "#9492ba27",
      top: "-200px",
      left: "-120px",
      length: "1000",
    };

  // ----------------------------------------
  // RENDER
  // ----------------------------------------

  return (
    <div className="container">
      <GlowButtonDefs />
      <Fog />

      <Header />

      <div className="shadow-vert" />

      <div className="grid-scope">
        {/* =====================================
            HERO
        ===================================== */}

        <GridOverlay heroRef={heroRef} />

        <div className="hero-container">
          <div className="hero-bg" />

          <div className="hero-content-wrapper">
            {/* TOP RIGHT */}

            <div className="top-right-block">
              <h3 className="co-title">
                <EncryptedText
                  text={t.hero.greeting}
                  variance={520}
                  baseSpeed={1200}
                  maxLineLength={20}
                />
              </h3>

              <h2 className="title-text">
                <EncryptedText
                  lines={t.hero.subtitle}
                  variance={520}
                  baseSpeed={1200}
                  maxLineLength={10}
                />
              </h2>
            </div>

            {/* BOTTOM LEFT */}

            <div className="bottom-left-block">
              <h1 className="title">
                <Typewriter
                  text={t.hero.title}
                  speed={60}
                />
              </h1>
            </div>
          </div>
        </div>

        {/* =====================================
            MAIN SECTIONS
        ===================================== */}

        <div className="section">
          {/* ===================================
              ABOUT
          =================================== */}

          <div
            id="home"
            className="about-container"
            style={{ pointerEvents: "none" }}
          >
            <div className="title-wrap">
              <h3
                id="hero-title"
                ref={registerTitle}
                className="sect-title"
              >
                {t.about.sectionTitle}
              </h3>

              {visibleTitles["hero-title"] && (
                <TitleDot />
              )}
            </div>

            <div className="sect-text-container">
              <div
                style={{
                  display: "flex",
                  position: "relative",
                  zIndex: "2",
                }}
              >
                <SpotlightContainer
                  background="transparent"
                  spotlightProps={spotlightPropsAbout}
                >
                  <h4
                    className="sect-subtitle"
                    style={{
                      marginLeft: "-8px",
                      marginTop: "10px",
                      marginBottom: "-10px",
                    }}
                  >
                    <div className="shadow" />

                    <span>
                      {lang === "UA" ? "П" : "H"}

                      <EncryptedText
                        text={
                          lang === "UA"
                            ? "ривіт!"
                            : "ello!"
                        }
                        variance={720}
                        baseSpeed={1600}
                        maxLineLength={10}
                      />
                    </span>
                  </h4>

                  <p
                    className="sect-text"
                    style={{
                      marginBottom: "30px",
                      marginTop: "30px",
                    }}
                  >
                    {t.about.text1}

                    <br />
                    <br />

                    {t.about.offerTitle}
                  </p>

                  <div className="offer-container">
                    <div className="flex-container">
                      <div className="flex">
                        <GlowButton className="offer-block">
                          {t.about.offer1}
                        </GlowButton>

                        <GlowButton>
                          {t.about.offer2}
                        </GlowButton>
                      </div>

                      <GlowButton className="offer-block">
                        {t.about.offer3}
                      </GlowButton>
                    </div>
                  </div>

                  <p
                    className="sect-text"
                    style={{ marginTop: "30px" }}
                  >
                    {t.about.text2
                      .split("\n\n")
                      .map((para, i, arr) => (
                        <span key={i}>
                          {para}

                          {i < arr.length - 1 && (
                            <>
                              <br />
                              <br />
                            </>
                          )}
                        </span>
                      ))}
                  </p>
                </SpotlightContainer>

                <div className="shadow" />
              </div>

              <img
                src={`${process.env.PUBLIC_URL}/sprites/about.png`}
                alt="About"
                className="about-photo"
                loading="lazy"
                decoding="async"
              />
            </div>

            <GlowMarquee />
          </div>

          {/* ===================================
              WORKS
          =================================== */}

          <div className="creations-container">
            <div className="title-wrap">
              <h3
                id="works-title"
                ref={registerTitle}
                className="sect-title"
              >
                {t.works.sectionTitle}
              </h3>

              {visibleTitles["works-title"] && (
                <TitleDot />
              )}
            </div>

            {/* =================================
                UI/UX DESIGN
            ================================= */}

            <div
              id="uiux-design"
              className="creations-list"
            >
              <div className="creation-first">
                <h4 className="sect-subtitle">
                  <span>
                    U
                    <EncryptedText
                      text={`I/UX ${lang === "UA"
                          ? "Дизайн"
                          : "Design"
                        }`}
                      variance={520}
                      baseSpeed={1200}
                    />
                  </span>
                </h4>

                {projectsUi[0] && (
                  <Card
                    key={0}
                    webName={projectsUi[0].webName}
                    index={0}
                    title={projectsUi[0].title}
                    link={projectsUi[0].link}
                    desc={projectsUi[0].desc}
                    cover={projectsUi[0].cover}
                  />
                )}
              </div>

              {projectsUi
                .slice(1)
                .map((item, i) => (
                  <Card
                    key={i + 1}
                    index={i + 1}
                    webName={item.webName}
                    link={item.link}
                    title={item.title}
                    desc={item.desc}
                    cover={item.cover}
                  />
                ))}
            </div>

            {/* =================================
                VISUAL DESIGN / BRANDING
            ================================= */}

            <div
              id="visual-design"
              className="branding-grid"
            >
              {/* LEFT */}

              <div className="branding-left">
                <h4 className="sect-subtitle">
                  <span>
                    {lang === "UA" ? "Г" : "G"}

                    <EncryptedText
                      text={
                        lang === "UA"
                          ? "РАФІЧНИЙ ДИЗАЙН ТА БРЕНДИНГ"
                          : "RAPHIC DESIGN & BRANDING"
                      }
                      variance={720}
                      baseSpeed={1600}
                    />
                  </span>
                </h4>

                {projectsGd[0] && (
                  <Card
                    key={0}
                    index={0}
                    webName={projectsGd[0].webName}
                    title={projectsGd[0].title}
                    link={projectsGd[0].link}
                    desc={projectsGd[0].desc}
                    cover={projectsGd[0].cover}
                  />
                )}
              </div>

              {/* RIGHT */}

              <div className="branding-right">
                {projectsGd
                  .slice(1)
                  .map((item, i) => (
                    <Card
                      key={i + 1}
                      index={i + 1}
                      title={item.title}
                      desc={item.desc}
                      webName={item.webName}
                      link={item.link}
                      cover={item.cover}
                    />
                  ))}
              </div>
            </div>

            {/* =================================
                ILLUSTRATIONS
            ================================= */}

            <div
              id="illustrations"
              className="illustration"
            >
              <h4 className="sect-subtitle img">
                <span>
                  <EncryptedText
                    text={
                      lang === "UA"
                        ? "ЗОБРАЖЕННЯ"
                        : "ILLUSTRATION"
                    }
                    variance={520}
                    baseSpeed={1200}
                    maxLineLength={10}
                  />
                </span>
              </h4>

              <div className="illustration-grid">
                {/* LEFT BIG */}

                <div className="illus-item left">
                  <div className="illus-card big">
                    <div className="image-card">
                      <div className="image-inner">
                        <img
                          src={`${process.env.PUBLIC_URL}/sprites/drawings/foxShrine.png`}
                          alt="Fox Shrine"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="illus-meta">
                    <div className="shadow" />

                    <h3 className="card-title">
                      {t.works.foxTitle}
                    </h3>

                    <p className="card-desc">
                      <br />
                      {t.imgDesc.fox}
                    </p>
                  </div>
                </div>

                {/* RIGHT */}

                <div className="illus-right">
                  <div className="illus-item">
                    <div className="illus-card small top">
                      <div className="image-card right">
                        <div className="image-inner">
                          <img
                            src={`${process.env.PUBLIC_URL}/sprites/drawings/jelly.png`}
                            alt="Jelly"
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="illus-meta">
                      <div className="shadow" />

                      <h3 className="card-title">
                        {t.works.jellyTitle}
                      </h3>

                      <p
                        className="card-desc"
                        style={{ width: "100%" }}
                      >
                        <br />
                        {t.imgDesc.jellyFish}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ===================================
              CONTACT
          =================================== */}

          <div
            id="contact"
            className="form-container"
          >
            <Form />
          </div>
        </div>
      </div>
    </div>
  );
}