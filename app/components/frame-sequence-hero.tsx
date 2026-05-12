"use client";

import { useEffect, useRef, useState } from "react";

function Typewriter({
  text,
  speed = 75,
  initialDelay = 480,
}: {
  text: string;
  speed?: number;
  initialDelay?: number;
}) {
  const chars = Array.from(text);
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) {
      setCount(chars.length);
      setDone(true);
      return;
    }
    let raf = 0;
    let timeout = 0;
    timeout = window.setTimeout(() => {
      let i = 0;
      const advance = () => {
        i += 1;
        setCount(i);
        if (i >= chars.length) {
          setDone(true);
          return;
        }
        timeout = window.setTimeout(advance, speed);
      };
      advance();
    }, initialDelay);
    return () => {
      window.clearTimeout(timeout);
      cancelAnimationFrame(raf);
    };
  }, [text, speed, initialDelay, chars.length]);

  return (
    <span className="typewriter" aria-label={text}>
      <span aria-hidden="true">{chars.slice(0, count).join("")}</span>
      {!done && <span className="typewriter-caret" aria-hidden="true" />}
    </span>
  );
}

/**
 * Cinematic hero overlay — sits over the global frame canvas as the first 100vh.
 * Handles: scroll-based fade, subtle 3D mouse parallax (depth feel).
 * Canvas atmosphere itself is provided by GlobalFrameCanvas.
 */
export function FrameSequenceHero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const cueRef = useRef<HTMLDivElement | null>(null);
  const tickingScrollRef = useRef(false);
  const tickingMouseRef = useRef(false);
  const targetTiltRef = useRef({ x: 0, y: 0 });
  const currentTiltRef = useRef({ x: 0, y: 0 });
  const rafIdRef = useRef<number | null>(null);

  // Scroll-driven fade + lift
  useEffect(() => {
    const update = () => {
      const y = window.scrollY;
      const vh = window.innerHeight;
      const fadeProgress = Math.min(1, Math.max(0, y / (vh * 0.55)));
      if (textRef.current) {
        const opacity = Math.max(0, 1 - fadeProgress * 1.05);
        const lift = fadeProgress * 64;
        const scale = 1 - fadeProgress * 0.04;
        textRef.current.style.opacity = String(opacity);
        textRef.current.style.setProperty("--scroll-lift", `${-lift}px`);
        textRef.current.style.setProperty("--scroll-scale", String(scale));
      }
      if (cueRef.current) {
        const cueFade = Math.min(1, Math.max(0, y / (vh * 0.18)));
        cueRef.current.style.opacity = String(Math.max(0, 1 - cueFade));
      }
    };

    const handleScroll = () => {
      if (tickingScrollRef.current) return;
      tickingScrollRef.current = true;
      requestAnimationFrame(() => {
        update();
        tickingScrollRef.current = false;
      });
    };

    update();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Subtle 3D mouse parallax on title (skip on touch devices)
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (
      window.matchMedia("(hover: none)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const animate = () => {
      const cur = currentTiltRef.current;
      const tgt = targetTiltRef.current;
      // smooth lerp toward target
      cur.x += (tgt.x - cur.x) * 0.08;
      cur.y += (tgt.y - cur.y) * 0.08;
      if (titleRef.current) {
        titleRef.current.style.transform = `perspective(1000px) rotateX(${-cur.y * 1.4}deg) rotateY(${cur.x * 2}deg) translateZ(0)`;
      }
      // Stop animating when close enough
      if (
        Math.abs(tgt.x - cur.x) < 0.0008 &&
        Math.abs(tgt.y - cur.y) < 0.0008
      ) {
        rafIdRef.current = null;
        return;
      }
      rafIdRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (tickingMouseRef.current) return;
      tickingMouseRef.current = true;
      requestAnimationFrame(() => {
        const x = e.clientX / window.innerWidth - 0.5;
        const y = e.clientY / window.innerHeight - 0.5;
        targetTiltRef.current = { x, y };
        if (rafIdRef.current === null) {
          rafIdRef.current = requestAnimationFrame(animate);
        }
        tickingMouseRef.current = false;
      });
    };

    const handleMouseLeave = () => {
      targetTiltRef.current = { x: 0, y: 0 };
      if (rafIdRef.current === null) {
        rafIdRef.current = requestAnimationFrame(animate);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="cinematic-hero"
      aria-label="Yuta Kondo Portfolio"
    >
      <div ref={textRef} className="cinematic-hero-content">
        <p className="cinematic-eyebrow">
          <span className="cinematic-eyebrow-dot" />
          <span className="glitch-text" data-text="YUTA KONDO">
            YUTA KONDO
          </span>
          <span>&nbsp;/&nbsp; EDGE INTELLIGENCE PORTFOLIO</span>
        </p>
        <h1 ref={titleRef} className="cinematic-title">
          <span className="cinematic-word">
            Sense<span className="cinematic-title-sep">.</span>
          </span>{" "}
          <span className="cinematic-word">
            Decide<span className="cinematic-title-sep">.</span>
          </span>{" "}
          <span className="cinematic-word">
            <span className="glitch-text" data-text="Share">
              Share
            </span>
            <span className="cinematic-title-sep">.</span>
          </span>
        </h1>
        <p className="cinematic-lead">
          <Typewriter text="現場の信号を、判断と公開につないでいく。" />
        </p>
        <div className="cinematic-meta">
          <span>
            <em>Edge AI</em>
            <small>研究 × 実装</small>
          </span>
          <span className="cinematic-meta-sep" />
          <span>
            <em>Sense → Decide → Share</em>
            <small>3-axis loop</small>
          </span>
        </div>
      </div>
      <div ref={cueRef} className="cinematic-scroll-cue" aria-hidden="true">
        <span>SCROLL</span>
        <div className="cinematic-scroll-line">
          <div className="cinematic-scroll-line-inner" />
        </div>
      </div>
    </section>
  );
}
