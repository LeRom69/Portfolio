import { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

const STORAGE_KEY = "lang";

function getInitialLang() {
  if (typeof window === "undefined") return "EN";
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved === "EN" || saved === "UA" ? saved : "EN";
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(getInitialLang);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang);
  }, [lang]);

  const toggle = () => setLang((p) => (p === "EN" ? "UA" : "EN"));

  return (
    <LanguageContext.Provider value={{ lang, toggle }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}