"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { awardPrizeCount, heroCopyV2 } from "../portfolio-data";
import styles from "./frame-sequence-hero.module.css";

const easeOut = [0.22, 1, 0.36, 1] as const;

/* ==========================================================================
   Constellation — the signature brand visual.

   Thousands of tiny outlined triangles in the full brand spectrum, gathered
   into an organic two-lobed cloud: knowledge as distributed intelligence
   rather than hierarchical data. Ambient glyphs scatter through the space
   around it. Scroll progress breathes the cloud open and closed.

   Everything is stroked at 1px on pure black; triangles are batched into a
   Path2D per colour and depth tier, so ~1400 glyphs cost ten stroke calls
   a frame.
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

/* The owner's name seeded through the cloud in reading order, so fragments of
   it surface out of the constellation. Letters stay upright while triangles
   tumble — a rotating letter reads as noise, an upright one as a signature. */
const NAME = "KondoYuta";
const LETTER_EVERY = 11;

const LETTER_FONT =
  '"Meiryo UI", "MeiryoUI", Meiryo, "Hiragino Kaku Gothic ProN", system-ui, sans-serif';

/* Must match --color-void; the canvas is opaque, so it paints the ground. */
const GROUND = "#111114";

/* Organic silhouette in unit space: a radial harmonic sum gives the lobed,
   slightly asymmetric outline; the fissure below carves the two hemispheres. */
function shapeRadius(theta: number) {
  return (
    0.82 +
    0.17 * Math.sin(2 * theta) +
    0.12 * Math.cos(3 * theta + 1.1) +
    0.07 * Math.sin(5 * theta + 0.4)
  );
}

function createConstellation(canvas: HTMLCanvasElement): ConstellationHandle {
  const ctx = canvas.getContext("2d", { alpha: false });
  if (!ctx) return { setProgress: () => {}, destroy: () => {} };

  type Glyph = {
    /** home position in unit space, relative to the cloud centre */
    hx: number;
    hy: number;
    size: number;
    angle: number;
    spin: number;
    /** independent drift phase so no two glyphs breathe together */
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

  const seedInShape = (g: Glyph) => {
    // rejection-sample inside the harmonic outline, skipping the fissure
    for (let attempt = 0; attempt < 24; attempt += 1) {
      const theta = Math.random() * Math.PI * 2;
      // sqrt keeps the fill even instead of clumping at the centre
      const r = Math.sqrt(Math.random()) * shapeRadius(theta);
      const x = Math.cos(theta) * r;
      const y = Math.sin(theta) * r * 0.86;
      if (Math.abs(x) < 0.045 && y > -0.55) continue;
      g.hx = x;
      g.hy = y;
      return;
    }
    g.hx = 0.4;
    g.hy = 0;
  };

  const seedAmbient = (g: Glyph) => {
    const theta = Math.random() * Math.PI * 2;
    const r = 1.25 + Math.random() * 1.5;
    g.hx = Math.cos(theta) * r;
    g.hy = Math.sin(theta) * r * 0.72;
  };

  const build = () => {
    const isMobile = width <= 768;
    const count = Math.min(
      isMobile ? 620 : 1500,
      Math.round((width * height) / (isMobile ? 900 : 620)),
    );

    let letterCursor = 0;

    glyphs = Array.from({ length: count }, (_, i) => {
      const ambient = i % 5 === 0;
      const isLetter = i % LETTER_EVERY === 3;
      let char: string | null = null;
      if (isLetter) {
        char = NAME[letterCursor % NAME.length];
        letterCursor += 1;
      }

      const g: Glyph = {
        hx: 0,
        hy: 0,
        size: isLetter
          ? (ambient ? 11 : 9) + Math.random() * 7
          : ambient
            ? 2 + Math.random() * 3
            : 1.6 + Math.random() * 2.8,
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.006,
        phase: Math.random() * Math.PI * 2,
        drift: 0.006 + Math.random() * 0.02,
        colorIndex: Math.floor(Math.random() * SPECTRUM.length),
        ambient,
        char,
      };
      if (ambient) seedAmbient(g);
      else seedInShape(g);
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

    ctx.fillStyle = GROUND;
    ctx.fillRect(0, 0, width, height);

    const s = Math.max(0, Math.min(1, progress));
    const isMobile = width <= 768;

    // Two-column composition: the cloud sits in the right half on desktop,
    // centred once the copy stacks beneath it.
    const cx = width * (isMobile ? 0.5 : 0.67);
    const cy = height * (isMobile ? 0.42 : 0.5);
    const scale = Math.min(width, height) * (isMobile ? 0.4 : 0.42);

    // Act 1 gathered → Act 2 opened out → Act 3 re-gathered, tighter.
    const spread = 1 + Math.sin(s * Math.PI) * 0.34 + s * 0.12;
    const swirl = s * 0.5;
    const cosS = Math.cos(swirl);
    const sinS = Math.sin(swirl);

    // Two batches per colour — dense cloud and dim ambient scatter — so the
    // depth separation survives the Path2D batching.
    paths = Array.from({ length: SPECTRUM.length * 2 }, () => new Path2D());
    // Letters cannot go into a Path2D, so they are collected per colour and
    // drawn in a second pass with one fillStyle change each.
    const letters: LetterDraw[][] = Array.from(
      { length: SPECTRUM.length * 2 },
      () => [],
    );

    for (const g of glyphs) {
      g.angle += g.spin * dt;

      // per-glyph wander keeps the cloud alive when the page is still
      const wobbleX = Math.sin(time * 0.6 + g.phase) * g.drift;
      const wobbleY = Math.cos(time * 0.52 + g.phase * 1.4) * g.drift;

      let ux = (g.hx + wobbleX) * spread;
      let uy = (g.hy + wobbleY) * spread;
      const rx = ux * cosS - uy * sinS;
      const ry = ux * sinS + uy * cosS;
      ux = rx;
      uy = ry;

      let x = cx + ux * scale;
      let y = cy + uy * scale;

      // Pointer pushes the field gently aside — a damped repulsion.
      const pdx = x - mx * width;
      const pdy = y - my * height;
      const pd2 = pdx * pdx + pdy * pdy;
      const radius = Math.min(width, height) * 0.22;
      if (pd2 < radius * radius) {
        const pd = Math.sqrt(pd2) || 1;
        const push = (1 - pd / radius) * 26;
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

    // Ten stroke calls a frame, whatever the glyph count.
    ctx.lineWidth = 1;
    ctx.lineJoin = "round";
    for (let i = 0; i < paths.length; i += 1) {
      const ambient = i >= SPECTRUM.length;
      const alpha = ambient ? 0.2 : 0.46 + s * 0.14;
      ctx.strokeStyle = `rgba(${SPECTRUM[i % SPECTRUM.length]}, ${alpha})`;
      ctx.stroke(paths[i]);
    }

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (let i = 0; i < letters.length; i += 1) {
      const batch = letters[i];
      if (batch.length === 0) continue;
      const ambient = i >= SPECTRUM.length;
      const alpha = ambient ? 0.28 : 0.54 + s * 0.14;
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
   ========================================================================== */

function useActStyles(progress: MotionValue<number>) {
  const act1Opacity = useTransform(progress, [0, 0.16, 0.26], [1, 1, 0]);
  const act1Y = useTransform(progress, [0, 0.26], [0, -72]);
  const act1Blur = useTransform(
    progress,
    [0, 0.16, 0.26],
    ["blur(0px)", "blur(0px)", "blur(10px)"],
  );

  const act2Opacity = useTransform(
    progress,
    [0.3, 0.4, 0.56, 0.66],
    [0, 1, 1, 0],
  );
  const act2Y = useTransform(progress, [0.3, 0.4, 0.66], [56, 0, -64]);
  const act2Blur = useTransform(
    progress,
    [0.3, 0.4, 0.56, 0.66],
    ["blur(10px)", "blur(0px)", "blur(0px)", "blur(10px)"],
  );

  const act3Opacity = useTransform(progress, [0.7, 0.82], [0, 1]);
  const act3Y = useTransform(progress, [0.7, 0.84], [56, 0]);
  const act3Blur = useTransform(
    progress,
    [0.7, 0.82],
    ["blur(10px)", "blur(0px)"],
  );

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
    cue: { opacity: cueOpacity },
  };
}

const HEADLINE_WORDS = ["Sense.", "Decide.", "Share."] as const;

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
        <p className={styles.thesis}>現場の信号を、使える判断へ。</p>
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

export function FrameSequenceHero() {
  const reduceMotion = useReducedMotion();
  // The server always renders SignalHero; swapping to StaticHero before
  // hydration completes would mismatch, so gate the swap on mount.
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
                initial={{ opacity: 0, y: "0.6em", filter: "blur(12px)" }}
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
            現場の信号を、使える判断へ。
          </motion.p>
        </motion.div>

        {/* Act 2 — thesis + proof figures */}
        <motion.div className={styles.act} style={acts.act2} aria-hidden="true">
          <p className={styles.thesis}>
            振動・音響・画像を、
            <br />
            デバイスの上で判断に変える。
          </p>
          <p className={styles.lead}>{heroCopyV2.subJa}</p>
          <div className={styles.figureRow}>
            <div className={styles.figure}>
              <strong>{awardPrizeCount}</strong>
              <span>受賞</span>
            </div>
            <div className={styles.figure}>
              <strong>4</strong>
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

        {/* Scroll cue */}
        <motion.div className={styles.cue} style={acts.cue} aria-hidden="true">
          <span>Scroll</span>
          <i />
        </motion.div>
      </div>
    </section>
  );
}
