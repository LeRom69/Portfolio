import "../css/contact.css";
import "../css/alerts.css";

import Typewriter from "../Effects/TypewriterEffect";
import { useSectTitleDots } from "../js/useSectTitleDots";
import TitleDot from "../Effects/TitleDot";
import { initPointer } from "../js/pointerStore";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";

import { useLang } from "../Languages/LanguageContext";
import translations from "../Languages/translations";

const API_URL =
  process.env.REACT_APP_API_URL ||
  "http://localhost:8787/api/contact";

const TURNSTILE_SITE_KEY =
  process.env.REACT_APP_TURNSTILE_SITE_KEY || "";

export default function ContactSection() {
  const { lang } = useLang();
  const t = translations[lang].contact;

  /*
   * Turnstile создаётся один раз.
   * Поэтому храним актуальный язык в ref,
   * чтобы callback всегда использовал текущий lang.
   */
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

  /*
   * Cloudflare Turnstile refs
   */
  const turnstileRef = useRef(null);
  const widgetIdRef = useRef(null);

  /*
   * Данные, которые ждут выполнения капчи.
   */
  const pendingSubmitRef = useRef(false);
  const pendingDataRef = useRef(null);

  const [captchaToken, setCaptchaToken] = useState("");

  /*
   * -----------------------------
   * TURNSTILE
   * -----------------------------
   */
  useEffect(() => {
    if (!TURNSTILE_SITE_KEY) return;

    const scriptId = "cf-turnstile-script";

    function renderWidget() {
      if (
        !turnstileRef.current ||
        !window.turnstile ||
        widgetIdRef.current !== null
      ) {
        return;
      }

      widgetIdRef.current = window.turnstile.render(
        turnstileRef.current,
        {
          sitekey: TURNSTILE_SITE_KEY,

          theme: "dark",

          execution: "execute",

          appearance: "interaction-only",

          callback: (token) => {
            setCaptchaToken(token);

            if (pendingSubmitRef.current) {
              pendingSubmitRef.current = false;

              submitForm(
                token,
                pendingDataRef.current
              );

              pendingDataRef.current = null;
            }
          },

          "expired-callback": () => {
            setCaptchaToken("");
          },

          "error-callback": () => {
            setCaptchaToken("");

            if (pendingSubmitRef.current) {
              pendingSubmitRef.current = false;
              pendingDataRef.current = null;

              setStatus("error");
              setErrorMsg(t.errorCaptcha);
            }
          },
        }
      );
    }

    /*
     * Если Turnstile уже подключён — просто рендерим.
     */
    const existingScript =
      document.getElementById(scriptId);

    if (existingScript) {
      if (window.turnstile) {
        renderWidget();
      } else {
        existingScript.addEventListener(
          "load",
          renderWidget,
          { once: true }
        );
      }
    } else {
      const script = document.createElement("script");

      script.id = scriptId;
      script.src =
        "https://challenges.cloudflare.com/turnstile/v0/api.js";
      script.async = true;
      script.defer = true;

      script.onload = renderWidget;

      document.body.appendChild(script);
    }

    return () => {
      if (
        widgetIdRef.current !== null &&
        window.turnstile
      ) {
        try {
          window.turnstile.remove(
            widgetIdRef.current
          );
        } catch (error) {
          // Turnstile уже мог быть удалён.
        }

        widgetIdRef.current = null;
      }
    };

    // Turnstile должен монтироваться только один раз.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /*
   * -----------------------------
   * SUCCESS TOAST AUTO CLOSE
   * -----------------------------
   */
  useEffect(() => {
    if (status !== "success") return;

    const timer = setTimeout(() => {
      setStatus("idle");
    }, 6000);

    return () => clearTimeout(timer);
  }, [status]);

  /*
   * -----------------------------
   * FORM CHANGE
   * -----------------------------
   */
  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  /*
   * -----------------------------
   * VALIDATION
   * -----------------------------
   */
  function validate(data) {
    if (!data.name.trim()) {
      return t.errorName;
    }

    if (!data.email.trim()) {
      return t.errorEmail;
    }

    const emailOk =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        data.email.trim()
      );

    if (!emailOk) {
      return t.errorEmailInvalid;
    }

    if (!data.message.trim()) {
      return t.errorMessage;
    }

    return null;
  }

  /*
   * -----------------------------
   * SUBMIT TO API
   * -----------------------------
   */
  async function submitForm(token, data) {
    if (!data) return;

    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch(API_URL, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          ...data,
          captchaToken: token,
          lang: langRef.current,
        }),
      });

      const responseData =
        await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(
          responseData.error ||
            t.errorNetwork
        );
      }

      /*
       * Успешная отправка
       */
      setStatus("success");

      setFormData({
        name: "",
        email: "",
        projectType: "",
        message: "",
      });

      setCaptchaToken("");

      /*
       * Сбрасываем Turnstile после успешной отправки.
       */
      if (
        widgetIdRef.current !== null &&
        window.turnstile
      ) {
        try {
          window.turnstile.reset(
            widgetIdRef.current
          );
        } catch (error) {
          // Ignore Turnstile reset errors.
        }
      }
    } catch (err) {
      setStatus("error");

      setErrorMsg(
        err?.message || t.errorNetwork
      );

      setCaptchaToken("");

      if (
        widgetIdRef.current !== null &&
        window.turnstile
      ) {
        try {
          window.turnstile.reset(
            widgetIdRef.current
          );
        } catch (error) {
          // Ignore Turnstile reset errors.
        }
      }
    }
  }

  /*
   * -----------------------------
   * FORM SUBMIT
   * -----------------------------
   */
  function handleSubmit(e) {
    e.preventDefault();

    const formEl = e.currentTarget;

    /*
     * Берём значения напрямую из DOM.
     *
     * Это помогает при browser autofill,
     * когда браузер изменил input,
     * но React onChange не был вызван.
     */
    const fd = new FormData(formEl);

    const currentData = {
      name: (
        fd.get("name") ||
        formData.name ||
        ""
      ).toString(),

      email: (
        fd.get("email") ||
        formData.email ||
        ""
      ).toString(),

      projectType: (
        fd.get("projectType") ||
        formData.projectType ||
        ""
      ).toString(),

      message: (
        fd.get("message") ||
        formData.message ||
        ""
      ).toString(),
    };

    /*
     * Синхронизируем React state
     * с реальными значениями формы.
     */
    setFormData(currentData);

    /*
     * Валидация
     */
    const validationError =
      validate(currentData);

    if (validationError) {
      setStatus("error");
      setErrorMsg(validationError);
      return;
    }

    /*
     * Если Turnstile не настроен —
     * отправляем сразу.
     */
    if (!TURNSTILE_SITE_KEY) {
      submitForm("", currentData);
      return;
    }

    setStatus("sending");
    setErrorMsg("");

    /*
     * Если токен уже есть —
     * отправляем сразу.
     */
    if (captchaToken) {
      submitForm(
        captchaToken,
        currentData
      );

      return;
    }

    /*
     * Иначе ждём callback Turnstile.
     */
    pendingSubmitRef.current = true;
    pendingDataRef.current = currentData;

    if (
      widgetIdRef.current !== null &&
      window.turnstile
    ) {
      try {
        window.turnstile.execute(
          widgetIdRef.current
        );
      } catch (error) {
        pendingSubmitRef.current = false;
        pendingDataRef.current = null;

        setStatus("error");
        setErrorMsg(t.errorCaptcha);
      }
    } else {
      pendingSubmitRef.current = false;
      pendingDataRef.current = null;

      setStatus("error");
      setErrorMsg(t.errorCaptcha);
    }
  }

  /*
   * -----------------------------
   * RENDER
   * -----------------------------
   */
  return (
    <>
      {createPortal(
        <div className="form-toast-container">
          <AnimatePresence mode="wait">
            {status === "success" && (
              <motion.div
                key="success"
                className="form-alert form-alert--success"
                initial={{
                  opacity: 0,
                  y: -24,
                  scale: 0.95,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  y: -24,
                  scale: 0.95,
                }}
                transition={{
                  duration: 0.25,
                  ease: "easeOut",
                }}
              >
                <CheckCircle2
                  className="form-alert__icon"
                  size={20}
                />

                <span className="form-alert__text">
                  {t.successMsg}
                </span>

                <button
                  type="button"
                  className="form-alert__close"
                  onClick={() =>
                    setStatus("idle")
                  }
                  aria-label={t.closeAlert}
                >
                  <img
                    src={`${process.env.PUBLIC_URL}/sprites/icons/xrest.svg`}
                    alt=""
                  />
                </button>
              </motion.div>
            )}

            {status === "error" && (
              <motion.div
                key="error"
                className="form-alert form-alert--error"
                initial={{
                  opacity: 0,
                  y: -24,
                  scale: 0.95,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  y: -24,
                  scale: 0.95,
                }}
                transition={{
                  duration: 0.25,
                  ease: "easeOut",
                }}
              >
                <XCircle
                  className="form-alert__icon"
                  size={20}
                />

                <span className="form-alert__text">
                  {errorMsg}
                </span>

                <button
                  type="button"
                  className="form-alert__close"
                  onClick={() =>
                    setStatus("idle")
                  }
                  aria-label={t.closeAlert}
                >
                  <img
                    src={`${process.env.PUBLIC_URL}/sprites/icons/xrest.svg`}
                    alt=""
                  />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>,
        document.body
      )}

      <section className="contact-section">
        <img
          className="contact-bg"
          src={`${process.env.PUBLIC_URL}/sprites/form.png`}
          alt="Logo"
          loading="lazy"
          decoding="async"
        />

        <div className="flex">
          <div
            className="shadow-mini"
            style={{
              zIndex: 2,
              marginTop: "0px",
            }}
          />

          <span
            id="contact-label"
            ref={registerTitle}
            className="contact-label"
          >
            {t.label}
          </span>

          {visibleTitles["contact-label"] && (
            <TitleDot />
          )}
        </div>

        <h1 className="contact-title">
          <Typewriter
            text={t.title}
            speed={60}
          />
        </h1>

        <div className="contact-container">
          {/* LEFT */}

          <div className="contact-left">
            <div className="flex">
              <div
                className="shadow-mini"
                style={{
                  zIndex: 2,
                  height: "65%",
                  filter: "blur(26px)",
                }}
              />

              <p
                className="contact-text"
                style={{ zIndex: 4 }}
              >
                {t.text
                  .split("\n")
                  .map((line, i, arr) => (
                    <span key={i}>
                      {line}

                      {i < arr.length - 1 && (
                        <br />
                      )}
                    </span>
                  ))}
              </p>
            </div>

            <form
              className="contact-form"
              onSubmit={handleSubmit}
              noValidate
            >
              <div className="contact-row">
                <div className="input-group">
                  <div className="input-run-border">
                    <label htmlFor="contact-name">
                      {t.name}
                    </label>

                    <input
                      id="contact-name"
                      type="text"
                      name="name"
                      placeholder={
                        t.namePlaceholder
                      }
                      value={formData.name}
                      onChange={handleChange}
                      disabled={
                        status === "sending"
                      }
                      autoComplete="name"
                    />
                  </div>
                </div>

                <div className="input-group">
                  <div className="input-run-border">
                    <label htmlFor="contact-email">
                      {t.email}
                    </label>

                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      placeholder={
                        t.emailPlaceholder
                      }
                      value={formData.email}
                      onChange={handleChange}
                      disabled={
                        status === "sending"
                      }
                      autoComplete="email"
                    />
                  </div>
                </div>
              </div>

              <div className="input-group">
                <div className="input-run-border">
                  <label htmlFor="contact-project-type">
                    {t.projectType}
                  </label>

                  <input
                    id="contact-project-type"
                    type="text"
                    name="projectType"
                    placeholder={
                      t.projectTypePlaceholder
                    }
                    value={
                      formData.projectType
                    }
                    onChange={handleChange}
                    disabled={
                      status === "sending"
                    }
                    autoComplete="off"
                  />
                </div>
              </div>

              <div className="input-group">
                <div className="input-run-border">
                  <label htmlFor="contact-message">
                    {t.message}
                  </label>

                  <textarea
                    id="contact-message"
                    name="message"
                    placeholder={
                      t.messagePlaceholder
                    }
                    value={formData.message}
                    onChange={handleChange}
                    disabled={
                      status === "sending"
                    }
                  />
                </div>
              </div>

              {TURNSTILE_SITE_KEY && (
                <div
                  className="turnstile-widget"
                  ref={turnstileRef}
                />
              )}

              <button
                className="send-btn"
                type="submit"
                disabled={
                  status === "sending"
                }
              >
                <span>
                  {status === "sending"
                    ? t.sending
                    : t.send}
                </span>
              </button>
            </form>
          </div>

          {/* RIGHT */}

          <div className="contact-right">
            <div className="bubble bubble-1">
              <a
                href="mailto:v.designer007591@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                EMAIL
              </a>
            </div>

            <div className="bubble bubble-2">
              <a
                href="https://www.linkedin.com/in/valeriia-romanishyna69"
                target="_blank"
                rel="noopener noreferrer"
              >
                LINKEDIN
              </a>
            </div>

            <div className="bubble bubble-3">
              <a
                href="https://www.behance.net/ValeriiaRomanishyna"
                target="_blank"
                rel="noopener noreferrer"
              >
                BEHANCE
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
