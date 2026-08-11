import React, { useEffect, useState } from "react";

import GridOverlay from "../Grids/GridOverlay";
import { useGlobalMouse } from "../Effects/useGlobalMouse";
import Fog from "../Effects/FogDesc";

import { useSectTitleDots } from "../js/useSectTitleDots";
import TitleDot from "../Effects/TitleDot";
import Line from "../Effects/Line";
import RoadMap from "../Component/RoadMap-Ui";

import EncryptedText from "../Effects/EncryptedText";

import SliderVert from "../Sliders/Slider-vert";
import Slider from "../Sliders/Slider";

import { SpotlightContainer } from "../Effects/Spotlight";

import "../css/index.css";
import "../css/showcase.css";

import { Navigate, useParams } from "react-router-dom";
import projectsUi from "../data/project-ui";

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

  const projectUi = projectsUi.find(
    (item) => item.webName === webName
  );

  useGlobalMouse();
  const { visibleTitles, registerTitle } = useSectTitleDots();
  const isMobile = useIsMobile();

  useEffect(() => {
    initPointer();
  }, []);

  if (!projectUi) {
    return <Navigate to="/404" replace />;
  }

  const slidesVrt = projectUi?.carouselImages || [];

  const title = localize(projectUi.title, lang);
  const textCreatSect = localize(projectUi.textCreatSect, lang);
  const textProdSect = localize(projectUi.textProdSect, lang);
  const textAnnt = localize(projectUi.textAnnt, lang);

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

  const spotlightPropsResult = isMobile
    ? {
        fill: "#9492ba27",
        top: "-220px",
        left: "-100px",
        length: "950",
      }
    : {
        fill: "#9492ba27",
        top: "-220px",
        left: "-100px",
        length: "800",
      };

  return (
    <main style={{ overflow: "hidden" }}>
      <Fog />
      <Header />

      <section className="section">
        <div className="prototype" style={{ paddingTop: "88px", position: "relative", zIndex: "6", pointerEvents: "none" }}>
          <div className="title-wrap">
            <h3 id="title-label" ref={registerTitle} className="sect-title" style={{ marginBottom: "0" }}>
              {title}
            </h3>
            {visibleTitles["title-label"] && <TitleDot />}
          </div>

          <div className="prototype-flex-main">
            <div className="shadow-90" />
            <div>
              <h4 className="sect-subtitle prototype-subtitle" style={{ marginBottom: "0" }}>
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
                <img src={projectUi?.mainImage} alt="" />
              </div>
            </div>
          </div>
        </div>

        <Line />

        <div className="slides-container">
          <h4 className="sect-subtitle slides-container" style={{ zIndex: "4" }}>
            <span>
              {t.roadmapTitle[0]}
              <EncryptedText text={t.roadmapTitle.slice(1)} baseSpeed={120} variance={600} />
            </span>
          </h4>
          <div className="flex">
          <div className="shadow-mini" style={{ zIndex: "3" }} />
          <p className="sect-text slides" style={{ zIndex: "4", width: "100%" }}>{t.roadmapSubtitle}</p>
          </div>
        </div>

        <RoadMap />

        {projectUi?.video ? (
          <div className="prototype video" >
            <div className="shadow max-width" style={{ zIndex: "3" }} />

            <div className="prototype-flex">
              <div className="prototype-video-col">
                <div className="prototype-text">
                  <h4 className="sect-subtitle prototype-subtitle video"  style={{ position:"relative", zIndex: "5" }}>
                    <span>
                      {t.resultTitle[0]}
                      <EncryptedText text={t.resultTitle.slice(1)} baseSpeed={120} variance={600} />
                    </span>
                  </h4>

                  <SpotlightContainer background="transparent" spotlightProps={spotlightPropsResult}>
                    <p className="sect-text prototype">
                      {textProdSect}
                    </p>
                  </SpotlightContainer>
                </div>

                <div
                  className="card-video"
                  dangerouslySetInnerHTML={{ __html: projectUi?.video || "" }}
                />
              </div>

              <div className="prototype-video-slider">
                <SliderVert slidesVrt={slidesVrt} />
              </div>
            </div>
          </div>
        ) : (
          <div className="slides-container prototype" style={{ marginBottom: "26px" }}>
            <h4 className="sect-subtitle slides-container" style={{ zIndex: "5" }}>
              <span>
                {t.resultTitle[0]}
                <EncryptedText text={t.resultTitle.slice(1)} baseSpeed={120} variance={600} />
              </span>
            </h4>
            <div className="shadow" style={{ zIndex: "3" }} />
            <p className="sect-text slides" style={{ zIndex: "5" }}>{textProdSect}</p>
            <span>
              <div className="slider-wrapper-slide">
                <Slider slides={slidesVrt} />
              </div>
            </span>
            <div className="sect-text slides" style={{ zIndex: "5" }}>
              <div dangerouslySetInnerHTML={{ __html: textAnnt }} />
            </div>
          </div>
        )}

        <Footer />
        <GridOverlay className="grid-unified--vertical-only" waveClassName="wave" />
      </section>
    </main>
  );
}