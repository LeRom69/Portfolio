import { useEffect, useRef, useState } from "react";

export default function Typewriter({
  text = "",
  speed = 70,
  cursor = true,
}) {
  const ref = useRef(null);

  const [displayText, setDisplayText] = useState("");
  const [done, setDone] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const indexRef = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.3,
      }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) {
      indexRef.current = 0;
      setDisplayText("");
      setDone(false);
      return;
    }

    indexRef.current = 0;
    setDisplayText("");
    setDone(false);

    const interval = setInterval(() => {
      indexRef.current++;

      setDisplayText(text.slice(0, indexRef.current));

      if (indexRef.current >= text.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [isVisible, text, speed]);

  return (
    <span ref={ref} className="typewriter">
      <span
        className="typewriter-placeholder"
        aria-hidden="true"
      >
        {text}
      </span>

      <span className="typewriter-live">
        {displayText}

        {cursor && !done && (
          <span className="typewriter-cursor">|</span>
        )}
      </span>
    </span>
  );
}