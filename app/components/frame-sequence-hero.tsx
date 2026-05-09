"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const FRAME_COUNT = 192;
const FRAME_PATH = (i: number) =>
  `/frames/frame_${String(i).padStart(4, "0")}.jpg`;

type Annotation = {
  id: string;
  step: string;
  title: string;
  subtitle: string;
  body: string;
  show: number;
  hide: number;
  position: "top-right" | "bottom-left" | "top-left";
};

const annotations: readonly Annotation[] = [
  {
    id: "sense",
    step: "STEP 01",
    title: "Sense",
    subtitle: "現場で拾う",
    body: "画像、振動、音響。 装置の前段で意味のある信号だけをすくい取り、 後段の負荷を切り詰める。",
    show: 0.12,
    hide: 0.34,
    position: "top-right",
  },
  {
    id: "decide",
    step: "STEP 02",
    title: "Decide",
    subtitle: "軽量に判断",
    body: "SPRESENSE 級のエッジで 必要な異常だけを叩き出す。 帯域とコストを切り詰めたまま現場で完結。",
    show: 0.40,
    hide: 0.62,
    position: "bottom-left",
  },
  {
    id: "share",
    step: "STEP 03",
    title: "Share",
    subtitle: "公開して次へ",
    body: "GitHub と Elchika に記録し、 検証は外に開く。 次の現場へ確実につなぐ。",
    show: 0.68,
    hide: 0.90,
    position: "top-right",
  },
];

export function FrameSequenceHero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stickyRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const heroTextRef = useRef<HTMLDivElement | null>(null);
  const scrollCueRef = useRef<HTMLDivElement | null>(null);
  const continueRef = useRef<HTMLDivElement | null>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const tickingRef = useRef(false);
  const prevVisibleIdsRef = useRef<string>("");

  const [loaded, setLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [visibleCards, setVisibleCards] = useState<Set<string>>(new Set());

  // Preload all frames with real progress
  useEffect(() => {
    let cancelled = false;
    let count = 0;
    const imgs: HTMLImageElement[] = [];
    const finalize = () => {
      if (cancelled) return;
      count += 1;
      setLoadProgress(count / FRAME_COUNT);
      if (count >= FRAME_COUNT) setLoaded(true);
    };
    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      img.decoding = "async";
      img.src = FRAME_PATH(i);
      img.onload = finalize;
      img.onerror = finalize;
      imgs.push(img);
    }
    framesRef.current = imgs;
    return () => {
      cancelled = true;
    };
  }, []);

  // Canvas drawing + scroll handler
  useEffect(() => {
    if (!loaded) return;
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const drawFrame = (index: number) => {
      const img = framesRef.current[index];
      if (!img || !img.complete || img.naturalWidth === 0) return;
      const cw = canvas.width;
      const ch = canvas.height;
      ctx.clearRect(0, 0, cw, ch);

      const imgRatio = img.naturalWidth / img.naturalHeight;
      const canvasRatio = cw / ch;
      let drawW: number;
      let drawH: number;
      if (canvasRatio > imgRatio) {
        drawW = cw;
        drawH = cw / imgRatio;
      } else {
        drawH = ch;
        drawW = ch * imgRatio;
      }
      // Slight zoom to crop watermark and create cinematic crop
      const zoom = window.innerWidth <= 768 ? 1.32 : 1.1;
      drawW *= zoom;
      drawH *= zoom;
      ctx.drawImage(img, (cw - drawW) / 2, (ch - drawH) / 2, drawW, drawH);
    };

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
    };

    const update = () => {
      const rect = section.getBoundingClientRect();
      const scrollableHeight = section.offsetHeight - window.innerHeight;
      const progress =
        scrollableHeight > 0
          ? Math.min(1, Math.max(0, -rect.top / scrollableHeight))
          : 0;
      const frameIndex = Math.min(
        FRAME_COUNT - 1,
        Math.max(0, Math.floor(progress * FRAME_COUNT)),
      );
      drawFrame(frameIndex);

      if (heroTextRef.current) {
        const fade = Math.max(0, 1 - progress / 0.10);
        const lift = Math.min(60, progress * 800);
        heroTextRef.current.style.opacity = String(fade);
        heroTextRef.current.style.transform = `translate3d(0, ${-lift}px, 0)`;
      }
      if (scrollCueRef.current) {
        const fade = Math.max(0, 1 - progress / 0.04);
        scrollCueRef.current.style.opacity = String(fade);
      }
      if (continueRef.current) {
        const fade = Math.max(0, (progress - 0.92) / 0.06);
        continueRef.current.style.opacity = String(Math.min(1, fade));
      }

      const newVisible = new Set<string>();
      for (const a of annotations) {
        if (progress >= a.show && progress <= a.hide) newVisible.add(a.id);
      }
      const newIds = [...newVisible].sort().join(",");
      if (newIds !== prevVisibleIdsRef.current) {
        prevVisibleIdsRef.current = newIds;
        setVisibleCards(newVisible);
      }
    };

    const handleScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      requestAnimationFrame(() => {
        update();
        tickingRef.current = false;
      });
    };

    const handleResize = () => {
      resizeCanvas();
      handleScroll();
    };

    resizeCanvas();
    update();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [loaded]);

  return (
    <section
      ref={sectionRef}
      className="frame-sequence-hero"
      aria-label="Yuta Kondo — Edge Intelligence Portfolio"
    >
      <div ref={stickyRef} className="fsh-sticky">
        <canvas ref={canvasRef} className="fsh-canvas" aria-hidden="true" />

        {/* Cinematic gradient masks: top-right hides watermark, bottom for text legibility */}
        <div className="fsh-mask-vignette" aria-hidden="true" />
        <div className="fsh-mask-corner" aria-hidden="true" />
        <div className="fsh-mask-bottom" aria-hidden="true" />

        {/* Grid overlay — gives technical feel */}
        <div className="fsh-grid" aria-hidden="true" />

        {/* Loading overlay (CSS-faded after load) */}
        <div
          className={`fsh-loader ${loaded ? "is-done" : ""}`}
          role="status"
          aria-live="polite"
          aria-hidden={loaded}
        >
          <p className="fsh-loader-eyebrow">Preparing visual sequence</p>
          <div className="fsh-loader-bar">
            <div
              className="fsh-loader-fill"
              style={{ width: `${loadProgress * 100}%` }}
            />
          </div>
          <p className="fsh-loader-progress">
            {Math.round(loadProgress * 100)}
            <span>%</span>
          </p>
          <p className="fsh-loader-hint">
            {Math.round(loadProgress * FRAME_COUNT)} / {FRAME_COUNT} frames
          </p>
        </div>

        {/* Hero overlay text */}
        <div ref={heroTextRef} className="fsh-overlay" aria-hidden={!loaded}>
          <div className="fsh-overlay-inner">
            <p className="fsh-eyebrow">
              <span className="fsh-eyebrow-dot" />
              YUTA KONDO &nbsp;/&nbsp; EDGE INTELLIGENCE PORTFOLIO
            </p>
            <h1 className="fsh-title">
              <span>Sense</span>
              <span className="fsh-title-sep">.</span>
              <span>Decide</span>
              <span className="fsh-title-sep">.</span>
              <span>Share</span>
              <span className="fsh-title-sep">.</span>
            </h1>
            <p className="fsh-lead">
              現場の信号を、 判断と公開につないでいく。
              <br />
              スクロールして、ループの全体像を見る。
            </p>
            <div className="fsh-meta">
              <span>
                <em>192</em> frames
              </span>
              <span className="fsh-meta-sep" />
              <span>
                <em>Sense → Decide → Share</em>
              </span>
              <span className="fsh-meta-sep" />
              <span>
                <em>Edge × AI</em>
              </span>
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div ref={scrollCueRef} className="fsh-scroll-cue" aria-hidden="true">
          <span>SCROLL</span>
          <div className="fsh-scroll-line">
            <div className="fsh-scroll-line-inner" />
          </div>
        </div>

        {/* Annotation cards */}
        <div className="fsh-annotations" aria-hidden={!loaded}>
          {annotations.map((a) => (
            <article
              key={a.id}
              className={`fsh-card fsh-card-${a.position} ${
                visibleCards.has(a.id) ? "is-visible" : ""
              }`}
            >
              <p className="fsh-card-step">{a.step}</p>
              <h3 className="fsh-card-title">
                {a.title}
                <span>{a.subtitle}</span>
              </h3>
              <p className="fsh-card-body">{a.body}</p>
              <div className="fsh-card-line" aria-hidden="true" />
            </article>
          ))}
        </div>

        {/* Continue cue at end of sequence */}
        <div ref={continueRef} className="fsh-continue" aria-hidden="true">
          <p className="fsh-continue-eyebrow">CONTINUE</p>
          <p className="fsh-continue-title">ポートフォリオ本編へ</p>
          <Link href="#projects" className="fsh-continue-cta">
            <span>研究と実装を見る</span>
            <span className="fsh-continue-arrow">↓</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
