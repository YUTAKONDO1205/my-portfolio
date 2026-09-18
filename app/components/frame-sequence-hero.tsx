"use client";

import Link from "next/link";
import { useEffect, useRef, useSyncExternalStore } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import {
  awardPrizeCount,
  heroCopyV2,
  selectedWorks,
  talks,
} from "../portfolio-data";
import styles from "./frame-sequence-hero.module.css";

const easeOut = [0.22, 1, 0.36, 1] as const;

/* ==========================================================================
   Constellation as instrument.

   The particles are samples, and scroll is the pipeline. Every glyph carries
   three homes and travels between them as the three acts play:

     Sense   four raw traces — vibration, audio, image, CO₂ — with a burst
             of disturbance on one channel
     Decide  the same samples folded into a spectrum: FFT bins on a baseline,
             a few dominant peaks standing out of the noise floor
     Share   one dense core with four satellites and the links between
             them — one analysis core, four distribution channels

   Letters of the owner's name are seeded through the field and travel with
   it. Everything is stroked at 1px on a transparent canvas, so the site-wide
   field behind the hero runs straight through it: one field, not two.
   Triangles are batched into a Path2D per colour and depth tier.
   ========================================================================== */

type ConstellationHandle = {
  setProgress: (p: number) => void;
  destroy: () => void;
};

type LetterDraw = { x: number; y: number; size: number; char: string };

const SPECTRUM = [
  "128, 82, 255", // Electric Iris
  "255, 184, 41", // Saffron Spark
  "47, 191, 163", // Deep Verdant, lifted for legibility on the dark ground
  "208, 92, 255", // magenta
  "90, 140, 255", // blue
] as const;

const NAME = "KondoYuta";
const LETTER_EVERY = 11;

const LETTER_FONT =
  '"Meiryo UI", "MeiryoUI", Meiryo, "Hiragino Kaku Gothic ProN", system-ui, sans-serif';

/* ---- target geometry (unit space: x in [-1, 1], y in [-0.7, 0.7]) ---- */

const TRACE_Y = [-0.5, -0.17, 0.17, 0.5] as const;
const BINS = 44;
const SATELLITES = 4;

function smoothstep(s: number, a: number, b: number) {
  const t = Math.max(0, Math.min(1, (s - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

/* Spectrum envelope: a decaying noise floor with three peaks. The first is
   the dominant one — the anomaly signature the Decide act is about. */
function spectrumHeight(k: number) {
  const t = k / (BINS - 1);
  const peak = (c: number, w: number, a: number) =>
    a * Math.exp(-((k - c) * (k - c)) / (2 * w * w));
  const h =
    0.14 +
    0.3 * Math.exp(-t * 3.4) +
    peak(7, 1.15, 0.66) +
    peak(19, 1.6, 0.4) +
    peak(31, 1.05, 0.24);
  return Math.min(1, h);
}

function createConstellation(canvas: HTMLCanvasElement): ConstellationHandle {
  const ctx = canvas.getContext("2d");
  if (!ctx) return { setProgress: () => {}, destroy: () => {} };

  type Glyph = {
    /** homes in unit space for the three acts */
    sx: number;
    sy: number;
    dx: number;
    dy: number;
    nx: number;
    ny: number;
    /** 0..1 — spreads the morph so the field flows instead of snapping */
    stagger: number;
    size: number;
    angle: number;
    spin: number;
    phase: number;
    drift: number;
    colorIndex: number;
    ambient: boolean;
    /** null = triangle */
    char: string | null;
  };

  let raf = 0;
  let running = true;
  let width = 0;
  let height = 0;
  let dpr = 1;
  let glyphs: Glyph[] = [];
  let paths: Path2D[] = [];

  let targetProgress = 0;
  let progress = 0;
  let targetMx = 0.5;
  let targetMy = 0.5;
  let mx = 0.5;
  let my = 0.5;

  let time = Math.random() * 500;
  let last = performance.now();

  const seedSense = (g: Glyph, i: number) => {
    const trace = i % TRACE_Y.length;
    const x = -1 + Math.random() * 2;
    const f = 6 + trace * 1.7;
    // one channel carries a burst of disturbance — the thing worth detecting
    const burst = trace === 2 && x > 0.22 && x < 0.58 ? 3.1 : 1;
    const y =
      TRACE_Y[trace] +
      Math.sin(x * f + trace * 1.3) * 0.08 * burst +
      (Math.random() - 0.5) * 0.045 * burst;
    g.sx = x;
    g.sy = y;
  };

  const seedDecide = (g: Glyph, i: number) => {
    const k = i % BINS;
    const w = 2 / BINS;
    const x = -1 + w * (k + 0.5) + (Math.random() - 0.5) * w * 0.55;
    const h = spectrumHeight(k) * 1.18;
    // sqrt bias fills the base of each bar more densely than its tip
    const y = 0.62 - Math.sqrt(Math.random()) * h;
    g.dx = x;
    g.dy = y;
  };

  const seedShare = (g: Glyph, i: number) => {
    const r = Math.random();
    const k = i % SATELLITES;
    const a = Math.PI / 4 + (k * Math.PI) / 2;
    const scx = Math.cos(a) * 0.74;
    const scy = Math.sin(a) * 0.5;
    if (r < 0.36) {
      // the core
      const th = Math.random() * Math.PI * 2;
      const rr = Math.sqrt(Math.random()) * 0.2;
      g.nx = Math.cos(th) * rr;
      g.ny = Math.sin(th) * rr;
    } else if (r < 0.8) {
      // four satellites
      const th = Math.random() * Math.PI * 2;
      const rr = Math.sqrt(Math.random()) * 0.15;
      g.nx = scx + Math.cos(th) * rr;
      g.ny = scy + Math.sin(th) * rr;
    } else {
      // the links between them
      const t = 0.22 + Math.random() * 0.56;
      g.nx = scx * t + (Math.random() - 0.5) * 0.03;
      g.ny = scy * t + (Math.random() - 0.5) * 0.03;
    }
  };

  const seedAmbient = (g: Glyph) => {
    const theta = Math.random() * Math.PI * 2;
    const r = 1.2 + Math.random() * 1.4;
    g.sx = g.dx = g.nx = Math.cos(theta) * r;
    g.sy = g.dy = g.ny = Math.sin(theta) * r * 0.72;
  };

  const build = () => {
    const isMobile = width <= 768;
    const count = Math.min(
      isMobile ? 640 : 1500,
      Math.round((width * height) / (isMobile ? 880 : 620)),
    );

    let letterCursor = 0;

    glyphs = Array.from({ length: count }, (_, i) => {
      // the site-wide field already scatters glyphs; the hero keeps only a
      // thin ambient halo of its own
      const ambient = i % 7 === 0;
      const isLetter = i % LETTER_EVERY === 3;
      let char: string | null = null;
      if (isLetter) {
        char = NAME[letterCursor % NAME.length];
        letterCursor += 1;
      }

      const g: Glyph = {
        sx: 0,
        sy: 0,
        dx: 0,
        dy: 0,
        nx: 0,
        ny: 0,
        stagger: ((i * 7) % 13) / 13,
        size: isLetter
          ? (ambient ? 11 : 9) + Math.random() * 7
          : ambient
            ? 2 + Math.random() * 3
            : 1.6 + Math.random() * 2.8,
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.018,
        phase: Math.random() * Math.PI * 2,
        drift: ambient
          ? 0.03 + Math.random() * 0.06
          : 0.01 + Math.random() * 0.028,
        colorIndex: Math.floor(Math.random() * SPECTRUM.length),
        ambient,
        char,
      };
      if (ambient) {
        seedAmbient(g);
      } else {
        seedSense(g, i);
        seedDecide(g, i);
        seedShare(g, i);
      }
      return g;
    });
  };

  const resize = () => {
    const isMobile = window.innerWidth <= 768;
    const nextDpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);
    const nextW = canvas.clientWidth;
    const nextH = canvas.clientHeight;
    // Mobile URL-bar collapse fires resize without changing the 100svh box.
    if (
      nextDpr === dpr &&
      nextW === width &&
      nextH === height &&
      glyphs.length > 0
    ) {
      return;
    }

    dpr = nextDpr;
    width = nextW;
    height = nextH;
    canvas.width = Math.max(1, Math.round(width * dpr));
    canvas.height = Math.max(1, Math.round(height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    build();
  };

  const tick = (now: number) => {
    if (!running) return;
    const dt = Math.min(2.6, (now - last) / 16.667);
    last = now;
    time += dt * 0.016;

    // Chase external inputs so scroll and pointer never read as steps.
    progress += (targetProgress - progress) * (1 - Math.pow(0.93, dt));
    mx += (targetMx - mx) * (1 - Math.pow(0.92, dt));
    my += (targetMy - my) * (1 - Math.pow(0.92, dt));

    ctx.clearRect(0, 0, width, height);

    const s = Math.max(0, Math.min(1, progress));
    const isMobile = width <= 768;

    // Two-column composition: the instrument sits in the right half on
    // desktop, centred above the copy once the columns collapse.
    const cx = width * (isMobile ? 0.5 : 0.67);
    const cy = height * (isMobile ? 0.4 : 0.5);
    const scale = Math.min(width, height) * (isMobile ? 0.44 : 0.46);

    // Two batches per colour — dense instrument and dim ambient halo — so
    // the depth separation survives the Path2D batching.
    paths = Array.from({ length: SPECTRUM.length * 2 }, () => new Path2D());
    // Letters cannot go into a Path2D, so they are collected per colour and
    // drawn in a second pass with one fillStyle change each.
    const letters: LetterDraw[][] = Array.from(
      { length: SPECTRUM.length * 2 },
      () => [],
    );

    const radius = Math.min(width, height) * 0.28;

    for (const g of glyphs) {
      g.angle += g.spin * dt;

      // Act 1 → Act 2 folds the traces into the spectrum; Act 2 → Act 3
      // opens the spectrum into the network. Each glyph is offset by its
      // stagger so the morph sweeps through the field rather than snapping.
      const j = g.stagger * 0.09;
      const pA = smoothstep(s, 0.15 + j, 0.38 + j);
      const pB = smoothstep(s, 0.57 + j, 0.83 + j);

      let hx = g.sx + (g.dx - g.sx) * pA;
      let hy = g.sy + (g.dy - g.sy) * pA;
      // a lateral arc in transit so paths never read as straight lines
      hy += Math.sin(pA * Math.PI) * 0.1 * Math.sin(g.phase);
      hx += (g.nx - hx) * pB;
      hy += (g.ny - hy) * pB;
      hx += Math.sin(pB * Math.PI) * 0.1 * Math.cos(g.phase);

      // per-glyph wander keeps the instrument alive when the page is still
      const wobbleX = Math.sin(time * 1.05 + g.phase) * g.drift;
      const wobbleY = Math.cos(time * 0.92 + g.phase * 1.4) * g.drift;

      let x = cx + (hx + wobbleX) * scale;
      let y = cy + (hy + wobbleY) * scale;

      // Pointer pushes the field gently aside — a damped repulsion.
      const pdx = x - mx * width;
      const pdy = y - my * height;
      const pd2 = pdx * pdx + pdy * pdy;
      if (pd2 < radius * radius) {
        const pd = Math.sqrt(pd2) || 1;
        const push = (1 - pd / radius) * 56;
        x += (pdx / pd) * push;
        y += (pdy / pd) * push;
      }

      if (x < -30 || x > width + 30 || y < -30 || y > height + 30) continue;

      const batch = g.colorIndex + (g.ambient ? SPECTRUM.length : 0);

      if (g.char) {
        letters[batch].push({ x, y, size: g.size, char: g.char });
        continue;
      }

      const cos = Math.cos(g.angle);
      const sin = Math.sin(g.angle);
      const path = paths[batch];
      for (let i = 0; i < 3; i += 1) {
        const a = (i * Math.PI * 2) / 3 - Math.PI / 2;
        const px = Math.cos(a) * g.size;
        const py = Math.sin(a) * g.size;
        const vx = x + px * cos - py * sin;
        const vy = y + px * sin + py * cos;
        if (i === 0) path.moveTo(vx, vy);
        else path.lineTo(vx, vy);
      }
      path.closePath();
    }

    // Act 2 instrument chrome: a baseline and bin ticks under the spectrum,
    // present only while the spectrum is.
    const chrome = smoothstep(s, 0.22, 0.4) * (1 - smoothstep(s, 0.6, 0.8));
    if (chrome > 0.02) {
      const by = cy + 0.64 * scale;
      ctx.lineWidth = 1;
      ctx.strokeStyle = `rgba(255, 255, 255, ${(0.22 * chrome).toFixed(3)})`;
      ctx.beginPath();
      ctx.moveTo(cx - scale, by);
      ctx.lineTo(cx + scale, by);
      ctx.stroke();
      ctx.strokeStyle = `rgba(255, 255, 255, ${(0.12 * chrome).toFixed(3)})`;
      ctx.beginPath();
      for (let k = 0; k < BINS; k += 1) {
        const tx = cx + (-1 + (2 / BINS) * (k + 0.5)) * scale;
        ctx.moveTo(tx, by);
        ctx.lineTo(tx, by + 5);
      }
      ctx.stroke();
    }

    // Ten stroke calls a frame, whatever the glyph count.
    ctx.lineWidth = 1;
    ctx.lineJoin = "round";
    for (let i = 0; i < paths.length; i += 1) {
      const ambient = i >= SPECTRUM.length;
      const alpha = ambient ? 0.28 : 0.6 + s * 0.16;
      ctx.strokeStyle = `rgba(${SPECTRUM[i % SPECTRUM.length]}, ${alpha})`;
      ctx.stroke(paths[i]);
    }

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (let i = 0; i < letters.length; i += 1) {
      const batch = letters[i];
      if (batch.length === 0) continue;
      const ambient = i >= SPECTRUM.length;
      const alpha = ambient ? 0.36 : 0.68 + s * 0.16;
      ctx.fillStyle = `rgba(${SPECTRUM[i % SPECTRUM.length]}, ${alpha})`;
      for (const letter of batch) {
        ctx.font = `${letter.size.toFixed(1)}px ${LETTER_FONT}`;
        ctx.fillText(letter.char, letter.x, letter.y);
      }
    }

    raf = requestAnimationFrame(tick);
  };

  const onPointer = (e: PointerEvent) => {
    if (!running) return;
    const rect = canvas.getBoundingClientRect();
    targetMx = (e.clientX - rect.left) / Math.max(1, rect.width);
    targetMy = (e.clientY - rect.top) / Math.max(1, rect.height);
  };

  // Run only while the hero is on-screen and the tab is visible.
  let inView = true;
  const syncRunning = () => {
    const shouldRun = inView && !document.hidden;
    if (shouldRun && !running) {
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    } else if (!shouldRun && running) {
      running = false;
      cancelAnimationFrame(raf);
    }
  };

  const io = new IntersectionObserver(
    (entries) => {
      inView = entries[0]?.isIntersecting ?? true;
      syncRunning();
    },
    { rootMargin: "120px" },
  );
  io.observe(canvas);

  resize();
  window.addEventListener("resize", resize);
  window.addEventListener("pointermove", onPointer, { passive: true });
  document.addEventListener("visibilitychange", syncRunning);
  raf = requestAnimationFrame(tick);

  return {
    setProgress: (p: number) => {
      targetProgress = p;
    },
    destroy: () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", syncRunning);
    },
  };
}

/* ==========================================================================
   Three-act scroll choreography, left-aligned in the copy column.
   Act 1  "Sense. Decide. Share."  — typographic statement
   Act 2  JP thesis + proof figures — credibility
   Act 3  CTA + latest signal      — action
   The instrument on the right performs the same three acts.
   ========================================================================== */

function useActStyles(progress: MotionValue<number>) {
  const act1Opacity = useTransform(progress, [0, 0.16, 0.26], [1, 1, 0]);
  const act1Y = useTransform(progress, [0, 0.26], [0, -150]);
  const act1Blur = useTransform(
    progress,
    [0, 0.16, 0.26],
    ["blur(0px)", "blur(0px)", "blur(18px)"],
  );

  const act2Opacity = useTransform(
    progress,
    [0.3, 0.4, 0.56, 0.66],
    [0, 1, 1, 0],
  );
  const act2Y = useTransform(progress, [0.3, 0.4, 0.66], [120, 0, -134]);
  const act2Blur = useTransform(
    progress,
    [0.3, 0.4, 0.56, 0.66],
    ["blur(18px)", "blur(0px)", "blur(0px)", "blur(18px)"],
  );

  const act3Opacity = useTransform(progress, [0.7, 0.82], [0, 1]);
  const act3Y = useTransform(progress, [0.7, 0.84], [120, 0]);
  const act3Blur = useTransform(
    progress,
    [0.7, 0.82],
    ["blur(18px)", "blur(0px)"],
  );

  // captions under the instrument follow the shape, not the copy: they hand
  // over exactly while the particles are in transit
  const cap1Opacity = useTransform(progress, [0, 0.16, 0.3], [1, 1, 0]);
  const cap2Opacity = useTransform(
    progress,
    [0.24, 0.4, 0.58, 0.72],
    [0, 1, 1, 0],
  );
  const cap3Opacity = useTransform(progress, [0.66, 0.84], [0, 1]);

  const cueOpacity = useTransform(progress, [0, 0.06], [1, 0]);

  // Fully faded acts leave the focus / a11y tree.
  const toVisibility = (v: number) => (v < 0.04 ? "hidden" : "visible");
  const act1Visibility = useTransform(act1Opacity, toVisibility);
  const act2Visibility = useTransform(act2Opacity, toVisibility);
  const act3Visibility = useTransform(act3Opacity, toVisibility);

  return {
    act1: {
      opacity: act1Opacity,
      y: act1Y,
      filter: act1Blur,
      visibility: act1Visibility,
    },
    act2: {
      opacity: act2Opacity,
      y: act2Y,
      filter: act2Blur,
      visibility: act2Visibility,
    },
    act3: {
      opacity: act3Opacity,
      y: act3Y,
      filter: act3Blur,
      visibility: act3Visibility,
    },
    captions: [cap1Opacity, cap2Opacity, cap3Opacity],
    cue: { opacity: cueOpacity },
  };
}

const HEADLINE_WORDS = ["Sense.", "Decide.", "Share."] as const;

/* What the instrument is showing in each act. */
const STAGE_CAPTIONS = [
  {
    index: "01",
    en: "Sense",
    ja: "4 チャンネルの生信号 — 振動・音響・画像・CO₂。1 本に外乱が乗る。",
  },
  {
    index: "02",
    en: "Decide",
    ja: "同じ標本をデバイス上でスペクトルへ — FFT → 特徴量 → 判定。",
  },
  {
    index: "03",
    en: "Share",
    ja: "1 つの解析コアを 4 つの配布チャネルへ — 出荷・公開・査読。",
  },
] as const;

const channelCount =
  selectedWorks.find((work) => work.slug === "vibeguard")?.distribution
    ?.length ?? 4;

function HeroNav() {
  return (
    <header className={styles.nav}>
      <a className={styles.brand} href="#top" aria-label="ページ上部へ">
        <i aria-hidden="true" />
        <span>近藤悠太</span>
      </a>
      <nav className={styles.navLinks} aria-label="主要セクション">
        <a href="#works">Works</a>
        <a href="#research">Research</a>
        <a href="#talks">Talks</a>
        <a href="#contact">Contact</a>
      </nav>
      <a
        className={styles.navAction}
        href={heroCopyV2.primaryCta.href}
        target="_blank"
        rel="noreferrer"
      >
        {heroCopyV2.primaryCta.label}
      </a>
    </header>
  );
}

function StaticHero() {
  return (
    <section className={styles.staticHero} aria-label="近藤悠太 Portfolio">
      <HeroNav />
      <div className={styles.staticBody}>
        <p className={styles.eyebrow}>{heroCopyV2.eyebrow}</p>
        <h1 className={styles.headline}>
          {HEADLINE_WORDS.map((word) => (
            <span key={word}>{word}</span>
          ))}
        </h1>
        <p className={styles.thesis}>{heroCopyV2.headlineJa}</p>
        <p className={styles.lead}>{heroCopyV2.subJa}</p>
        <div className={styles.actions}>
          <Link
            className={styles.secondaryAction}
            href={heroCopyV2.secondaryCta.href}
          >
            {heroCopyV2.secondaryCta.label}
          </Link>
        </div>
      </div>
    </section>
  );
}

const subscribeNoop = () => () => {};

export function FrameSequenceHero() {
  const reduceMotion = useReducedMotion();
  // The server always renders SignalHero; the swap to StaticHero must wait
  // for hydration, so "mounted" is read from an external-store snapshot that
  // is false on the server and true on the client.
  const mounted = useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );

  if (mounted && reduceMotion) {
    return <StaticHero />;
  }

  return <SignalHero />;
}

function SignalHero() {
  const stageRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fieldRef = useRef<ConstellationHandle | null>(null);

  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ["start start", "end end"],
  });

  // Light spring on top of Lenis smoothing — text glides, never snaps.
  const springProgress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 26,
    mass: 0.3,
  });

  const acts = useActStyles(springProgress);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Reduced-motion visitors briefly see SignalHero before the swap to
    // StaticHero — never start the particle engine for them.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const field = createConstellation(canvas);
    fieldRef.current = field;
    const unsubscribe = scrollYProgress.on("change", (p) =>
      field.setProgress(p),
    );
    return () => {
      unsubscribe();
      field.destroy();
      fieldRef.current = null;
    };
  }, [scrollYProgress]);

  return (
    <section
      ref={stageRef}
      className={styles.stage}
      aria-label="近藤悠太 Portfolio"
    >
      <div className={styles.viewport}>
        <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />

        <HeroNav />

        {/* Act 1 — Sense. Decide. Share. */}
        <motion.div className={styles.act} style={acts.act1}>
          <motion.p
            className={styles.eyebrow}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easeOut, delay: 0.2 }}
          >
            {heroCopyV2.eyebrow}
          </motion.p>
          <h1 className={styles.headline}>
            {HEADLINE_WORDS.map((word, i) => (
              <motion.span
                key={word}
                initial={{ opacity: 0, y: "1.1em", filter: "blur(20px)" }}
                animate={{ opacity: 1, y: "0em", filter: "blur(0px)" }}
                transition={{
                  duration: 0.92,
                  ease: easeOut,
                  delay: 0.34 + i * 0.14,
                }}
              >
                {word}
              </motion.span>
            ))}
          </h1>
          <motion.p
            className={styles.subline}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: easeOut, delay: 0.9 }}
          >
            {heroCopyV2.headlineJa}
          </motion.p>
        </motion.div>

        {/* Act 2 — thesis + proof figures */}
        <motion.div className={styles.act} style={acts.act2} aria-hidden="true">
          <p className={styles.thesis}>
            振動・音響・画像を、
            <br />
            デバイスの上で判断へ。
          </p>
          <p className={styles.lead}>{heroCopyV2.subJa}</p>
          <div className={styles.figureRow}>
            <div className={styles.figure}>
              <strong>{awardPrizeCount}</strong>
              <span>受賞</span>
            </div>
            <div className={styles.figure}>
              <strong>{talks.length}</strong>
              <span>学会発表</span>
            </div>
            <div className={styles.figure}>
              <strong>{channelCount}</strong>
              <span>配布チャネル</span>
            </div>
            <div className={styles.figure}>
              <strong>100%</strong>
              <span>Local first</span>
            </div>
          </div>
        </motion.div>

        {/* Act 3 — CTA + latest signal */}
        <motion.div
          className={`${styles.act} ${styles.actCta}`}
          style={acts.act3}
        >
          <p className={styles.thesis}>動くものを、届ける。</p>
          <div className={styles.actions}>
            <Link
              className={styles.secondaryAction}
              href={heroCopyV2.secondaryCta.href}
            >
              {heroCopyV2.secondaryCta.label}
            </Link>
            <a className={styles.secondaryAction} href="#talks">
              学会発表を見る
            </a>
          </div>
          <a
            className={styles.latestSignal}
            href={heroCopyV2.latestUpdate.href}
            target="_blank"
            rel="noreferrer"
          >
            <span>Latest Signal — {heroCopyV2.latestUpdate.dateLabel}</span>
            <strong>{heroCopyV2.latestUpdate.title}</strong>
          </a>
        </motion.div>

        {/* What the instrument is showing, per act */}
        <div className={styles.stageCaptions} aria-hidden="true">
          {STAGE_CAPTIONS.map((caption, i) => (
            <motion.div
              key={caption.index}
              className={styles.stageCaption}
              style={{ opacity: acts.captions[i] }}
            >
              <span>
                {caption.index} · {caption.en}
              </span>
              <p>{caption.ja}</p>
            </motion.div>
          ))}
        </div>

        {/* Scroll cue */}
        <motion.div className={styles.cue} style={acts.cue} aria-hidden="true">
          <span>Scroll</span>
          <i />
        </motion.div>
      </div>
    </section>
  );
}
