import React, { useEffect, useState } from "react";

import GridOverlayVert from "../Grids/GridOverlay-Vertical";
import { useGlobalMouse } from "../Effects/useGlobalMouse";
import Fog from "../Effects/FogDesc";

import Slider from "../Sliders/Slider";
import RoadMap from "../Component/RoadMap-Gd";
import EncryptedText from "../Effects/EncryptedText";

import { useSectTitleDots } from "../js/useSectTitleDots";
import TitleDot from "../Effects/TitleDot";
import Line from "../Effects/Line";

import { Navigate, useParams } from "react-router-dom";
import projectsGd from "../data/project-gd";

import { SpotlightContainer } from "../Effects/Spotlight";

import "../css/index.css";
import "../css/showcase.css";

import Header from "../Component/Header";
import Footer from "../Component/Footer";

import { initPointer } from "../js/pointerStore";

import { useLang } from "../Languages/LanguageContext";
import translations from "../Languages/translations";
import { localize } from "../Card/Card";

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

export default function Page() {
  const { lang } = useLang();
  const t = translations[lang].showcase;

  const { webName } = useParams();

  const projectGd = projectsGd.find(
    (item) => item.webName === webName
  );

  useGlobalMouse();
  const { visibleTitles, registerTitle } = useSectTitleDots();
  const isMobile = useIsMobile();

  useEffect(() => {
    initPointer();
  }, []);

  if (!projectGd) {
        return <Navigate to="/404" replace />;
  }

  const slides = projectGd?.carouselImages || [];

  // Resolve localized fields
  const title = localize(projectGd.title, lang);
  const textCreatSect = localize(projectGd.textCreatSect, lang);
  const textProdSect = localize(projectGd.textProdSect, lang);
  const textAnnt = localize(projectGd.textAnnt, lang);

  // Параметры спотлайта зависят от брейкпоинта,
  // чтобы он не "уплывал" при смене раскладки на мобильных.
  const spotlightPropsCreate = isMobile
    ? { fill: "#9492ba27", top: "-46%", left: "-46%", length: "950" }
    : { fill: "#9492ba27", top: "-75%", left: "-28%", length: "950" };

  return (
    <main style={{ overflow: "hidden" }}>
      <Fog />
      <Header />

      <section className="section">
        {/* HEADER SECTION */}
        <div className="prototype" style={{ paddingTop: "88px", position: "relative", zIndex: "2", pointerEvents: "none" }}>
          <div className="title-wrap">
            <h3 id="title-label" ref={registerTitle} className="sect-title" style={{ marginBottom: 0 }}>
              {title}
            </h3>
            {visibleTitles["title-label"] && <TitleDot />}
          </div>

          <div className="prototype-flex-main">
            <div className="shadow" />
            <div>
              <h4 className="sect-subtitle prototype-subtitle" style={{ paddingRight: "40px" }}>
                <EncryptedText text={t.fromIdea} baseSpeed={120} variance={600} maxLineLength={11} />
              </h4>
              <SpotlightContainer background="transparent" spotlightProps={spotlightPropsCreate}>
                <p className="sect-text prototype">
                  {textCreatSect}
                </p>
              </SpotlightContainer>
            </div>

            <div className="image-card">
              <div className="image-inner">
                <img src={projectGd?.mainImage} alt="" />
              </div>
            </div>
          </div>
        </div>

        <Line />

        {/* ROADMAP */}
        <div className="slides-container">
          <h4 className="sect-subtitle slides-container" style={{ zIndex: "4" }}>
            <span>
              {t.roadmapTitle[0]}
              <EncryptedText text={t.roadmapTitle.slice(1)} baseSpeed={120} variance={600} />
            </span>
          </h4>
          <div className="shadow" style={{ zIndex: "2" }} />
          <p className="sect-text slides" style={{ zIndex: "4" }}>{t.roadmapSubtitle}</p>
        </div>

        <RoadMap />

        {/* RESULT + SLIDER */}
        <div className="slides-container slides">
          <h4 className="sect-subtitle slides-container" style={{ zIndex: "5" }}>
            <span>
              {t.resultTitle[0]}
              <EncryptedText text={t.resultTitle.slice(1)} baseSpeed={120} variance={600} />
            </span>
          </h4>
          <div className="shadow" style={{ zIndex: "2" }} />
          <p className="sect-text slides" style={{ zIndex: "5" }}>{textProdSect}</p>

          <div className="slider-wrapper-slide">
            <Slider slides={slides} />
          </div>

          <div className="sect-text slides" style={{ zIndex: "5" }}>
            <div dangerouslySetInnerHTML={{ __html: textAnnt }} />
          </div>
        </div>

        <Footer />
        <GridOverlayVert />
      </section>
    </main>
  );
}