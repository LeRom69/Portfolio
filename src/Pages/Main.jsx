import GridOverlay from "../Grids/GridOverlay-Main";
import GridOverlayVert from "../Grids/GridOverlay-Vertical";
import { useGlobalMouse } from "../Effects/useGlobalMouse";

import Fog from "../Effects/Fog";
import GlowButton from "../Component/GlowButton";
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
import { useEffect, useState } from "react";

import Header from "../Component/Header";

import projectsUi from "../data/project-ui";
import projectsGd from "../data/project-gd";

import { useLocation } from "react-router-dom";

import { useLang } from "../Languages/LanguageContext";
import translations from "../Languages/translations";

// Хук определения мобильной ширины экрана.
// Используется, чтобы спотлайт не "уплывал" при смене
// раскладки (flex-direction: column на мобильных).
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= breakpoint : false
  );

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= breakpoint);
    window.addEventListener("resize", onResize);
    onResize();
    return () => window.removeEventListener("resize", onResize);
  }, [breakpoint]);

  return isMobile;
}

export default function App() {
  useGlobalMouse();
  const { visibleTitles, registerTitle } = useSectTitleDots();
  const isMobile = useIsMobile();

  const { lang } = useLang();
  const t = translations[lang];

  useEffect(() => {
    initPointer();
  }, []);

  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [location]);

  // Параметры спотлайта зависят от брейкпоинта,
  // чтобы он не "уплывал" при смене раскладки на мобильных.
  const spotlightPropsAbout = isMobile
    ? { fill: "#9492ba27", top: "-46%", left: "-46%", length: "950" }
    : { fill: "#9492ba27", top: "-46%", left: "-46%", length: "1000" }


  return (
    <div className="container">
      <Fog />
      <Header />
      <div className="shadow-vert" />
      <div className="shadow-vert2" />

      <div className="hero-container">
        <div className="hero-bg" />

        <div className="hero-content-wrapper">
          <div className="top-right-block">
            <h3 className="co-title">
              <EncryptedText text={t.hero.greeting} variance={520} baseSpeed={1200} maxLineLength={20} />
            </h3>
            <h2 className="title-text">
              <EncryptedText lines={t.hero.subtitle} variance={520} baseSpeed={1200} maxLineLength={10} />
            </h2>
          </div>

          <div className="bottom-left-block">
            <h1 className="title">
              <Typewriter text={t.hero.title} speed={60} />
            </h1>
          </div>
        </div>
        <GridOverlay />
      </div>

      <div className="section" style={{ overflow: "hidden" }}>
        <div id="home" className="about-container" style={{ pointerEvents: "none" }}>
          <div className="title-wrap">
            <h3 id="hero-title" ref={registerTitle} className="sect-title">{t.about.sectionTitle}</h3>
            {visibleTitles["hero-title"] && <TitleDot />}
          </div>
          <div className="sect-text-container">
            <div style={{ display: "flex", position: "relative", zIndex: "2" }}>
              <SpotlightContainer background="transparent" spotlightProps={spotlightPropsAbout}>
                <h4 className="sect-subtitle" style={{ marginLeft: "-8px", marginTop: "10px", marginBottom: "-10px" }}>
                  <div className="shadow" />
                  <span>
                    {lang === "UA" ? "П" : "H"}
                    <EncryptedText
                      text={lang === "UA" ? `ривіт!` : `ello!`}
                      variance={720}
                      baseSpeed={1600}
                      maxLineLength={10}
                    />
                  </span>
                </h4>
                <p className="sect-text" style={{ marginBottom: "30px", marginTop: "30px" }}>
                  {t.about.text1}
                  <br /><br />
                  {t.about.offerTitle}
                </p>
                <div className="offer-container">
                  <div className="flex-container">
                    <div className="flex">
                      <GlowButton className="offer-block">{t.about.offer1}</GlowButton>
                      <GlowButton>{t.about.offer2}</GlowButton>
                    </div>
                    <GlowButton className="offer-block">{t.about.offer3}</GlowButton>
                  </div>
                </div>
                <p className="sect-text" style={{ marginTop: "30px" }}>
                  {t.about.text2.split("\n\n").map((para, i) => (
                    <span key={i}>{para}{i < 1 && <><br /><br /></>}</span>
                  ))}
                </p>

              </SpotlightContainer>

              <div className="shadow" />
            </div>
            <img
              src={`${process.env.PUBLIC_URL}/sprites/about.png`}
              alt="Logo"
              className="about-photo"
              loading="lazy"
              decoding="async"
            />
          </div>
          <GlowMarquee />
        </div>

        {/*
          ВАЖНО: uiux-design, visual-design и illustrations должны быть
          СОСЕДНИМИ (sibling) блоками, а не вложенными друг в друга.
          Раньше visual-design и illustrations лежали ВНУТРИ uiux-design,
          из-за чего IntersectionObserver в Header.jsx получал пересечение
          сразу нескольких id одновременно (родитель + вложенный ребёнок),
          и активным мог стать не тот пункт меню, который реально виден
          на экране. Теперь id раскиданы по трём независимым секциям.
        */}
        <div className="creations-container">
          <div className="title-wrap">
            <h3 id="works-title" ref={registerTitle} className="sect-title">{t.works.sectionTitle}</h3>
            {visibleTitles["works-title"] && <TitleDot />}
          </div>

          <div id="uiux-design" className="creations-list">
            <div className="creation-first">
              <h4 className="sect-subtitle">
                <span> U
                  <EncryptedText text={`I/UX ${lang === "UA" ? "Дизайн" : "Design"}`} variance={520} baseSpeed={1200} />
                </span>
              </h4>

              <Card
                key={0}
                webName={projectsUi[0].webName}
                index={0}
                title={projectsUi[0].title}
                link={projectsUi[0].link}
                desc={projectsUi[0].desc}
                cover={projectsUi[0].cover}
              />
            </div>
            {projectsUi.slice(1).map((item, i) => (
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

          <div id="visual-design" className="branding-grid">
            {/* LEFT */}
            <div className="branding-left">
              <h4 className="sect-subtitle">
                <span>
                  {lang === "UA" ? "Г" : "G"}
                  <EncryptedText
                    text={lang === "UA" ? `РАФІЧНИЙ ДИЗАЙН ТА БРЕНДИНГ` : `RAPHIC DESIGN & BRANDING`}
                    variance={720}
                    baseSpeed={1600}
                    maxLineLength={15}
                  />
                </span>
              </h4>
              <Card
                key={0}
                index={0}
                webName={projectsGd[0].webName}
                title={projectsGd[0].title}
                link={projectsGd[0].link}
                desc={projectsGd[0].desc}
                cover={projectsGd[0].cover}
              />
            </div>

            {/* RIGHT */}
            <div className="branding-right">
              {projectsGd.slice(1).map((item, i) => (
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

          <div id="illustrations" className="illustration">
            <h4 className="sect-subtitle img">
              <span>
                {lang === "UA" ? `З` : `I`}
                <EncryptedText
                  text={lang === "UA" ? `ОБРАЖЕННЯ` : `LLUSTRATION`}
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
                        alt="foxShrine"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  </div>
                </div>
                <div className="illus-meta">
                  <div className="shadow" />
                  <h3 className="card-title">{t.works.foxTitle}</h3>
                  <p className="card-desc"><br />{t.imgDesc.fox}</p>
                </div>
              </div>

              {/* RIGHT SIDE */}
              <div className="illus-right">
                <div className="illus-item">
                  <div className="illus-card small top">
                    <div className="image-card right">
                      <div className="image-inner">
                        <img
                          src={`${process.env.PUBLIC_URL}/sprites/drawings/jelly.png`}
                          alt="jelly"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="illus-meta">
                    <div className="shadow" />
                    <h3 className="card-title">{t.works.jellyTitle}</h3>
                    <p className="card-desc" style={{ width: "100%" }}><br />{t.imgDesc.jellyFish}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id="contact" className="form-container">
          <Form />
        </div>
        <GridOverlayVert />
      </div>
    </div>
  );
}
