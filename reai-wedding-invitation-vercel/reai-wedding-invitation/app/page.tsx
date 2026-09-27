"use client";

import {
  type CSSProperties,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type Language = "zh" | "en";
type InvitationLine = { text: string; kind?: string };

const coverSets: Record<Language, string[]> = {
  zh: ["/01-cover.png", "/02-cover.png", "/03-cover.png"],
  en: ["/01-cover-eng.png", "/02-cover-eng.png", "/03-cover-eng.png"],
};

const invitationCopy: Record<Language, InvitationLine[]> = {
  zh: [
    { text: "這是個情感沸騰的日子，" },
    { text: "今天這兒充滿著愛與熱。" },
    { text: "我們決定結婚" },
    { text: "成為彼此的同誌。" },
    { text: "", kind: "space" },
    { text: "來吧！", kind: "callout" },
    { text: "", kind: "space" },
    { text: "這裡有酒，" },
    { text: "有食物，" },
    { text: "有鮮花，" },
    { text: "有同誌，" },
    { text: "", kind: "space" },
    { text: "請與我們一起" },
    { text: "吃飯、喝酒、喧嘩、相愛。" },
    { text: "直到夜晚結束。" },
    { text: "直到新的生活開始。" },
    { text: "", kind: "large-space" },
    { text: "金宇軒", kind: "name" },
    { text: "楊欣宜", kind: "name" },
    { text: "鞠躬", kind: "bow" },
    { text: "", kind: "space" },
    { text: "時：十月二十三日下午五時", kind: "detail" },
    { text: "址：Ci Siamo, New York.", kind: "detail" },
  ],
  en: [
    { text: "TONIGHT", kind: "title" },
    { text: "WE FORM AN ALLIANCE.", kind: "title" },
    { text: "", kind: "space" },
    { text: "No grand promises." },
    { text: "No fixed horizons." },
    { text: "", kind: "space" },
    { text: "Just two people" },
    { text: "choosing to remain on the same side." },
    { text: "", kind: "space" },
    { text: "Come hungry." },
    { text: "Come thirsty." },
    { text: "Come unfinished." },
    { text: "", kind: "space" },
    { text: "Eat." },
    { text: "Drink." },
    { text: "Make noise." },
    { text: "Fall in love." },
    { text: "", kind: "space" },
    { text: "Stay until the flowers collapse." },
    { text: "Stay until the bottles are empty." },
    { text: "Stay until the night has nothing left to give." },
    { text: "", kind: "space" },
    { text: "And when morning comes," },
    { text: "we begin—" },
    { text: "", kind: "space" },
    { text: "together." },
    { text: "", kind: "large-space" },
    { text: "Yuxuan & Xinyi", kind: "name" },
    { text: "", kind: "space" },
    { text: "6:00 pm, OCT 23, 2026", kind: "detail" },
    { text: "ci siamo, 440 West 33rd Street,", kind: "detail" },
    { text: "Suite 100, New York, NY 10001", kind: "detail" },
  ],
};

function TypedInvitation({
  language,
  lines,
  visibleCharacters,
}: {
  language: Language;
  lines: InvitationLine[];
  visibleCharacters: number;
}) {
  const characterStarts = lines.map((_, index) =>
    lines
      .slice(0, index)
      .reduce((total, previousLine) => total + previousLine.text.length + 1, 0),
  );
  const rendered = lines.map((line, index) => {
    const start = characterStarts[index];
    const text = line.text.slice(
      0,
      Math.max(0, Math.min(line.text.length, visibleCharacters - start)),
    );
    return (
      <span className={`invitation-line ${line.kind ?? ""}`} key={index}>
        {text}
      </span>
    );
  });

  if (language === "en") {
    return (
      <div
        className="invitation-copy english-copy"
        aria-label={lines.map((line) => line.text).join(" ")}
      >
        <div className="copy-flow english-flow">{rendered}</div>
      </div>
    );
  }

  return (
    <div className="invitation-copy" aria-label={lines.map((line) => line.text).join(" ")}>
      <div className="copy-flow">{rendered.slice(0, 17)}</div>
      <div className="signature-block">
        <div className="names">{rendered.slice(17, 19)}</div>
        {rendered[19]}
      </div>
      <div className="details">{rendered.slice(20)}</div>
    </div>
  );
}

export default function Home() {
  const [language, setLanguage] = useState<Language>("zh");
  const [coverIndex, setCoverIndex] = useState<number | null>(null);
  const [visibleCharacters, setVisibleCharacters] = useState(0);
  const [textCelebrationVisible, setTextCelebrationVisible] = useState(false);
  const textSectionRef = useRef<HTMLElement>(null);
  const lines = invitationCopy[language];
  const covers = coverSets[language];
  const totalCharacters = useMemo(
    () => lines.reduce((total, line) => total + line.text.length + 1, 0),
    [lines],
  );
  useEffect(() => {
    const section = textSectionRef.current;
    if (!section) return;
    let timer: ReturnType<typeof setInterval> | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || timer) return;
        timer = setInterval(() => {
          setVisibleCharacters((current) => {
            if (current >= totalCharacters) {
              if (timer) clearInterval(timer);
              return current;
            }
            return current + 1;
          });
        }, language === "en" ? 70 : 105);
        observer.disconnect();
      },
      { threshold: 0.14 },
    );
    observer.observe(section);
    return () => {
      observer.disconnect();
      if (timer) clearInterval(timer);
    };
  }, [language, totalCharacters]);

  const changeLanguage = (nextLanguage: Language) => {
    if (nextLanguage === language) return;
    setLanguage(nextLanguage);
    setCoverIndex(null);
    setVisibleCharacters(0);
    setTextCelebrationVisible(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className={`invitation-stage language-${language}`}>
      <nav className="language-switch" aria-label="语言选择">
        <button
          className={language === "zh" ? "is-active" : ""}
          type="button"
          aria-pressed={language === "zh"}
          onClick={() => changeLanguage("zh")}
        >
          中文
        </button>
        <button
          className={language === "en" ? "is-active" : ""}
          type="button"
          aria-pressed={language === "en"}
          onClick={() => changeLanguage("en")}
        >
          english
        </button>
      </nav>

      <section
        className="cover-screen"
        aria-label={language === "zh" ? "婚礼请帖封面，点击开启并切换图片" : "Wedding invitation cover. Tap to open and change images."}
        onClick={() =>
          setCoverIndex((current) => (current === null ? 0 : (current + 1) % covers.length))
        }
      >
        <img
          className="artwork happiness"
          src={language === "zh" ? "/喜字.png" : "/wedding.png"}
          alt={language === "zh" ? "喜" : "Wedding"}
          draggable={false}
        />

        {covers.map((cover, index) => {
          if (coverIndex === null) {
            return <img className="artwork cover" src={cover} alt="" aria-hidden="true" draggable={false} key={cover} />;
          }
          let offset = (index - coverIndex + covers.length) % covers.length;
          if (offset > 1) offset -= covers.length;
          const position = offset;
          const style = {
            "--slide-position": position,
            "--slide-scale": Math.max(0.8, 1 - Math.abs(position) * 0.17),
            "--slide-opacity": Math.max(0, 1 - Math.abs(position) * 1.08),
            zIndex: Math.abs(position) < 0.5 ? 4 : 3,
          } as CSSProperties;
          return (
            <img
              className="artwork cover is-revealed"
              src={cover}
              alt={index === coverIndex ? `${language === "zh" ? "婚礼插画" : "Wedding illustration"} ${index + 1}` : ""}
              aria-hidden={index !== coverIndex}
              draggable={false}
              style={style}
              key={cover}
            />
          );
        })}

        <div className={`decor-layer ${coverIndex !== null ? "is-visible" : ""}`} aria-hidden="true">
          <img src="/decor.png" alt="" draggable={false} />
        </div>
      </section>

      <section
        className="text-screen"
        ref={textSectionRef}
        aria-label={language === "zh" ? "婚礼请帖正文，文字显示完成后点击出现庆祝图案" : "Wedding invitation text. Tap after the text finishes to celebrate."}
        onClick={() => {
          if (visibleCharacters < totalCharacters) {
            setVisibleCharacters(totalCharacters);
          } else {
            setTextCelebrationVisible(true);
          }
        }}
      >
        <TypedInvitation language={language} lines={lines} visibleCharacters={visibleCharacters} />
        <div className={`flower-layer ${textCelebrationVisible ? "is-visible" : ""}`} aria-hidden="true">
          <img src="/flower.png" alt="" draggable={false} />
        </div>
      </section>
    </main>
  );
}
