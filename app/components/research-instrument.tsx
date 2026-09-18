"use client";

import { useEffect, useRef } from "react";
import styles from "./research-instrument.module.css";

/* ==========================================================================
   Research instruments.

   Each research project gets a small live instrument instead of an
   illustration: the same 1px triangle vocabulary as the rest of the site,
   drawing the project's actual mechanism.

     drone    the five-stage supervised pipeline — capture → quality gate →
              classify → evidence → supervisor — with the re-capture loop a
              failed quality gate triggers
     pdm      four raw channels on the left, their spectrum on the right; a
              burst on one channel raises a peak that crosses the threshold
     anomaly  events travelling NEW → CHECKING → RESOLVED, with an attention
              grid over the one being checked
     eltres   a sensor walking a GPS path, leaving CO₂ samples that read
              higher in the urban block

   Everything is procedural and cheap: a canvas runs only while on screen,
   and reduced-motion visitors get one still frame.
   ========================================================================== */

export type InstrumentMode = "drone" | "pdm" | "anomaly" | "eltres";

export function instrumentModeFor(themeClass: string): InstrumentMode {
  switch (themeClass) {
    case "theme-drone":
      return "drone";
    case "theme-pdm":
      return "pdm";
    case "theme-anomaly":
      return "anomaly";
    default:
      return "eltres";
  }
}

const C = {
  violet: "128, 82, 255",
  amber: "255, 184, 41",
  teal: "47, 191, 163",
  magenta: "208, 92, 255",
  blue: "90, 140, 255",
  white: "255, 255, 255",
  ash: "182, 182, 190",
} as const;

const FONT =
  '"Meiryo UI", "MeiryoUI", Meiryo, "Hiragino Kaku Gothic ProN", system-ui, sans-serif';

type Ctx = CanvasRenderingContext2D;

/* deterministic 0..1 noise — the same (a, b) always gives the same value, so
   nothing flickers between frames */
function hash(a: number, b: number) {
  let h = (Math.floor(a) * 374761393 + Math.floor(b) * 668265263) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

function rgba(c: string, a: number) {
  return `rgba(${c}, ${Math.max(0, Math.min(1, a)).toFixed(3)})`;
}

function smooth(t: number) {
  const u = Math.max(0, Math.min(1, t));
  return u * u * (3 - 2 * u);
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/* adds one outlined triangle to the current path; apex at -90° + angle */
function tri(ctx: Ctx, x: number, y: number, size: number, angle: number) {
  for (let i = 0; i < 3; i += 1) {
    const a = (i * Math.PI * 2) / 3 - Math.PI / 2 + angle;
    const vx = x + Math.cos(a) * size;
    const vy = y + Math.sin(a) * size;
    if (i === 0) ctx.moveTo(vx, vy);
    else ctx.lineTo(vx, vy);
  }
  ctx.closePath();
}

function label(
  ctx: Ctx,
  text: string,
  x: number,
  y: number,
  color: string,
  align: CanvasTextAlign = "left",
  size = 10,
) {
  ctx.font = `${size}px ${FONT}`;
  ctx.textAlign = align;
  ctx.textBaseline = "middle";
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
}

/* ---------------------------------------------------------------------- */

function drawDrone(ctx: Ctx, w: number, h: number, t: number) {
  const names = ["撮像", "画質 q", "分類", "証跡", "監督"];
  const y = h * 0.4;
  const xs = names.map((_, i) => w * (0.1 + i * 0.2));

  // pipeline
  ctx.lineWidth = 1;
  ctx.strokeStyle = rgba(C.white, 0.14);
  ctx.beginPath();
  ctx.moveTo(xs[0], y);
  ctx.lineTo(xs[4], y);
  ctx.stroke();

  // re-capture loop, node 1 back to node 0
  const loopY = y + h * 0.3;
  ctx.strokeStyle = rgba(C.blue, 0.24);
  ctx.setLineDash([2, 4]);
  ctx.beginPath();
  ctx.moveTo(xs[1], y + 10);
  ctx.quadraticCurveTo((xs[0] + xs[1]) / 2, loopY, xs[0], y + 10);
  ctx.stroke();
  ctx.setLineDash([]);

  const T = 4.8;
  const cycle = Math.floor(t / T);
  const p = (t - cycle * T) / T;
  const fail = cycle % 3 === 1;
  const q = fail ? 0.3 + hash(cycle, 7) * 0.2 : 0.62 + hash(cycle, 7) * 0.33;
  const tau = 0.55;

  let tx = xs[0];
  let ty = y;
  let active = 0;
  if (!fail) {
    const u = p * 4;
    const i = Math.min(3, Math.floor(u));
    const f = smooth(u - i);
    tx = lerp(xs[i], xs[i + 1], f);
    active = f < 0.5 ? i : i + 1;
  } else if (p < 0.3) {
    const f = smooth(p / 0.3);
    tx = lerp(xs[0], xs[1], f);
    active = f < 0.5 ? 0 : 1;
  } else if (p < 0.75) {
    const f = smooth((p - 0.3) / 0.45);
    const a = 1 - f;
    const cxp = (xs[0] + xs[1]) / 2;
    tx = a * a * xs[1] + 2 * a * f * cxp + f * f * xs[0];
    ty = a * a * (y + 10) + 2 * a * f * loopY + f * f * (y + 10);
    active = 1;
  }

  // nodes: rings of six triangles
  for (let i = 0; i < 5; i += 1) {
    const isActive = i === active;
    ctx.strokeStyle = rgba(isActive ? C.white : C.blue, isActive ? 0.95 : 0.55);
    ctx.beginPath();
    for (let k = 0; k < 6; k += 1) {
      const a = (k * Math.PI * 2) / 6 + t * 0.35 + i;
      tri(ctx, xs[i] + Math.cos(a) * 10, y + Math.sin(a) * 10, 2.4, a);
    }
    ctx.stroke();
    label(
      ctx,
      names[i],
      xs[i],
      y + 27,
      rgba(isActive ? C.white : C.ash, isActive ? 1 : 0.8),
      "center",
    );
  }

  // quality gauge under node 1
  const gx = xs[1] - 22;
  const gy = y + 44;
  ctx.strokeStyle = rgba(C.white, 0.16);
  ctx.beginPath();
  ctx.moveTo(gx, gy);
  ctx.lineTo(gx + 44, gy);
  ctx.stroke();
  ctx.strokeStyle = rgba(q < tau ? C.amber : C.teal, 0.95);
  ctx.beginPath();
  ctx.moveTo(gx, gy);
  ctx.lineTo(gx + 44 * q, gy);
  ctx.stroke();
  ctx.strokeStyle = rgba(C.white, 0.5);
  ctx.beginPath();
  ctx.moveTo(gx + 44 * tau, gy - 3);
  ctx.lineTo(gx + 44 * tau, gy + 3);
  ctx.stroke();
  label(ctx, "q ≥ τ", gx + 50, gy, rgba(C.ash, 0.8), "left", 9);

  // verdicts
  if (!fail && p > 0.88) {
    label(ctx, "受理", xs[4], y - 22, rgba(C.teal, 1), "center");
  }
  if (fail && p > 0.28 && p < 0.8) {
    label(ctx, "再撮像", (xs[0] + xs[1]) / 2, loopY + 12, rgba(C.amber, 1), "center");
  }

  // the frame token
  ctx.fillStyle = rgba(C.white, 0.95);
  ctx.beginPath();
  tri(ctx, tx, ty, 4.5, Math.PI / 2);
  ctx.fill();
  ctx.strokeStyle = rgba(fail && p > 0.3 ? C.amber : C.blue, 0.4);
  ctx.beginPath();
  ctx.arc(tx, ty, 9, 0, Math.PI * 2);
  ctx.stroke();
}

/* ---------------------------------------------------------------------- */

function drawPdm(ctx: Ctx, w: number, h: number, t: number) {
  const l0 = w * 0.05;
  const l1 = w * 0.5;
  const r0 = w * 0.6;
  const r1 = w * 0.95;
  const names = ["acc x", "acc y", "acc z", "mic"];

  // burst on channel 2 every 6 s; the spectrum sees it a beat later
  const phase = t % 6;
  const burst = Math.exp(-Math.pow((phase - 3.1) / 0.45, 2));
  const burstE = Math.exp(-Math.pow((phase - 3.45) / 0.55, 2));

  ctx.lineWidth = 1;
  for (let i = 0; i < 4; i += 1) {
    const yc = h * (0.2 + i * 0.2);
    const A = h * 0.04;
    label(ctx, names[i], l0, yc - h * 0.085, rgba(C.ash, 0.75), "left", 9);
    ctx.strokeStyle = rgba(i === 2 ? C.amber : C.white, i === 2 ? 0.8 : 0.4);
    ctx.beginPath();
    for (let k = 0; k <= 64; k += 1) {
      const x = lerp(l0, l1, k / 64);
      const scroll = k - t * 20;
      const n = hash(scroll, i * 13) - 0.5;
      let v = Math.sin(k * (0.45 + i * 0.08) + t * (1.6 + i * 0.4)) * A + n * A * 0.9;
      if (i === 2) {
        const local = burst * Math.exp(-Math.pow((k - 40) / 9, 2));
        v *= 1 + local * 2.6;
        v += (hash(scroll * 3, 99) - 0.5) * A * 3 * local;
      }
      if (k === 0) ctx.moveTo(x, yc + v);
      else ctx.lineTo(x, yc + v);
    }
    ctx.stroke();
  }

  label(ctx, "FFT →", w * 0.55, h * 0.1, rgba(C.ash, 0.8), "center", 9);

  // spectrum
  const bins = 20;
  const bw = (r1 - r0) / bins;
  const base = h * 0.86;
  const maxH = h * 0.68;
  const peak = (k: number, c: number, wd: number, a: number) =>
    a * Math.exp(-((k - c) * (k - c)) / (2 * wd * wd));

  ctx.strokeStyle = rgba(C.white, 0.16);
  ctx.beginPath();
  ctx.moveTo(r0, base);
  ctx.lineTo(r1, base);
  ctx.stroke();
  // threshold
  const thr = base - maxH * 0.72;
  ctx.strokeStyle = rgba(C.white, 0.22);
  ctx.setLineDash([2, 4]);
  ctx.beginPath();
  ctx.moveTo(r0, thr);
  ctx.lineTo(r1, thr);
  ctx.stroke();
  ctx.setLineDash([]);
  label(ctx, "τ", r1 + 4, thr, rgba(C.ash, 0.8), "left", 9);

  for (let k = 0; k < bins; k += 1) {
    let env =
      0.1 +
      0.28 * Math.exp((-k / bins) * 3.4) +
      peak(k, 3, 1.1, 0.34) +
      peak(k, 11, 1.5, 0.22) +
      (hash(k, Math.floor(t * 8)) - 0.5) * 0.06;
    env += burstE * peak(k, 6, 1.4, 0.72);
    env = Math.max(0.04, Math.min(1, env));
    const x = r0 + bw * (k + 0.5);
    const top = base - env * maxH;
    const hot = top < thr;
    ctx.strokeStyle = rgba(hot ? C.white : C.amber, hot ? 0.95 : 0.7);
    ctx.beginPath();
    for (let yy = base - 4; yy > top; yy -= 6) {
      tri(ctx, x, yy, 2.4, 0);
    }
    ctx.stroke();
  }
  if (burstE > 0.35) {
    label(ctx, "anomaly", r0 + bw * 6.5, thr - 14, rgba(C.amber, burstE), "center", 9);
  }
}

/* ---------------------------------------------------------------------- */

function drawAnomaly(ctx: Ctx, w: number, h: number, t: number) {
  const lanes = [
    { y: h * 0.24, name: "NEW", c: C.magenta },
    { y: h * 0.5, name: "CHECKING", c: C.amber },
    { y: h * 0.76, name: "RESOLVED", c: C.teal },
  ];
  const x0 = w * 0.25;
  const x1 = w * 0.95;

  ctx.lineWidth = 1;
  for (const lane of lanes) {
    ctx.strokeStyle = rgba(C.white, 0.12);
    ctx.beginPath();
    ctx.moveTo(x0, lane.y);
    ctx.lineTo(x1, lane.y);
    ctx.stroke();
    label(ctx, lane.name, w * 0.05, lane.y, rgba(lane.c, 0.95), "left", 9);
  }

  const LOOP = 10;
  const N = 6;
  const life = 8.6;
  for (let i = 0; i < N; i += 1) {
    const birth = i * (LOOP / N);
    const age = (((t - birth) % LOOP) + LOOP) % LOOP;
    if (age > life) continue;
    const x = lerp(x0, x1, age / life);
    const t1 = 2.2 + hash(i, 1) * 1.3;
    const t2 = t1 + 2.0 + hash(i, 2) * 1.5;
    let laneF: number;
    if (age < t1) laneF = 0;
    else if (age < t1 + 0.7) laneF = smooth((age - t1) / 0.7);
    else if (age < t2) laneF = 1;
    else if (age < t2 + 0.7) laneF = 1 + smooth((age - t2) / 0.7);
    else laneF = 2;
    const li = Math.min(1, Math.floor(laneF));
    const y = lerp(lanes[li].y, lanes[Math.min(2, li + 1)].y, laneF - li);
    const lane = lanes[Math.round(laneF)];
    const alpha = Math.min(1, age / 0.4, (life - age) / 1.2);

    // attention grid while being checked
    if (Math.round(laneF) === 1) {
      ctx.strokeStyle = rgba(C.amber, 0.45 * alpha);
      ctx.beginPath();
      for (let gx = -1; gx <= 1; gx += 1) {
        for (let gy = -1; gy <= 1; gy += 1) {
          const on = hash(i * 9 + gx * 3 + gy, Math.floor(age * 3)) > 0.55;
          if (!on) continue;
          ctx.rect(x + gx * 7 - 1.5, y - 22 + gy * 7 - 1.5, 3, 3);
        }
      }
      ctx.stroke();
    }

    // trail
    ctx.strokeStyle = rgba(lane.c, 0.35 * alpha);
    ctx.beginPath();
    for (let k = 1; k <= 3; k += 1) tri(ctx, x - k * 9, y, 2.2 - k * 0.4, Math.PI / 2);
    ctx.stroke();
    // the event
    ctx.fillStyle = rgba(lane.c, 0.95 * alpha);
    ctx.beginPath();
    tri(ctx, x, y, 5, Math.PI / 2);
    ctx.fill();
  }
}

/* ---------------------------------------------------------------------- */

function drawEltres(ctx: Ctx, w: number, h: number, t: number) {
  const ux0 = w * 0.56;
  const uy0 = h * 0.46;
  const ccx = w * 0.78;
  const ccy = h * 0.72;

  // grid; denser in the urban block
  ctx.fillStyle = rgba(C.white, 0.1);
  for (let x = 10; x < w; x += 14) {
    for (let y = 10; y < h; y += 14) {
      const urban = x > ux0 && y > uy0;
      ctx.fillStyle = rgba(C.white, urban ? 0.22 : 0.09);
      ctx.fillRect(x, y, 1, 1);
    }
  }
  label(ctx, "suburban", w * 0.05, h * 0.1, rgba(C.ash, 0.75), "left", 9);
  label(ctx, "urban", ux0 + 6, uy0 - 8, rgba(C.ash, 0.75), "left", 9);

  const path = (tt: number) => ({
    x: w * (0.5 + 0.4 * Math.sin(tt * 0.23) * Math.cos(tt * 0.07 + 1)),
    y: h * (0.5 + 0.36 * Math.sin(tt * 0.17 + 0.8)),
  });
  const co2 = (x: number, y: number, tt: number) => {
    const d = Math.hypot(x - ccx, y - ccy) / (w * 0.42);
    const v = 0.18 + 0.75 * (1 - smooth(d)) + (hash(tt * 3.5, 1) - 0.5) * 0.14;
    return Math.max(0, Math.min(1, v));
  };

  // samples along the path, newest last
  ctx.lineWidth = 1;
  for (let k = 84; k >= 0; k -= 1) {
    const ts = t - k * 0.26;
    const p = path(ts);
    const v = co2(p.x, p.y, ts);
    const age = 1 - k / 85;
    const color = v > 0.55 ? C.amber : v > 0.35 ? C.violet : C.teal;
    ctx.strokeStyle = rgba(color, 0.25 + 0.7 * age);
    ctx.beginPath();
    tri(ctx, p.x, p.y, 2 + 4 * v, ts * 0.6);
    ctx.stroke();
  }

  // the sensor
  const now = path(t);
  const prev = path(t - 0.12);
  const heading = Math.atan2(now.y - prev.y, now.x - prev.x) + Math.PI / 2;
  ctx.fillStyle = rgba(C.white, 0.95);
  ctx.beginPath();
  tri(ctx, now.x, now.y, 5, heading);
  ctx.fill();
  ctx.strokeStyle = rgba(C.teal, 0.4);
  ctx.beginPath();
  ctx.arc(now.x, now.y, 10, 0, Math.PI * 2);
  ctx.stroke();

  // legend
  const ly = h * 0.9;
  label(ctx, "CO₂ × GPS", w * 0.05, ly, rgba(C.ash, 0.8), "left", 9);
  ctx.strokeStyle = rgba(C.teal, 0.9);
  ctx.beginPath();
  tri(ctx, w * 0.3, ly, 3, 0);
  ctx.stroke();
  label(ctx, "low", w * 0.3 + 8, ly, rgba(C.ash, 0.75), "left", 9);
  ctx.strokeStyle = rgba(C.amber, 0.9);
  ctx.beginPath();
  tri(ctx, w * 0.42, ly, 4.5, 0);
  ctx.stroke();
  label(ctx, "high", w * 0.42 + 9, ly, rgba(C.ash, 0.75), "left", 9);
}

const DRAW: Record<InstrumentMode, (ctx: Ctx, w: number, h: number, t: number) => void> = {
  drone: drawDrone,
  pdm: drawPdm,
  anomaly: drawAnomaly,
  eltres: drawEltres,
};

/* ---------------------------------------------------------------------- */

type ResearchInstrumentProps = {
  mode: InstrumentMode;
  className?: string;
};

export function ResearchInstrument({ mode, className }: ResearchInstrumentProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t0 = performance.now();
    // every instance starts at its own point in the loop
    const offset = Math.random() * 40;
    let raf = 0;
    let running = false;
    let inView = false;
    let w = 0;
    let h = 0;

    const frame = () => {
      ctx.clearRect(0, 0, w, h);
      // logical space scales with the host, so a big host gets proportionally
      // bigger marks and labels instead of the same tiny drawing
      const k = Math.max(1, Math.min(2.4, Math.min(w, h) / 230));
      ctx.save();
      ctx.scale(k, k);
      DRAW[mode](ctx, w / k, h / k, (performance.now() - t0) / 1000 + offset);
      ctx.restore();
    };

    const tick = () => {
      if (!running) return;
      frame();
      raf = requestAnimationFrame(tick);
    };

    const sync = () => {
      const should = inView && !document.hidden && !reduce;
      if (should && !running) {
        running = true;
        raf = requestAnimationFrame(tick);
      } else if (!should && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // reduced motion: a single still frame is the whole instrument
      if (reduce) frame();
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(
      (entries) => {
        inView = entries[0]?.isIntersecting ?? false;
        sync();
      },
      { rootMargin: "80px" },
    );
    io.observe(canvas);
    document.addEventListener("visibilitychange", sync);
    resize();

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [mode]);

  return (
    <div className={`${styles.frame} ${className ?? ""}`} aria-hidden="true">
      <canvas ref={ref} className={styles.canvas} />
    </div>
  );
}
