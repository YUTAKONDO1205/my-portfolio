"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";

const FRAME_COUNT = 192;
const PRIORITY_COUNT = 32;
const LAZY_CHUNK_SIZE = 8;
const FRAME_PATH = (i: number) =>
  `/frames/frame_${String(i).padStart(4, "0")}.jpg`;

type IdleWindow = Window & {
  requestIdleCallback?: (cb: () => void) => number;
};

function HeroCanvas({ progress }: { progress: MotionValue<number> }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const framesRef = useRef<(HTMLImageElement | undefined)[]>([]);
  const lastIndexRef = useRef(-1);
  const [firstReady, setFirstReady] = useState(false);

  // Preload: priority pass for frames 1-32 (decode() so we know they're paintable),
  // then idle-time chunks of 8 for the rest.
  useEffect(() => {
    let cancelled = false;
    const frames: (HTMLImageElement | undefined)[] = new Array(FRAME_COUNT);
    framesRef.current = frames;

    const loadOne = (idx: number): Promise<void> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.decoding = "async";
        img.src = FRAME_PATH(idx + 1);
        const finish = () => {
          frames[idx] = img;
          resolve();
        };
        if (typeof img.decode === "function") {
          img.decode().then(finish).catch(finish);
        } else {
          img.onload = finish;
          img.onerror = finish;
        }
      });
    };

    const priorityIdx = Array.from({ length: PRIORITY_COUNT }, (_, i) => i);
    Promise.all(priorityIdx.map(loadOne)).then(() => {
      if (cancelled) return;
      setFirstReady(true);

      const remaining: number[] = [];
      for (let i = PRIORITY_COUNT; i < FRAME_COUNT; i++) remaining.push(i);

      const scheduleChunk = (start: number) => {
        if (cancelled) return;
        const slice = remaining.slice(start, start + LAZY_CHUNK_SIZE);
        if (slice.length === 0) return;
        const runChunk = () => {
          Promise.all(slice.map(loadOne)).then(() => {
            scheduleChunk(start + LAZY_CHUNK_SIZE);
          });
        };
        const w = window as IdleWindow;
        if (typeof w.requestIdleCallback === "function") {
          w.requestIdleCallback(runChunk);
        } else {
          setTimeout(runChunk, 0);
        }
      };
      scheduleChunk(0);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  // Canvas drawing — react to MotionValue progress changes via subscribe (no React state on hot path).
  useEffect(() => {
    if (!firstReady) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    // Clamp DPR to 1.5 on mobile to keep memory + paint cost down — high-DPR
    // phones don't benefit from 3x on a watched 1920x1080 source.
    const dprCap = isMobile ? 1.5 : 2;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, dprCap);
      const w = canvas.clientWidth || window.innerWidth;
      const h = canvas.clientHeight || window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    };

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
      const zoom = isMobile ? 1.34 : 1.12;
      drawW *= zoom;
      drawH *= zoom;
      ctx.drawImage(img, (cw - drawW) / 2, (ch - drawH) / 2, drawW, drawH);
    };

    const renderFromProgress = (p: number) => {
      const idx = Math.max(
        0,
        Math.min(FRAME_COUNT - 1, Math.round(p * (FRAME_COUNT - 1))),
      );
      if (idx === lastIndexRef.current) return;
      lastIndexRef.current = idx;
      drawFrame(idx);
    };

    resize();
    renderFromProgress(progress.get());

    const unsubscribe = progress.on("change", renderFromProgress);
    const onResize = () => {
      resize();
      lastIndexRef.current = -1;
      renderFromProgress(progress.get());
    };
    window.addEventListener("resize", onResize);

    return () => {
      unsubscribe();
      window.removeEventListener("resize", onResize);
    };
  }, [firstReady, progress]);

  return <canvas ref={canvasRef} className="hero-canvas" aria-hidden="true" />;
}

function StaticHero() {
  return (
    <section
      className="hero-stage-outer hero-stage-outer-reduced"
      aria-label="Yuta Kondo Portfolio"
    >
      <div className="hero-sticky hero-sticky-reduced">
        <img
          src={FRAME_PATH(96)}
          alt=""
          className="hero-canvas hero-canvas-static"
          aria-hidden="true"
        />
        <div className="hero-vignette" aria-hidden="true" />
        <div className="hero-grain" aria-hidden="true" />
        <div className="hero-phase hero-phase-static">
          <div className="hero-phase-inner">
            <h1 className="hero-headline">Sense. Decide. Share.</h1>
            <div className="hero-cta-row">
              <a
                className="hero-cta-primary hero-phase-cta"
                href="https://github.com/marketplace/actions/vibe-guard-aicoding"
                target="_blank"
                rel="noopener noreferrer"
              >
                VibeGuard を試す →
              </a>
              <a
                className="hero-cta-secondary hero-phase-cta"
                href="/research"
              >
                研究を読む →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function FrameSequenceHero() {
  const outerRef = useRef<HTMLElement | null>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ["start start", "end end"],
  });

  // Helpers — array-based useTransform with flat plateaus produced incorrect
  // values in this Motion version, so all mappings are written as inline
  // functions that return CSS-clamped scalars.
  const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  const seg = (p: number, p0: number, p1: number) =>
    clamp01((p - p0) / (p1 - p0));

  const p1Scale = useTransform(scrollYProgress, (p) =>
    lerp(1.0, 1.15, seg(p, 0, 0.25)),
  );
  const p1Opacity = useTransform(scrollYProgress, (p) =>
    1 - seg(p, 0.18, 0.28),
  );

  const p2Opacity = useTransform(scrollYProgress, (p) => {
    if (p < 0.28) return 0;
    if (p < 0.36) return seg(p, 0.28, 0.36);
    if (p < 0.58) return 1;
    return 1 - seg(p, 0.58, 0.67);
  });
  const p2Y = useTransform(scrollYProgress, (p) => {
    if (p < 0.28) return 40;
    if (p < 0.4) return lerp(40, 0, seg(p, 0.28, 0.4));
    return lerp(0, -24, seg(p, 0.4, 0.67));
  });
  const p2Filter = useTransform(scrollYProgress, (p) => {
    let b: number;
    if (p < 0.28) b = 12;
    else if (p < 0.4) b = lerp(12, 0, seg(p, 0.28, 0.4));
    else b = lerp(0, 6, seg(p, 0.4, 0.67));
    return `blur(${b}px)`;
  });
  const tileOp = (p: number, start: number) => {
    if (p < start) return 0;
    if (p < start + 0.08) return seg(p, start, start + 0.08);
    if (p < 0.58) return 1;
    return 1 - seg(p, 0.58, 0.67);
  };
  const tile1Opacity = useTransform(scrollYProgress, (p) => tileOp(p, 0.3));
  const tile2Opacity = useTransform(scrollYProgress, (p) => tileOp(p, 0.34));
  const tile3Opacity = useTransform(scrollYProgress, (p) => tileOp(p, 0.38));

  const p3Opacity = useTransform(scrollYProgress, (p) => {
    if (p < 0.67) return 0;
    return seg(p, 0.67, 0.78);
  });
  const p3Y = useTransform(scrollYProgress, (p) => {
    if (p < 0.67) return 60;
    if (p < 0.8) return lerp(60, 0, seg(p, 0.67, 0.8));
    return lerp(0, -10, seg(p, 0.8, 1));
  });
  const p3Clip = useTransform(scrollYProgress, (p) => {
    const v = (1 - seg(p, 0.67, 0.78)) * 100;
    return `inset(${v}% 0 0 0)`;
  });

  if (reduce) {
    return <StaticHero />;
  }

  return (
    <section
      ref={outerRef}
      className="hero-stage-outer"
      style={{ height: "350vh" }}
      aria-label="Yuta Kondo Portfolio"
    >
      <div
        className="hero-sticky"
        style={{ position: "sticky", top: 0, height: "100vh" }}
      >
        <HeroCanvas progress={scrollYProgress} />
        <div className="hero-vignette" aria-hidden="true" />
        <div className="hero-grain" aria-hidden="true" />

        <motion.div
          className="hero-phase"
          style={{
            opacity: p1Opacity,
            scale: p1Scale,
          }}
        >
          <motion.h1
            className="hero-headline"
            initial={{ clipPath: "inset(100% 0 0 0)" }}
            animate={{ clipPath: "inset(0% 0 0 0)" }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
          >
            Sense. Decide. Share.
          </motion.h1>
        </motion.div>

        <motion.div
          className="hero-phase"
          style={{
            opacity: p2Opacity,
            y: p2Y,
            filter: p2Filter,
          }}
        >
          <div className="hero-phase-inner">
            <p className="hero-subtitle">
              現場の信号を、判断と公開につないでいく。
            </p>
            <div className="hero-tile-row">
              <motion.div className="hero-tile" style={{ opacity: tile1Opacity }}>
                <span className="hero-tile-icon" aria-hidden="true">◆</span>
                <span className="hero-tile-label">Edge AI</span>
                <span className="hero-tile-value">受賞 6 件</span>
              </motion.div>
              <motion.div className="hero-tile" style={{ opacity: tile2Opacity }}>
                <span className="hero-tile-icon" aria-hidden="true">◇</span>
                <span className="hero-tile-label">3-axis loop</span>
                <span className="hero-tile-value">Sense → Decide → Share</span>
              </motion.div>
              <motion.div className="hero-tile" style={{ opacity: tile3Opacity }}>
                <span className="hero-tile-icon" aria-hidden="true">◈</span>
                <span className="hero-tile-label">VibeGuard</span>
                <span className="hero-tile-value">4 marketplaces</span>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="hero-phase"
          style={{
            opacity: p3Opacity,
            y: p3Y,
            clipPath: p3Clip,
          }}
        >
          <div className="hero-phase-inner">
            <div className="hero-cta-row">
              <a
                className="hero-cta-primary hero-phase-cta"
                href="https://github.com/marketplace/actions/vibe-guard-aicoding"
                target="_blank"
                rel="noopener noreferrer"
              >
                VibeGuard を試す →
              </a>
              <a
                className="hero-cta-secondary hero-phase-cta"
                href="/research"
              >
                研究を読む →
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
