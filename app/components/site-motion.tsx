"use client";

import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";

const easeOutQuart = [0.22, 1, 0.36, 1] as const;

/* ==========================================================================
   Site Constellation Field
   --------------------------------------------------------------------------
   The hero's signature gesture, distributed down the whole document instead
   of being spent once at the top. Constellation clusters are anchored to
   document positions and generated on demand as they come into range, so the
   page never runs out of them however long it is, and only what is on screen
   is ever drawn. A loose scatter drifts over the top for depth.

   The field is not only triangles: letters of the owner's name are seeded
   into it in reading order, so fragments of "KondoYuta" surface out of the
   cloud as you scroll. Letters stay upright while triangles tumble — a
   rotating letter reads as noise, an upright one reads as a signature.

   Clusters travel at 0.68x scroll, so they slide a long way against the
   content as you move — the field reads as a separate, deeper plane rather
   than as wallpaper stuck to the page. They also rotate and breathe on their
   own clock, so the motion never stops when the scroll does.
   ========================================================================== */

const SPECTRUM = [
  "128, 82, 255", // electric iris
  "255, 184, 41", // saffron spark
  "47, 191, 163", // verdant
  "208, 92, 255", // magenta
  "90, 140, 255", // blue
] as const;

const NAME = "KondoYuta";

/* every Nth glyph becomes a letter — sparse enough that the name reads as a
   discovery rather than as a pattern */
const LETTER_EVERY = 9;

const PARALLAX = 0.68;

const LETTER_FONT =
  '"Meiryo UI", "MeiryoUI", Meiryo, "Hiragino Kaku Gothic ProN", system-ui, sans-serif';

/* Deterministic per-cluster RNG: cluster N looks the same on every visit and
   on every re-render, so scrolling back up does not reshuffle the field. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* The same organic silhouette the hero constellation is built from. */
function shapeRadius(theta: number, phase: number) {
  return (
    0.82 +
    0.17 * Math.sin(2 * theta + phase) +
    0.12 * Math.cos(3 * theta + 1.1) +
    0.07 * Math.sin(5 * theta + 0.4)
  );
}

type FieldHandle = { destroy: () => void };

type ClusterGlyph = {
  hx: number;
  hy: number;
  size: number;
  angle: number;
  spin: number;
  phase: number;
  drift: number;
  colorIndex: number;
  /** null = triangle */
  char: string | null;
};

type Cluster = {
  docY: number;
  xFrac: number;
  radius: number;
  tilt: number;
  /** radians per frame — each cluster turns at its own rate and direction */
  tiltRate: number;
  /** phase offset for the breathing pulse, so no two clusters pulse together */
  breathPhase: number;
  glyphs: ClusterGlyph[];
};

type LooseGlyph = {
  x: number;
  y: number;
  size: number;
  angle: number;
  spin: number;
  vx: number;
  vy: number;
  colorIndex: number;
  char: string | null;
};

type LetterDraw = { x: number; y: number; size: number; char: string };

function createConstellationField(canvas: HTMLCanvasElement): FieldHandle {
  const ctx = canvas.getContext("2d");
  if (!ctx) return { destroy: () => {} };

  let raf = 0;
  let running = true;
  let width = 0;
  let height = 0;
  let dpr = 1;
  let spacing = 800;
  let loose: LooseGlyph[] = [];
  const clusters = new Map<number, Cluster>();

  let time = Math.random() * 500;
  let last = performance.now();
  let scrollY = 0;
  let smoothScrollY = 0;

  const buildCluster = (index: number): Cluster => {
    const rand = mulberry32(index * 2654435761 + 12345);
    const isMobile = width <= 768;

    // Alternate sides so the eye is pulled left and right down the page
    // rather than tracking a single column.
    const side = index % 2 === 0 ? 0.76 : 0.24;
    const xFrac = isMobile ? 0.5 : side + (rand() - 0.5) * 0.16;
    const radius =
      Math.min(width, height) * (isMobile ? 0.3 : 0.22 + rand() * 0.12);
    const count = Math.round((isMobile ? 150 : 260) * (0.75 + rand() * 0.5));
    const phase = rand() * Math.PI * 2;

    const glyphs: ClusterGlyph[] = [];
    let letterCursor = index % NAME.length;

    for (let i = 0; i < count; i += 1) {
      // rejection-sample inside the silhouette, skipping the fissure
      let hx = 0.4;
      let hy = 0;
      for (let attempt = 0; attempt < 24; attempt += 1) {
        const theta = rand() * Math.PI * 2;
        const r = Math.sqrt(rand()) * shapeRadius(theta, phase);
        const x = Math.cos(theta) * r;
        const y = Math.sin(theta) * r * 0.86;
        if (Math.abs(x) < 0.045 && y > -0.55) continue;
        hx = x;
        hy = y;
        break;
      }

      const isLetter = i % LETTER_EVERY === 0;
      let char: string | null = null;
      if (isLetter) {
        char = NAME[letterCursor % NAME.length];
        letterCursor += 1;
      }

      glyphs.push({
        hx,
        hy,
        size: isLetter ? 8 + rand() * 7 : 1.5 + rand() * 2.6,
        angle: rand() * Math.PI * 2,
        spin: (rand() - 0.5) * 0.018,
        phase: rand() * Math.PI * 2,
        drift: 0.024 + rand() * 0.06,
        colorIndex: Math.floor(rand() * SPECTRUM.length),
        char,
      });
    }

    return {
      docY: index * spacing,
      xFrac,
      radius,
      tilt: (rand() - 0.5) * 0.5,
      tiltRate: (rand() - 0.5) * 0.0022,
      breathPhase: rand() * Math.PI * 2,
      glyphs,
    };
  };

  const seedLoose = (g: LooseGlyph, anywhere: boolean, index: number) => {
    // roughly one in five of the drifting glyphs is a letter
    const isLetter = index % 5 === 0;
    g.x = Math.random() * width;
    g.y = anywhere ? Math.random() * height : height + 20;
    g.size = isLetter ? 11 + Math.random() * 9 : 2.5 + Math.random() * 4;
    g.angle = Math.random() * Math.PI * 2;
    g.spin = (Math.random() - 0.5) * 0.014;
    g.vx = (Math.random() - 0.5) * 0.5;
    g.vy = -(0.18 + Math.random() * 0.45);
    g.colorIndex = Math.floor(Math.random() * SPECTRUM.length);
    g.char = isLetter
      ? NAME[Math.floor(Math.random() * NAME.length)]
      : null;
  };

  const resize = () => {
    const isMobile = window.innerWidth <= 768;
    const nextDpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);
    const nextW = canvas.clientWidth;
    const nextH = canvas.clientHeight;
    if (
      nextDpr === dpr &&
      nextW === width &&
      nextH === height &&
      loose.length > 0
    ) {
      return;
    }

    dpr = nextDpr;
    width = nextW;
    height = nextH;
    canvas.width = Math.max(1, Math.round(width * dpr));
    canvas.height = Math.max(1, Math.round(height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Cluster geometry is sized off the viewport, so a resize invalidates it.
    spacing = Math.max(620, height * 0.92);
    clusters.clear();

    const looseCount = Math.min(110, Math.round((width * height) / 16000));
    loose = Array.from({ length: looseCount }, (_, index) => {
      const g = {} as LooseGlyph;
      seedLoose(g, true, index);
      return g;
    });
  };

  const addTriangle = (
    path: Path2D,
    x: number,
    y: number,
    size: number,
    cos: number,
    sin: number,
  ) => {
    for (let i = 0; i < 3; i += 1) {
      const a = (i * Math.PI * 2) / 3 - Math.PI / 2;
      const px = Math.cos(a) * size;
      const py = Math.sin(a) * size;
      const vx = x + px * cos - py * sin;
      const vy = y + px * sin + py * cos;
      if (i === 0) path.moveTo(vx, vy);
      else path.lineTo(vx, vy);
    }
    path.closePath();
  };

  const tick = (now: number) => {
    if (!running) return;
    const dt = Math.min(2.6, (now - last) / 16.667);
    last = now;
    time += dt * 0.016;

    // Chase the scroll position so cluster travel stays smooth even when the
    // scroll input itself is coarse.
    smoothScrollY += (scrollY - smoothScrollY) * (1 - Math.pow(0.82, dt));

    ctx.clearRect(0, 0, width, height);

    // batch 0..4 = cluster triangles, 5..9 = loose triangles (dimmer)
    const paths = Array.from(
      { length: SPECTRUM.length * 2 },
      () => new Path2D(),
    );
    // Letters cannot go in a Path2D, so they are collected per colour and
    // drawn in one pass with a single fillStyle change each.
    const letters: LetterDraw[][] = Array.from(
      { length: SPECTRUM.length * 2 },
      () => [],
    );

    // Only the clusters whose parallax-shifted position lands on screen.
    const anchor = smoothScrollY * PARALLAX;
    const margin = height * 0.6;
    const first = Math.max(0, Math.floor((anchor - margin) / spacing));
    const lastIndex = Math.floor((anchor + height + margin) / spacing);

    for (let index = first; index <= lastIndex; index += 1) {
      let cluster = clusters.get(index);
      if (!cluster) {
        cluster = buildCluster(index);
        clusters.set(index, cluster);
      }

      cluster.tilt += cluster.tiltRate * dt;

      const cx = width * cluster.xFrac;
      const cy = cluster.docY - anchor;
      const cos = Math.cos(cluster.tilt);
      const sin = Math.sin(cluster.tilt);
      // slow expansion and contraction, ±14% of the cluster radius
      const radius =
        cluster.radius * (1 + Math.sin(time * 0.45 + cluster.breathPhase) * 0.14);

      for (const g of cluster.glyphs) {
        g.angle += g.spin * dt;

        const wobbleX = Math.sin(time * 1.05 + g.phase) * g.drift;
        const wobbleY = Math.cos(time * 0.92 + g.phase * 1.4) * g.drift;
        const ux = g.hx + wobbleX;
        const uy = g.hy + wobbleY;

        const x = cx + (ux * cos - uy * sin) * radius;
        const y = cy + (ux * sin + uy * cos) * radius;
        if (x < -30 || x > width + 30 || y < -30 || y > height + 30) continue;

        if (g.char) {
          letters[g.colorIndex].push({ x, y, size: g.size, char: g.char });
        } else {
          addTriangle(
            paths[g.colorIndex],
            x,
            y,
            g.size,
            Math.cos(g.angle),
            Math.sin(g.angle),
          );
        }
      }
    }

    // Drop clusters that have fallen well out of range so the cache cannot
    // grow without bound on a long page.
    if (clusters.size > 24) {
      for (const index of clusters.keys()) {
        if (index < first - 4 || index > lastIndex + 4) clusters.delete(index);
      }
    }

    for (const g of loose) {
      g.x += g.vx * dt;
      g.y += g.vy * dt;
      g.angle += g.spin * dt;

      if (g.y < -30 || g.x < -30 || g.x > width + 30) {
        seedLoose(g, false, g.char ? 0 : 1);
        continue;
      }

      if (g.char) {
        letters[g.colorIndex + SPECTRUM.length].push({
          x: g.x,
          y: g.y,
          size: g.size,
          char: g.char,
        });
      } else {
        addTriangle(
          paths[g.colorIndex + SPECTRUM.length],
          g.x,
          g.y,
          g.size,
          Math.cos(g.angle),
          Math.sin(g.angle),
        );
      }
    }

    ctx.lineWidth = 1;
    ctx.lineJoin = "round";
    for (let i = 0; i < paths.length; i += 1) {
      const isLoose = i >= SPECTRUM.length;
      ctx.strokeStyle = `rgba(${SPECTRUM[i % SPECTRUM.length]}, ${
        isLoose ? 0.26 : 0.4
      })`;
      ctx.stroke(paths[i]);
    }

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (let i = 0; i < letters.length; i += 1) {
      const batch = letters[i];
      if (batch.length === 0) continue;
      const isLoose = i >= SPECTRUM.length;
      // letters carry a touch more weight than the triangles so the name is
      // legible, but still sit under the body copy they pass behind
      ctx.fillStyle = `rgba(${SPECTRUM[i % SPECTRUM.length]}, ${
        isLoose ? 0.3 : 0.46
      })`;
      for (const letter of batch) {
        ctx.font = `${letter.size.toFixed(1)}px ${LETTER_FONT}`;
        ctx.fillText(letter.char, letter.x, letter.y);
      }
    }

    raf = requestAnimationFrame(tick);
  };

  const onScroll = () => {
    scrollY = window.scrollY;
  };

  const syncRunning = () => {
    const shouldRun = !document.hidden;
    if (shouldRun && !running) {
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    } else if (!shouldRun && running) {
      running = false;
      cancelAnimationFrame(raf);
    }
  };

  resize();
  scrollY = window.scrollY;
  smoothScrollY = scrollY;
  window.addEventListener("resize", resize);
  window.addEventListener("scroll", onScroll, { passive: true });
  document.addEventListener("visibilitychange", syncRunning);
  raf = requestAnimationFrame(tick);

  return {
    destroy: () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", syncRunning);
    },
  };
}

export function SiteMotionChrome() {
  const reduceMotion = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { scrollYProgress } = useScroll();
  const progressScale = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 28,
    mass: 0.24,
  });

  useEffect(() => {
    if (reduceMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const field = createConstellationField(canvas);
    return () => field.destroy();
  }, [reduceMotion]);

  return (
    <>
      <motion.div
        className="site-scroll-progress"
        style={{ scaleX: progressScale }}
      />
      <canvas
        ref={canvasRef}
        className="site-ambient-field"
        aria-hidden="true"
      />
    </>
  );
}

export function RouteTemplateMotion({
  children,
  detail = false,
}: {
  children: ReactNode;
  detail?: boolean;
}) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      key={pathname}
      className={`route-template ${detail ? "route-template-detail" : ""}`}
      initial={
        reduceMotion
          ? { opacity: 0 }
          : { opacity: 0, y: detail ? 44 : 28, filter: "blur(14px)" }
      }
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: detail ? 0.82 : 0.72, ease: easeOutQuart }}
    >
      {children}
    </motion.div>
  );
}
