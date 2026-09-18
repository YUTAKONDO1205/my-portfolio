"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { AwardBadge } from "../portfolio-data";
import { isAwardPrize } from "../portfolio-data";
import styles from "./awards-strip.module.css";

type AwardsStripProps = {
  awards: readonly AwardBadge[];
  /** Refereed talks, counted from the talks list so the number agrees with
      the rest of the page (a prize won at a talk is both). */
  talkCount: number;
};

const easeOutQuart = [0.22, 1, 0.36, 1] as const;

/* The three kinds of recognition are different things, and the strip says
   which is which: a prize is judged, a selection is admitted, a presentation
   is refereed. Collapsing them into one "実績" label would inflate the count. */
function kindLabel(badge: AwardBadge) {
  switch (badge.kind) {
    case "selection":
      return "採択";
    case "presentation":
      return "学会発表";
    default:
      return "受賞";
  }
}

export function AwardsStrip({ awards, talkCount }: AwardsStripProps) {
  const reduceMotion = useReducedMotion();

  const prizes = awards.filter(isAwardPrize).length;
  const selections = awards.filter((a) => a.kind === "selection").length;
  const presentations = talkCount;
  const years = awards.map((a) => a.year).sort();
  const span = `${years[0]}–${years[years.length - 1]}`;

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
    hidden: reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 },
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
          受賞 {prizes} · 採択 {selections} · 学会発表 {presentations} · {span}
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
            aria-label={`${award.year} ${award.organization} ${award.award}`}
            data-kind={award.kind ?? "award"}
          >
            <span className={styles.kind}>{kindLabel(award)}</span>
            <span className={styles.award}>{award.award}</span>
            <span className={styles.organization}>{award.organization}</span>
            <span className={styles.year}>{award.year}</span>
            <span aria-hidden="true" className={styles.arrow}>
              ↗
            </span>
          </motion.a>
        ))}
      </motion.div>
    </section>
  );
}
