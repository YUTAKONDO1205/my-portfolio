"use client";

import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";

const easeOutQuart = [0.22, 1, 0.36, 1] as const;

/* ==========================================================================
   Ambient Particle Field
   --------------------------------------------------------------------------
   Sparse outlined triangles drifting at low opacity across the page
   background, outside the hero constellation. Same glyph vocabulary, lower
   density — it is what keeps every section reading as one continuous field
   rather than a stack of separate surfaces.
   ========================================================================== */

const SPECTRUM = [
  "128, 82, 255", // electric iris
  "255, 184, 41", // saffron spark
  "47, 191, 163", // verdant
  "208, 92, 255", // magenta
  "90, 140, 255", // blue
] as const;

type AmbientHandle = { destroy: () => void };

function createAmbientField(canvas: HTMLCanvasElement): AmbientHandle {
  const ctx = canvas.getContext("2d");
  if (!ctx) return { destroy: () => {} };

  type Glyph = {
    x: number;
    y: number;
    size: number;
    angle: number;
    spin: number;
    vx: number;
    vy: number;
    alpha: number;
    color: string;
  };

  let raf = 0;
  let running = true;
  let width = 0;
  let height = 0;
  let dpr = 1;
  const glyphs: Glyph[] = [];
  let last = performance.now();

  const seed = (g: Glyph, anywhere: boolean) => {
    g.x = Math.random() * width;
    g.y = anywhere ? Math.random() * height : height + 20;
    g.size = 2.5 + Math.random() * 4;
    g.angle = Math.random() * Math.PI * 2;
    g.spin = (Math.random() - 0.5) * 0.004;
    g.vx = (Math.random() - 0.5) * 0.12;
    g.vy = -(0.05 + Math.random() * 0.14);
    g.alpha = 0.1 + Math.random() * 0.16;
    g.color = SPECTRUM[Math.floor(Math.random() * SPECTRUM.length)];
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

    const count = Math.min(150, Math.round((width * height) / 13000));
    if (glyphs.length > count) {
      glyphs.length = count;
    } else {
      while (glyphs.length < count) {
        const g = {} as Glyph;
        seed(g, true);
        glyphs.push(g);
      }
    }
  };

  const tick = (now: number) => {
    if (!running) return;
    const dt = Math.min(3, (now - last) / 16.667);
    last = now;

    ctx.clearRect(0, 0, width, height);
    ctx.lineWidth = 1;
    ctx.lineJoin = "round";

    for (const g of glyphs) {
      g.x += g.vx * dt;
      g.y += g.vy * dt;
      g.angle += g.spin * dt;

      if (g.y < -20 || g.x < -20 || g.x > width + 20) {
        seed(g, false);
        continue;
      }

      const cos = Math.cos(g.angle);
      const sin = Math.sin(g.angle);
      ctx.strokeStyle = `rgba(${g.color}, ${g.alpha})`;
      ctx.beginPath();
      for (let i = 0; i < 3; i += 1) {
        // equilateral triangle, vertices at 120° steps
        const a = (i * Math.PI * 2) / 3 - Math.PI / 2;
        const px = Math.cos(a) * g.size;
        const py = Math.sin(a) * g.size;
        const x = g.x + px * cos - py * sin;
        const y = g.y + px * sin + py * cos;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    }

    raf = requestAnimationFrame(tick);
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
  window.addEventListener("resize", resize);
  document.addEventListener("visibilitychange", syncRunning);
  raf = requestAnimationFrame(tick);

  return {
    destroy: () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
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
    const field = createAmbientField(canvas);
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
