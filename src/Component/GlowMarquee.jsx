import React from "react";
import "../css/glow-marquee.css";
import { useLang } from "../Languages/LanguageContext";
import translations from "../Languages/translations";

export default function GlowMarquee() {
  const { lang } = useLang();
  const text = translations[lang].marquee;

  return (
    <div className="marquee">
      <div className="marquee-track">
        <span className="marquee-text">{text}</span>
        <span className="marquee-text">{text}</span>
      </div>
    </div>
  );
}