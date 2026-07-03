"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion, type MotionProps } from "motion/react";
import { heroCopyV2 } from "../portfolio-data";
import styles from "./frame-sequence-hero.module.css";

const HERO_FRAME = "/images/ambient/ドローン損傷検出カード.png";
const easeOut = [0.22, 1, 0.36, 1] as const;

export function FrameSequenceHero() {
  const reduceMotion = useReducedMotion();

  const motionProps: MotionProps = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 22, filter: "blur(10px)" },
        animate: { opacity: 1, y: 0, filter: "blur(0px)" },
        transition: { duration: 0.8, ease: easeOut },
      };

  return (
    <section className={styles.hero} aria-label="近藤悠太 Portfolio">
      <Image
        className={styles.media}
        src={HERO_FRAME}
        alt=""
        fill
        priority
        sizes="100vw"
        aria-hidden="true"
      />
      <div className={styles.scrim} aria-hidden="true" />

      <div className={styles.inner}>
        <header className={styles.nav}>
          <a className={styles.brand} href="#top" aria-label="ページ上部へ">
            <span>近藤悠太</span>
            <span>Yuta Kondo</span>
          </a>
          <nav className={styles.navLinks} aria-label="主要セクション">
            <a href="#works">Works</a>
            <a href="#research">Research</a>
            <a href="#contact">Contact</a>
          </nav>
        </header>

        <div className={styles.body}>
          <motion.div className={styles.copy} {...motionProps}>
            <p className={styles.eyebrow}>{heroCopyV2.eyebrow}</p>
            <h1>
              現場の信号を、
              <span>使える判断へ。</span>
            </h1>
            <p className={styles.lead}>{heroCopyV2.subJa}</p>
            <div className={styles.actions}>
              <a
                className={styles.primaryAction}
                href={heroCopyV2.primaryCta.href}
                target="_blank"
                rel="noreferrer"
              >
                {heroCopyV2.primaryCta.label}
              </a>
              <Link
                className={styles.secondaryAction}
                href={heroCopyV2.secondaryCta.href}
              >
                {heroCopyV2.secondaryCta.label}
              </Link>
            </div>
          </motion.div>

          <motion.aside
            className={styles.panel}
            {...(reduceMotion
              ? {}
              : {
                  initial: { opacity: 0, y: 18 },
                  animate: { opacity: 1, y: 0 },
                  transition: {
                    duration: 0.72,
                    ease: [0.22, 1, 0.36, 1],
                    delay: 0.18,
                  },
                })}
          >
            <p className={styles.panelLabel}>Latest Signal</p>
            <a
              className={styles.updateLink}
              href={heroCopyV2.latestUpdate.href}
              target="_blank"
              rel="noreferrer"
            >
              <span>{heroCopyV2.latestUpdate.dateLabel}</span>
              <strong>{heroCopyV2.latestUpdate.title}</strong>
            </a>
            <div className={styles.metrics} aria-label="実績サマリー">
              <span>
                <strong>6+</strong>
                受賞・採択
              </span>
              <span>
                <strong>4</strong>
                配布チャネル
              </span>
              <span>
                <strong>100%</strong>
                Local first
              </span>
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}
