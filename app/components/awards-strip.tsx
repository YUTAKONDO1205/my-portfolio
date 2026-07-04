"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { AwardBadge } from "../portfolio-data";
import styles from "./awards-strip.module.css";

type AwardsStripProps = {
  awards: readonly AwardBadge[];
};

const easeOutQuart = [0.22, 1, 0.36, 1] as const;

const hoverLift = {
  y: -6,
  transition: { type: "spring", stiffness: 240, damping: 20 },
} as const;

export function AwardsStrip({ awards }: AwardsStripProps) {
  const reduceMotion = useReducedMotion();

  const containerVariants: Variants = {
    hidden: { opacity: reduceMotion ? 1 : 0 },
    visible: {
      opacity: 1,
      transition: reduceMotion
        ? { duration: 0 }
        : {
            staggerChildren: 0.08,
            delayChildren: 0.08,
          },
    },
  };

  const itemVariants: Variants = {
    hidden: reduceMotion
      ? { opacity: 1, y: 0 }
      : { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: reduceMotion
        ? { duration: 0 }
        : { duration: 0.6, ease: easeOutQuart },
    },
  };

  return (
    <section className={styles.section} aria-labelledby="awards-strip-heading">
      <div className={styles.header}>
        <span id="awards-strip-heading" className={styles.eyebrow}>
          Recognition · 実績
        </span>
        <span className={styles.count}>
          実績 {awards.length} 件 · 2024–2026
        </span>
      </div>

      <motion.div
        className={styles.row}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      >
        {awards.map((award, index) => (
          <motion.a
            key={`${award.year}-${award.award}-${index}`}
            className={styles.card}
            href={award.href}
            target="_blank"
            rel="noreferrer"
            variants={itemVariants}
            whileHover={reduceMotion ? undefined : hoverLift}
            whileFocus={reduceMotion ? undefined : hoverLift}
            aria-label={`${award.year} ${award.organization} ${award.award}`}
          >
            <span className={styles.year}>{award.year}</span>
            <span className={styles.organization}>{award.organization}</span>
            <span className={styles.award}>{award.award}</span>
            <span aria-hidden="true" className={styles.arrow}>
              ↗
            </span>
          </motion.a>
        ))}
      </motion.div>
    </section>
  );
}
