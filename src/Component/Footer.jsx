import { useEffect, useState } from "react";
import "../css/footer.css";
import { useLang } from "../Languages/LanguageContext";
import translations from "../Languages/translations";

export default function Footer() {
  const { lang } = useLang();
  const t = translations[lang].footer;

  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="fx-footer">
      <div className="fx-inner">

        {/* LEFT STATUS */}
        <div className="fx-left">
          <div className="fx-dot" />
          <span>{t.available}</span>
        </div>

        {/* CENTER LINKS */}
        <div className="fx-links">
          <a href="https://www.behance.net/ValeriiaRomanishyna">BEHANCE</a>
          <a href="https://www.linkedin.com/in/valeriia-romanishyna69">LINKEDIN</a>
          <a href="mailto:v.designer007591@gmail.com">EMAIL</a>
        </div>

        {/* RIGHT INFO */}
        <div className="fx-right">
          <span>{time}</span>
          <span>{t.city}</span>
        </div>

      </div>
    </footer>
  );
}