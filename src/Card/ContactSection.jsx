import "../css/contact.css";
import "../css/alerts.css";

import Typewriter from "../Effects/TypewriterEffect";
import { useSectTitleDots } from "../js/useSectTitleDots";
import TitleDot from "../Effects/TitleDot";
import { initPointer } from "../js/pointerStore";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, XCircle} from "lucide-react";

import { useLang } from "../Languages/LanguageContext";
import translations from "../Languages/translations";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8787/api/contact";
const TURNSTILE_SITE_KEY = process.env.REACT_APP_TURNSTILE_SITE_KEY || "";

export default function ContactSection() {
  const { lang } = useLang();
  const t = translations[lang].contact;

  // Виджет Turnstile монтируется один раз (useEffect с []), и его callback
  // навсегда захватывает submitForm/lang из первого рендера. Чтобы капча
  // всегда отправляла АКТУАЛЬНЫЙ язык, читаем его из ref, а не из замыкания.
  const langRef = useRef(lang);
  useEffect(() => {
    langRef.current = lang;
  }, [lang]);

  const { visibleTitles, registerTitle } = useSectTitleDots();
  useEffect(() => {
    initPointer();
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    projectType: "",
    message: "",
  });

  // idle | sending | success | error
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const turnstileRef = useRef(null);
  const widgetIdRef = useRef(null);
  const pendingSubmitRef = useRef(false);
  const pendingDataRef = useRef(null); // данные формы, ожидающие отправки после капчи
  const [captchaToken, setCaptchaToken] = useState("");

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY) return;

    const scriptId = "cf-turnstile-script";
    function renderWidget() {
      if (turnstileRef.current && window.turnstile && widgetIdRef.current === null) {
        widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
          sitekey: TURNSTILE_SITE_KEY,
          theme: "dark",
          execution: "execute",
          appearance: "interaction-only",
          callback: (token) => {
            setCaptchaToken(token);
            if (pendingSubmitRef.current) {
              pendingSubmitRef.current = false;
              submitForm(token, pendingDataRef.current);
            }
          },
          "expired-callback": () => setCaptchaToken(""),
          "error-callback": () => {
            setCaptchaToken("");
            if (pendingSubmitRef.current) {
              pendingSubmitRef.current = false;
              setStatus("error");
              setErrorMsg(t.errorCaptcha);
            }
          },
        });
      }
    }

    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      script.async = true;
      script.defer = true;
      script.onload = renderWidget;
      document.body.appendChild(script);
    } else {
      renderWidget();
    }

    return () => {
      if (widgetIdRef.current !== null && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (status !== "success") return;
    const timer = setTimeout(() => setStatus("idle"), 6000);
    return () => clearTimeout(timer);
  }, [status]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  // Валидация принимает конкретный набор данных (а не читает state напрямую) —
  // это важно, см. комментарий в handleSubmit про автозаполнение браузера.
  function validate(data) {
    if (!data.name.trim()) return t.errorName;
    if (!data.email.trim()) return t.errorEmail;
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);
    if (!emailOk) return t.errorEmailInvalid;
    if (!data.message.trim()) return t.errorMessage;
    return null;
  }

  async function submitForm(token, data) {
    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, captchaToken: token, lang: langRef.current }),
      });

      const responseData = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(responseData.error || t.errorNetwork);
      }

      setStatus("success");
      setFormData({ name: "", email: "", projectType: "", message: "" });
      setCaptchaToken("");
      if (widgetIdRef.current !== null && window.turnstile) {
        window.turnstile.reset(widgetIdRef.current);
      }
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message || t.errorNetwork);
      setCaptchaToken("");
      if (widgetIdRef.current !== null && window.turnstile) {
        window.turnstile.reset(widgetIdRef.current);
      }
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

    // Читаем значения полей напрямую из DOM формы (FormData), а не только из React state.
    // Причина: браузерный автозаполнитель (Chrome/Edge autofill) иногда подставляет
    // значение в input на уровне DOM без события, которое ловит React — тогда поле
    // визуально заполнено, а formData в состоянии всё ещё пустая строка, и валидация
    // ошибочно ругается "введите имя" на уже заполненном поле.
    const formEl = e.currentTarget;
    const fd = new FormData(formEl);
    const currentData = {
      name: (fd.get("name") || formData.name || "").toString(),
      email: (fd.get("email") || formData.email || "").toString(),
      projectType: (fd.get("projectType") || formData.projectType || "").toString(),
      message: (fd.get("message") || formData.message || "").toString(),
    };

    // синхронизируем state с реальными значениями формы
    setFormData(currentData);

    const validationError = validate(currentData);
    if (validationError) {
      setStatus("error");
      setErrorMsg(validationError);
      return;
    }

    if (!TURNSTILE_SITE_KEY) {
      submitForm("", currentData);
      return;
    }

    setStatus("sending");
    setErrorMsg("");

    if (captchaToken) {
      submitForm(captchaToken, currentData);
      return;
    }

    pendingSubmitRef.current = true;
    pendingDataRef.current = currentData;
    if (widgetIdRef.current !== null && window.turnstile) {
      window.turnstile.execute(widgetIdRef.current);
    }
  }

  return (
    <>
      {createPortal(
        <div className="form-toast-container">
          <AnimatePresence mode="wait">
            {status === "success" && (
              <motion.div
                key="success"
                className="form-alert form-alert--success"
                initial={{ opacity: 0, y: -24, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -24, scale: 0.95 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                <CheckCircle2 className="form-alert__icon" size={20} />
                <span className="form-alert__text">{t.successMsg}</span>
                <button
                  type="button"
                  className="form-alert__close"
                  onClick={() => setStatus("idle")}
                  aria-label={t.closeAlert}
                >
                  <img src={`${process.env.PUBLIC_URL}/sprites/icons/xrest.svg`} alt=""/>
                </button>
              </motion.div>
            )}

            {status === "error" && (
              <motion.div
                key="error"
                className="form-alert form-alert--error"
                initial={{ opacity: 0, y: -24, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -24, scale: 0.95 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                <XCircle className="form-alert__icon" size={20} />
                <span className="form-alert__text">{errorMsg}</span>
                <button
                  type="button"
                  className="form-alert__close"
                  onClick={() => setStatus("idle")}
                  aria-label={t.closeAlert}
                >
               <img src={`${process.env.PUBLIC_URL}/sprites/icons/xrest.svg`} alt=""/> 
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>,
        document.body
      )}

      <section className="contact-section">
        
        {/* BACKGROUND */}
        <img
          src={`${process.env.PUBLIC_URL}/sprites/form.png`}
          className="contact-bg"
          alt="Logo"
          loading="lazy"
          decoding="async"
        />

        <div className="flex">
          <div className="shadow" />
          <span id="contact-label" ref={registerTitle} className="contact-label">
            {t.label}
          </span>
          {visibleTitles["contact-label"] && <TitleDot />}
        </div>
        <h1 className="contact-title">
          <Typewriter text={t.title} speed={60} />
        </h1>
        <div className="contact-container">
          {/* LEFT */}
          <div className="contact-left">
            <div className="shadow" style={{ zIndex:"4"}}/>
            <p className="contact-text">
              {t.text.split("\n").map((line, i) => (
                <span key={i}>{line}{i < t.text.split("\n").length - 1 && <br />}</span>
              ))}
            </p>

            <form className="contact-form" onSubmit={handleSubmit} noValidate>
              <div className="contact-row">
                <div className="input-group">
                  <div className="input-run-border">
                    <label>{t.name}</label>
                    <input
                      type="text"
                      name="name"
                      placeholder={t.namePlaceholder}
                      value={formData.name}
                      onChange={handleChange}
                      disabled={status === "sending"}
                    />
                  </div>
                </div>

                <div className="input-group">
                  <div className="input-run-border">
                    <label>{t.email}</label>
                    <input
                      type="email"
                      name="email"
                      placeholder={t.emailPlaceholder}
                      value={formData.email}
                      onChange={handleChange}
                      disabled={status === "sending"}
                    />
                  </div>
                </div>
              </div>

              <div className="input-group">
                <div className="input-run-border">
                  <label>{t.projectType}</label>
                  <input
                    type="text"
                    name="projectType"
                    placeholder={t.projectTypePlaceholder}
                    value={formData.projectType}
                    onChange={handleChange}
                    disabled={status === "sending"}
                  />
                </div>
              </div>

              <div className="input-group">
                <div className="input-run-border">
                  <label>{t.message}</label>
                  <textarea
                    name="message"
                    placeholder={t.messagePlaceholder}
                    value={formData.message}
                    onChange={handleChange}
                    disabled={status === "sending"}
                  />
                </div>
              </div>

              {TURNSTILE_SITE_KEY && (
                <div className="turnstile-widget" ref={turnstileRef} />
              )}

              <button className="send-btn" type="submit" disabled={status === "sending"}>
                <span>{status === "sending" ? t.sending : t.send}</span>
              </button>
            </form>
          </div>

          {/* RIGHT */}
          <div className="contact-right">
            <div className="bubble bubble-1"><a href="mailto:v.designer007591@gmail.com">EMAIL</a></div>
            <div className="bubble bubble-2"><a href="https://www.linkedin.com/in/valeriia-romanishyna69">LINKEDIN</a></div>
            <div className="bubble bubble-3"><a href="https://www.behance.net/ValeriiaRomanishyna">BEHANCE</a></div>
          </div>
        </div>
      </section>
    </>
  );
}
