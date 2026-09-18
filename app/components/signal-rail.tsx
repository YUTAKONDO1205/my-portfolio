"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import styles from "./signal-rail.module.css";

/* ==========================================================================
   Signal rail — the page's own trace.
   A fixed vertical track at the right edge that appears once the hero has
   scrolled away. The filled portion is scroll progress; the markers are the
   page's sections in reading order, so the rail is both a map and the nav
   the hero header stops providing after the first viewport.
   ========================================================================== */

const ITEMS = [
  { id: "top", label: "Top" },
  { id: "works", label: "Works" },
  { id: "research", label: "Research" },
  { id: "talks", label: "Talks" },
  { id: "positioning", label: "Position" },
  { id: "data", label: "Data" },
  { id: "archive", label: "Archive" },
  { id: "contact", label: "Contact" },
] as const;

type ItemId = (typeof ITEMS)[number]["id"];

export function SignalRail() {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState<ItemId>("top");
  const [shown, setShown] = useState(false);
  const { scrollYProgress } = useScroll();
  const fill = useSpring(scrollYProgress, {
    stiffness: 160,
    damping: 30,
    mass: 0.3,
  });

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      setShown(window.scrollY > window.innerHeight * 0.9);
      // the section whose top has passed the upper 42% of the viewport wins
      const probe = window.innerHeight * 0.42;
      let current: ItemId = "top";
      for (const item of ITEMS) {
        const el = document.getElementById(item.id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= probe) current = item.id;
      }
      setActive(current);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <nav
      className={`${styles.rail} ${shown ? styles.shown : ""}`}
      aria-label="ページ内ナビゲーション"
    >
      <ol className={styles.list}>
        <motion.span
          className={styles.fill}
          aria-hidden="true"
          style={{ scaleY: reduceMotion ? 1 : fill }}
        />
        {ITEMS.map((item) => {
          const isActive = active === item.id;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={isActive ? styles.active : undefined}
                aria-current={isActive ? "true" : undefined}
              >
                <span>{item.label}</span>
                <i aria-hidden="true" />
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
