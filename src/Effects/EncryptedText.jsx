import { useEffect, useRef, useState, useCallback } from "react";

const CHARS = "!@#$*%&?";

const randChar = () => CHARS[Math.floor(Math.random() * CHARS.length)];

function wrapText(text, maxLen) {
  if (!maxLen) return [text];

  const words = text.split(" ");
  const result = [];
  let current = "";

  words.forEach((word) => {
    const candidate = current ? `${current} ${word}` : word;

    if (candidate.length > maxLen && current) {
      result.push(current);
      current = word;
    } else {
      current = candidate;
    }
  });

  if (current) result.push(current);

  return result;
}

export default function EncryptedText({
  text = "",
  lines = null,
  speed,
  baseSpeed = 60,
  variance = 700,
  anchorIndex = 0,
  maxLineLength = null,
}) {
  // Тик "мерцания" должен всегда быть быстрым независимо от того,
  // что передано в speed/baseSpeed — иначе при tick > variance все
  // символы раскрываются разом на первом же тике (нет анимации).
  const effectiveSpeed = Math.min(speed ?? baseSpeed, 60);

  const effectiveLines =
    lines || (maxLineLength ? wrapText(text, maxLineLength) : null);

  const fullText = effectiveLines
    ? effectiveLines.join("\n")
    : text;

  const ref = useRef(null);
  const intervalRef = useRef(null);

  const buildChars = useCallback(
    (str) =>
      str.split("").map((ch, i) => ({
        ch,
        encrypted: randChar(),

        revealed:
          ch === "\n" ||
          ch === " " ||
          i === anchorIndex,
      })),
    [anchorIndex]
  );

  const [chars, setChars] = useState(() =>
    buildChars(fullText)
  );

  const startAnimation = useCallback(() => {
    clearInterval(intervalRef.current);

    const start = performance.now();

    const delays = fullText.split("").map((ch) =>
      ch === "\n" || ch === " "
        ? 0
        : Math.random() * variance
    );

    setChars(buildChars(fullText));

    intervalRef.current = setInterval(() => {
      const now = performance.now() - start;

      setChars((prev) => {
        const next = prev.map((s, i) => {
          if (i === anchorIndex) return s;

          if (fullText[i] === "\n") return s;

          if (fullText[i] === " ") return s;

          if (s.revealed) return s;

          if (now > delays[i]) {
            return {
              ...s,
              revealed: true,
            };
          }

          return {
            ...s,
            encrypted: randChar(),
          };
        });

        if (next.every((s) => s.revealed)) {
          clearInterval(intervalRef.current);
        }

        return next;
      });
    }, effectiveSpeed);
  }, [fullText, variance, effectiveSpeed, anchorIndex, buildChars]);

  useEffect(() => {
    setChars(buildChars(fullText));
  }, [fullText, buildChars]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startAnimation();
        } else {
          clearInterval(intervalRef.current);
        }
      },
      {
        threshold: 0.3,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
      clearInterval(intervalRef.current);
    };
  }, [startAnimation]);

  const renderChar = (c, i) => (
    <span
      key={i}
      style={{
        display: "inline-block",
        position: "relative",
      }}
    >
      <span style={{ visibility: "hidden" }}>
        {c.ch}
      </span>

      <span
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          transition:
            "opacity 0.18s ease, filter 0.18s ease",
          opacity: c.revealed ? 1 : 0.38,
          filter: c.revealed
            ? "none"
            : "blur(0.5px)",
        }}
      >
        {c.revealed ? c.ch : c.encrypted}
      </span>
    </span>
  );

  const renderContent = () => {
    const output = [];
    let wordBuffer = [];

    const flushWord = (hasSpace = false, spaceIndex = null) => {
      if (!wordBuffer.length) return;

      output.push(
        <span
          key={`word-${wordBuffer[0].i}`}
          style={{
            display: "inline-block",
            whiteSpace: "nowrap",
          }}
        >
          {wordBuffer.map(({ c, i }) => renderChar(c, i))}

          {hasSpace && (
            <span
              key={`space-${spaceIndex}`}
              style={{
                display: "inline-block",
                whiteSpace: "nowrap",
              }}
            >
              {"\u00A0"}
            </span>
          )}
        </span>
      );

      wordBuffer = [];
    };

    chars.forEach((c, i) => {
      if (c.ch === "\n") {
        flushWord();

        output.push(
          <br key={`br-${i}`} />
        );
      } else if (c.ch === " ") {

        flushWord(true, i);
      } else {
        wordBuffer.push({
          c,
          i,
        });
      }
    });

    flushWord();

    return output;
  };

  return (
    <span
      ref={ref}
      style={{
        whiteSpace: "normal",
      }}
    >
      {renderContent()}
    </span>
  );
}