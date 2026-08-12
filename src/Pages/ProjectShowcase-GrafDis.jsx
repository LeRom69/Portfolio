import React, { useEffect, useState } from "react";

import GridOverlay from "../Grids/GridOverlay";
import { useGlobalMouse } from "../Effects/useGlobalMouse";
import Fog from "../Effects/Fog";

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
import "../css/slider-vert.css";

import Header from "../Component/Header";
import Footer from "../Component/Footer";

import { initPointer } from "../js/pointerStore";

import { useLang } from "../Languages/LanguageContext";
import translations from "../Languages/translations";
import { localize } from "../Card/Card";

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

  const title = localize(projectGd.title, lang);
  const textCreatSect = localize(projectGd.textCreatSect, lang);
  const textProdSect = localize(projectGd.textProdSect, lang);
  const textAnnt = localize(projectGd.textAnnt, lang);

  const spotlightPropsCreate = isMobile
    ? {
      fill: "#9492ba27",
      top: "-330px",
      left: "-132px",
      length: "950",
    }
    : {
      fill: "#9492ba27",
      top: "-380px",
      left: "-200px",
      length: "950",
    };

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
            <div>
              <h4 className="sect-subtitle prototype-subtitle" style={{ paddingRight: "40px" }}>
                <EncryptedText text={t.fromIdea} baseSpeed={120} variance={600} maxLineLength={11} />
              </h4>
              <SpotlightContainer background="transparent" spotlightProps={spotlightPropsCreate}>
                <div className="flex">
                   <div className="shadow-90" />
                <p className="sect-text prototype">
                  {textCreatSect}
                </p>
                </div>
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
          <h4 className="sect-subtitle slides-container" style={{ zIndex: "6" }}>
            <span>
              {t.roadmapTitle[0]}
              <EncryptedText text={t.roadmapTitle.slice(1)} baseSpeed={120} variance={600} />
            </span>
          </h4>
          <div className="flex">
            <div className="shadow-mini" style={{ zIndex: "3" }} />
            <p className="sect-text slides" style={{ zIndex: "6", width: "100%" }}>{t.roadmapSubtitle}</p>
          </div>
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
          <div className="flex-div">
            <div className="shadow" style={{ zIndex: "3", filter: "blur(24px)", width: "66%" }} />
            <p className="sect-text slides" style={{ zIndex: "6" }}>{textProdSect}</p>
          </div>
          <div className="slider-wrapper-slide">
            <Slider slides={slides} />
          </div>

          <div className="sect-text slides">
            <div className="shadow-mini" style={{ zIndex: "3", margin: "0" }} />
            <div style={{ position: "relative", zIndex: "6" }} dangerouslySetInnerHTML={{ __html: textAnnt }} />
          </div>
        </div>

        <Footer />
        <GridOverlay className="grid-unified--vertical-only" waveClassName="wave" />
      </section>
    </main>
  );
}