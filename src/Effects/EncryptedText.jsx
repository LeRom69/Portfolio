import { useEffect, useRef, useState } from "react";

const CHARS = "!@#$*%&?";

const randChar = () => CHARS[Math.floor(Math.random() * CHARS.length)];

// Разбивает текст на строки так, чтобы длина строки не превышала maxLen,
// перенося "лишние" слова на следующую строку. Слова не разбиваются на символы.
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
  speed = 60,
  variance = 700,
  anchorIndex = 0,
  maxLineLength = null, // максимум символов в ряду (принудительный перенос по словам)
}) {
  const effectiveLines = lines || (maxLineLength ? wrapText(text, maxLineLength) : null);
  const fullText = effectiveLines ? effectiveLines.join("\n") : text;

  const buildChars = (str) =>
    str.split("").map((ch, i) => ({
      ch,
      encrypted: randChar(),
      revealed: ch === "\n" || ch === " " || i === anchorIndex,
    }));

  const ref = useRef(null);
  // Важно: сразу строим массив под fullText, а не пустой [] —
  // так резервируется место в layout с первого рендера, и сетки не прыгают.
  const [chars, setChars] = useState(() => buildChars(fullText));
  const intervalRef = useRef(null);

  const startAnimation = () => {
    clearInterval(intervalRef.current);

    const start = performance.now();
    const delays = fullText.split("").map((ch) =>
      ch === "\n" || ch === " " ? 0 : Math.random() * variance
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
          if (now > delays[i]) return { ...s, revealed: true };
          return { ...s, encrypted: randChar() };
        });

        if (next.every((s) => s.revealed)) {
          clearInterval(intervalRef.current);
        }

        return next;
      });
    }, speed);
  };

  // Пересобираем "скелет" символов только когда реально меняется текст
  // (например, смена языка) — это законное изменение layout.
  useEffect(() => {
    setChars(buildChars(fullText));
  }, [fullText]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startAnimation();
        } else {
          // Не обнуляем chars — просто останавливаем анимацию,
          // чтобы не менять размер блока и не дёргать сетки.
          clearInterval(intervalRef.current);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => {
      observer.disconnect();
      clearInterval(intervalRef.current);
    };
  }, [fullText, speed, variance]);

  // Рендер одного символа (буква/цифра/спецсимвол, не пробел и не перенос строки)
  const renderChar = (c, i) => (
    <span key={i} style={{ display: "inline-block", position: "relative" }}>
      <span style={{ visibility: "hidden" }}>{c.ch}</span>
      <span
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          transition: "opacity 0.18s ease, filter 0.18s ease",
          opacity: c.revealed ? 1 : 0.38,
          filter: c.revealed ? "none" : "blur(0.5px)",
        }}
      >
        {c.revealed ? c.ch : c.encrypted}
      </span>
    </span>
  );

  // Рендер обычного (разрывающего строку) пробела
  const renderSpace = (c, i) => (
    <span key={i} style={{ display: "inline-block", position: "relative" }}>
      <span style={{ visibility: "hidden" }}>&nbsp;</span>
      <span
        style={{
          position: "absolute",
          left: 0,
          top: 0,
        }}
      >
        {" "}
      </span>
    </span>
  );

  // Группируем символы в "слова", чтобы браузер переносил строки только
  // по пробелам/явным \n, а не разбивал слово посимвольно между строками.
  const renderContent = () => {
    const output = [];
    let wordBuffer = [];

    const flushWord = () => {
      if (wordBuffer.length) {
        output.push(
          <span
            key={`word-${wordBuffer[0].i}`}
            style={{ display: "inline-block", whiteSpace: "nowrap" }}
          >
            {wordBuffer.map(({ c, i }) => renderChar(c, i))}
          </span>
        );
        wordBuffer = [];
      }
    };

    chars.forEach((c, i) => {
      if (c.ch === "\n") {
        flushWord();
        output.push(<br key={`br-${i}`} />);
      } else if (c.ch === " ") {
        flushWord();
        output.push(renderSpace(c, i));
      } else {
        wordBuffer.push({ c, i });
      }
    });
    flushWord();

    return output;
  };

  return (
    <span ref={ref} style={{ whiteSpace: "normal" }}>
      {renderContent()}
    </span>
  );
}