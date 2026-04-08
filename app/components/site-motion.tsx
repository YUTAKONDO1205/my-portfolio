"use client";

import type { ReactNode } from "react";
import { useEffect, useEffectEvent } from "react";
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

export function SiteMotionChrome() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
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
    rgba(196, 67, 92, 0.18) 0%,
    rgba(80, 120, 172, 0.1) 28%,
    rgba(16, 18, 22, 0) 74%
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

  return (
    <>
      <motion.div
        className="site-scroll-progress"
        style={{ scaleX: progressScale }}
      />

      {!reduceMotion && (
        <motion.div className="site-pointer-aura" style={{ background: pointerAura }} />
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
