"use client";

import type { ReactNode } from "react";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
} from "motion/react";

const easeOutQuart = [0.22, 1, 0.36, 1] as const;

function spawnBeam(container: HTMLElement) {
  const beam = document.createElement("span");
  beam.className = "site-beam-tracer";

  const isBrass = Math.random() < 0.45;
  const lengthVmax = 32 + Math.random() * 28; // 32 to 60vmax
  const thickness = 3 + Math.random() * 3; // 3 to 6px
  const duration = 5 + Math.random() * 3.5; // 5 to 8.5s — slow projectile feel
  const angle = Math.random() * 360;

  // Pass-through point: a random position in the central 60% of the viewport.
  // The beam's CENTER passes through this point at the midpoint of its flight,
  // having travelled from 200% behind it to 200% past it (along its rotated
  // X axis). The travel distance comfortably crosses the viewport regardless
  // of angle.
  const originX = 20 + Math.random() * 60;
  const originY = 20 + Math.random() * 60;

  // Light-stage tracers: tinted ink streaks (brass / steel), no white head.
  const headColor = isBrass ? "168, 123, 30" : "46, 107, 132";
  const tailColor = isBrass ? "217, 168, 63" : "95, 178, 201";
  const glowColor = isBrass ? "217, 168, 63" : "95, 178, 201";

  beam.style.cssText = `
    position: absolute;
    left: ${originX}%;
    top: ${originY}%;
    width: ${lengthVmax}vmax;
    height: ${thickness}px;
    transform-origin: 50% 50%;
    background: linear-gradient(
      to right,
      transparent 0%,
      rgba(${tailColor}, 0.14) 60%,
      rgba(${headColor}, 0.34) 96%,
      rgba(${headColor}, 0.4) 100%
    );
    filter: blur(3.2px);
    box-shadow:
      0 0 28px rgba(${glowColor}, 0.22),
      0 0 80px rgba(${glowColor}, 0.1);
    opacity: 0;
    pointer-events: none;
    will-change: transform, opacity;
    animation: beamFireRandom ${duration}s linear forwards;
    --beam-angle: ${angle}deg;
  `;

  container.appendChild(beam);
  // animationend doesn't reliably fire when the keyframe transform reads a
  // custom property, so we remove the beam manually after its duration.
  window.setTimeout(() => beam.remove(), duration * 1000 + 100);
}

export function SiteMotionChrome() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  // useReducedMotion() is null during SSR, so branching markup on it directly
  // mismatches at hydration for reduced-motion visitors — gate on mount.
  const [mounted, setMounted] = useState(false);
  const beamContainerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const progressScale = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 28,
    mass: 0.24,
  });

  const pointerX = useMotionValue(-280);
  const pointerY = useMotionValue(-280);
  const springPointerX = useSpring(pointerX, {
    stiffness: 160,
    damping: 24,
    mass: 0.5,
  });
  const springPointerY = useSpring(pointerY, {
    stiffness: 160,
    damping: 24,
    mass: 0.5,
  });

  const pointerAura = useMotionTemplate`radial-gradient(
    320px circle at ${springPointerX}px ${springPointerY}px,
    rgba(217, 168, 63, 0.1) 0%,
    rgba(46, 107, 132, 0.07) 28%,
    rgba(236, 239, 243, 0) 74%
  )`;

  const updatePointer = useEffectEvent((event: PointerEvent) => {
    pointerX.set(event.clientX);
    pointerY.set(event.clientY);
  });

  const resetPointer = useEffectEvent(() => {
    pointerX.set(-280);
    pointerY.set(-280);
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      return;
    }

    const onPointerMove = (event: PointerEvent) => {
      updatePointer(event);
    };

    const onPointerLeave = () => {
      resetPointer();
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerleave", onPointerLeave);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [reduceMotion]);

  // Random beam spawner — fires tracers at random intervals with random
  // direction, color, length, speed. Each beam removes itself on animationend.
  // `mounted` is a dep because the container div only renders post-mount.
  useEffect(() => {
    if (!mounted || reduceMotion) return;
    const container = beamContainerRef.current;
    if (!container) return;

    let timeoutId: number;

    const scheduleNext = () => {
      // Halved spawn rate — roughly one beam every 2.8-6.7 seconds on average
      const wait = 2800 + Math.random() * 3800;
      timeoutId = window.setTimeout(() => {
        spawnBeam(container);
        scheduleNext();
      }, wait);
    };

    scheduleNext();

    return () => {
      window.clearTimeout(timeoutId);
      while (container.firstChild) container.removeChild(container.firstChild);
    };
  }, [reduceMotion]);

  return (
    <>
      <motion.div
        className="site-scroll-progress"
        style={{ scaleX: progressScale }}
      />

      {mounted && !reduceMotion && (
        <>
          <motion.div className="site-pointer-aura" style={{ background: pointerAura }} />
          <div
            ref={beamContainerRef}
            className="site-beams"
            aria-hidden="true"
          />
        </>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          className="site-route-signal"
          initial={{ opacity: 0, x: "-18%" }}
          animate={{
            opacity: [0, 1, 0],
            x: ["-18%", "28%", "116%"],
          }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 1.05,
            ease: easeOutQuart,
          }}
        />
      </AnimatePresence>
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
          : {
              opacity: 0,
              y: detail ? 44 : 28,
              scale: 0.988,
              filter: "blur(14px)",
            }
      }
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
      }}
      transition={{
        duration: detail ? 0.82 : 0.72,
        ease: easeOutQuart,
      }}
    >
      <motion.div
        aria-hidden="true"
        className="route-template-sheen"
        initial={
          reduceMotion
            ? { opacity: 0 }
            : {
                opacity: 0.56,
                scaleX: 1.08,
                x: "-4%",
              }
        }
        animate={{
          opacity: 0,
          scaleX: 0.94,
          x: "4%",
        }}
        transition={{
          duration: 1.08,
          ease: easeOutQuart,
          delay: 0.08,
        }}
      />
      {children}
    </motion.div>
  );
}
