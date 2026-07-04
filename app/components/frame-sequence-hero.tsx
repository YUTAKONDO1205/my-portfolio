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
   Signal Field — procedural flow-field particle canvas.

   Replaces the old 192-frame JPEG scrub (blurry, watermarked, quantized to
   frame steps). Everything here is drawn at device resolution every RAF
   tick, and every externally-driven value (scroll progress, pointer) is
   lerped inside the loop, so motion stays butter-smooth no matter how
   choppy the scroll input is.
   ========================================================================== */

type SignalFieldHandle = {
  setProgress: (p: number) => void;
  destroy: () => void;
};

function createSignalField(canvas: HTMLCanvasElement): SignalFieldHandle {
  const ctx = canvas.getContext("2d", { alpha: false });
  if (!ctx) return { setProgress: () => {}, destroy: () => {} };

  const NIGHT = { r: 11, g: 16, b: 28 };
  // Luminous palette: mostly steel-cyan streams with sparse gold signals.
  const PALETTE = [
    { r: 127, g: 212, b: 255, w: 0.42 }, // signal cyan
    { r: 96, g: 150, b: 224, w: 0.3 }, // steel blue
    { r: 70, g: 110, b: 190, w: 0.14 }, // deep indigo
    { r: 255, g: 210, b: 122, w: 0.14 }, // signal gold
  ];

  type Particle = {
    x: number;
    y: number;
    px: number;
    py: number;
    speed: number;
    life: number;
    maxLife: number;
    color: (typeof PALETTE)[number];
    width: number;
  };

  let raf = 0;
  let running = true;
  let width = 0;
  let height = 0;
  let dpr = 1;
  let particles: Particle[] = [];

  // Lerped inputs — targets are set from outside, drawn values chase them.
  let targetProgress = 0;
  let progress = 0;
  let targetMx = 0.5;
  let targetMy = 0.42;
  let mx = 0.5;
  let my = 0.42;

  let time = Math.random() * 400;
  let last = performance.now();

  const pickColor = () => {
    let r = Math.random();
    for (const c of PALETTE) {
      if (r < c.w) return c;
      r -= c.w;
    }
    return PALETTE[0];
  };

  const spawn = (p: Particle, anywhere: boolean) => {
    p.x = Math.random() * width;
    p.y = anywhere
      ? Math.random() * height
      : height * (0.12 + Math.random() * 0.76);
    p.px = p.x;
    p.py = p.y;
    p.speed = 0.55 + Math.random() * 0.9;
    p.maxLife = 160 + Math.random() * 240;
    p.life = anywhere ? Math.random() * p.maxLife : 0;
    p.color = pickColor();
    p.width = 0.6 + Math.random() * 1.1;
  };

  const resize = () => {
    const isMobile = window.innerWidth <= 768;
    const newDpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);
    const newW = canvas.clientWidth;
    const newH = canvas.clientHeight;
    // Mobile URL-bar collapse fires window resize without changing the 100svh
    // canvas box — bail out so trails and particle positions survive.
    if (
      newDpr === dpr &&
      newW === width &&
      newH === height &&
      particles.length > 0
    ) {
      return;
    }

    const oldW = width;
    const oldH = height;
    dpr = newDpr;
    width = newW;
    height = newH;
    canvas.width = Math.max(1, Math.round(width * dpr));
    canvas.height = Math.max(1, Math.round(height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = `rgb(${NIGHT.r}, ${NIGHT.g}, ${NIGHT.b})`;
    ctx.fillRect(0, 0, width, height);

    const count = Math.min(760, Math.round((width * height) / 2400));
    if (particles.length > 0 && oldW > 0 && oldH > 0) {
      // Real size change: rescale the living field instead of re-seeding it.
      for (const p of particles) {
        p.x *= width / oldW;
        p.y *= height / oldH;
        p.px = p.x;
        p.py = p.y;
      }
      while (particles.length < count) {
        const p = {} as Particle;
        spawn(p, true);
        particles.push(p);
      }
      particles.length = Math.min(particles.length, count);
    } else {
      particles = Array.from({ length: count }, () => {
        const p = {} as Particle;
        spawn(p, true);
        return p;
      });
    }
  };

  // Flow field: three overlapping sine layers give a cheap curl-like swirl;
  // `structure` (scroll-driven, 0 → 1) morphs it from a free swirling field
  // ("sense") through a horizontal convergence ("decide") into a forward
  // radiating fan ("share").
  const fieldAngle = (x: number, y: number, s: number) => {
    const nx = x / width;
    const ny = y / height;

    const swirl =
      Math.sin(ny * 4.4 + time * 0.32) * 1.25 +
      Math.cos(nx * 3.6 - time * 0.24) * 1.1 +
      Math.sin((nx + ny) * 2.3 + time * 0.18) * 0.7;

    // Pointer bends the field around a damped attractor.
    const dx = nx - mx;
    const dy = ny - my;
    const dist2 = dx * dx + dy * dy;
    const bend = Math.exp(-dist2 * 14) * 1.6;
    const bendAngle = Math.atan2(dy, dx) + Math.PI / 2;

    if (s < 0.5) {
      // sense → decide: swirl flattens into a rightward stream that
      // converges on the vertical center.
      const k = s * 2;
      const converge = Math.atan2((0.5 - ny) * 1.4, 1.6);
      const base = swirl * (1 - k * 0.82) + converge * k;
      return base + bend * Math.sin(bendAngle) * (1 - k * 0.5);
    }
    // decide → share: the stream fans out from the left-center point.
    const k = (s - 0.5) * 2;
    const fan = Math.atan2(ny - 0.5, nx - 0.08);
    const converge = Math.atan2((0.5 - ny) * 1.4, 1.6);
    const base = converge * (1 - k) + fan * k + swirl * 0.16 * (1 - k);
    return base + bend * Math.sin(bendAngle) * 0.4;
  };

  const tick = (now: number) => {
    if (!running) return;
    const dt = Math.min(2.4, (now - last) / 16.667);
    last = now;
    time += dt * 0.016;

    // Chase the externally-set targets — this is the ヌメヌメ core.
    progress += (targetProgress - progress) * (1 - Math.pow(0.94, dt));
    mx += (targetMx - mx) * (1 - Math.pow(0.92, dt));
    my += (targetMy - my) * (1 - Math.pow(0.92, dt));

    // Translucent night wash = persistent trails / built-in motion blur.
    // dt-scaled so trail length reads the same at 30 / 60 / 120Hz.
    const washAlpha = 1 - Math.pow(1 - 0.085, dt);
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = `rgba(${NIGHT.r}, ${NIGHT.g}, ${NIGHT.b}, ${washAlpha})`;
    ctx.fillRect(0, 0, width, height);

    ctx.globalCompositeOperation = "lighter";
    ctx.lineCap = "round";

    const s = Math.max(0, Math.min(1, progress));
    const speedBoost = 1 + s * 0.9;

    for (const p of particles) {
      const a = fieldAngle(p.x, p.y, s);
      const v = p.speed * speedBoost * dt;
      p.px = p.x;
      p.py = p.y;
      p.x += Math.cos(a) * v * 2.1;
      p.y += Math.sin(a) * v * 2.1;
      p.life += dt;

      const edge =
        p.x < -12 || p.x > width + 12 || p.y < -12 || p.y > height + 12;
      if (edge || p.life > p.maxLife) {
        spawn(p, false);
        continue;
      }

      // Fade in / out across the particle's life for soft continuity.
      const lifeT = p.life / p.maxLife;
      const fade =
        lifeT < 0.12 ? lifeT / 0.12 : lifeT > 0.78 ? (1 - lifeT) / 0.22 : 1;
      const alpha = 0.28 * fade;

      ctx.strokeStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${alpha})`;
      ctx.lineWidth = p.width;
      ctx.beginPath();
      ctx.moveTo(p.px, p.py);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
    }

    raf = requestAnimationFrame(tick);
  };

  const onPointer = (e: PointerEvent) => {
    if (!running) return;
    const rect = canvas.getBoundingClientRect();
    targetMx = (e.clientX - rect.left) / Math.max(1, rect.width);
    targetMy = (e.clientY - rect.top) / Math.max(1, rect.height);
  };

  // Run only while the hero is both on-screen and the tab is visible —
  // otherwise the loop would burn CPU for the whole session after the
  // visitor scrolls past the 300vh stage.
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

  const onVisibility = () => syncRunning();

  resize();
  window.addEventListener("resize", resize);
  window.addEventListener("pointermove", onPointer, { passive: true });
  document.addEventListener("visibilitychange", onVisibility);
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
      document.removeEventListener("visibilitychange", onVisibility);
    },
  };
}

/* ==========================================================================
   Three-act scroll choreography (restored grammar from the old hero):
   Act 1  "Sense. Decide. Share."  — typographic statement
   Act 2  JP thesis + proof tiles  — credibility
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
        <span>近藤悠太</span>
        <span>Yuta Kondo</span>
      </a>
      <nav className={styles.navLinks} aria-label="主要セクション">
        <a href="#works">Works</a>
        <a href="#research">Research</a>
        <a href="#contact">Contact</a>
      </nav>
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
          <a
            className={styles.primaryAction}
            href={heroCopyV2.primaryCta.href}
            target="_blank"
            rel="noreferrer"
          >
            {heroCopyV2.primaryCta.label}
          </a>
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
  const fieldRef = useRef<SignalFieldHandle | null>(null);

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
    const field = createSignalField(canvas);
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
        <div className={styles.vignette} aria-hidden="true" />

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

        {/* Act 2 — thesis + proof tiles */}
        <motion.div className={styles.act} style={acts.act2} aria-hidden="true">
          <p className={styles.thesis}>
            振動・音響・画像を、
            <br />
            デバイスの上で判断に変える。
          </p>
          <p className={styles.lead}>{heroCopyV2.subJa}</p>
          <div className={styles.tileRow}>
            <div className={styles.tile}>
              <strong>{awardPrizeCount}</strong>
              <span>受賞</span>
            </div>
            <div className={styles.tile}>
              <strong>4</strong>
              <span>配布チャネル</span>
            </div>
            <div className={styles.tile}>
              <strong>100%</strong>
              <span>Local first</span>
            </div>
          </div>
        </motion.div>

        {/* Act 3 — CTA + latest signal */}
        <motion.div className={`${styles.act} ${styles.actCta}`} style={acts.act3}>
          <p className={styles.thesis}>動くものを、届ける。</p>
          <div className={styles.actions}>
            <a
              className={styles.primaryAction}
              href={heroCopyV2.primaryCta.href}
              target="_blank"
              rel="noreferrer"
            >
              {heroCopyV2.primaryCta.label}
            </a>
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
