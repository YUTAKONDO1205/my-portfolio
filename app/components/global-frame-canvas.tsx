"use client";

import { useEffect, useRef, useState } from "react";

const FRAME_COUNT = 192;
const FRAME_PATH = (i: number) =>
  `/frames/frame_${String(i).padStart(4, "0")}.jpg`;

export function GlobalFrameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const tickingRef = useRef(false);
  const lastIndexRef = useRef(-1);

  const [loaded, setLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

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
    if (!canvas) return;
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
      // Slight zoom crops the source watermark out of view
      const zoom = window.innerWidth <= 768 ? 1.34 : 1.12;
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
      // Map scroll progress to frames across the entire document height so the
      // cinematic background keeps advancing all the way to the page footer,
      // not just within the hero viewport.
      const scrollable = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight,
      );
      const progress = Math.min(
        1,
        Math.max(0, window.scrollY / scrollable),
      );
      const frameIndex = Math.min(
        FRAME_COUNT - 1,
        Math.max(0, Math.floor(progress * FRAME_COUNT)),
      );
      if (frameIndex !== lastIndexRef.current) {
        lastIndexRef.current = frameIndex;
        drawFrame(frameIndex);
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
      lastIndexRef.current = -1; // force redraw on resize
      update();
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
    <>
      <div
        className={`gfc-stage ${loaded ? "is-ready" : ""}`}
        aria-hidden="true"
      >
        <canvas ref={canvasRef} className="gfc-canvas" />
        <div className="gfc-vignette" />
        <div className="gfc-corner-mask" />
        <div className="gfc-scrim" />
        <div className="gfc-grain" />
      </div>

      <div
        className={`gfc-loader ${loaded ? "is-done" : ""}`}
        role="status"
        aria-live="polite"
        aria-hidden={loaded}
      >
        <div className="gfc-loader-inner">
          <p className="gfc-loader-mark">Yuta Kondo</p>
          <p className="gfc-loader-eyebrow">Loading visual sequence</p>
          <div className="gfc-loader-bar">
            <div
              className="gfc-loader-fill"
              style={{ width: `${loadProgress * 100}%` }}
            />
          </div>
          <p className="gfc-loader-progress">
            {Math.round(loadProgress * 100)}
            <span>%</span>
          </p>
          <p className="gfc-loader-hint">
            {Math.round(loadProgress * FRAME_COUNT)} / {FRAME_COUNT} frames
          </p>
        </div>
      </div>
    </>
  );
}
