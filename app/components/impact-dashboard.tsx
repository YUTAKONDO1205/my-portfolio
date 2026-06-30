"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type {
  PublicationEntry,
  Recognition,
  ResearchProject,
  SelectedWork,
} from "../portfolio-data";
import {
  getModalityCounts,
  getPublicationThemeClass,
  getYearBuckets,
  type ModalityThemeClass,
} from "../lib/impact-metrics";
import styles from "./impact-dashboard.module.css";

export type ImpactDashboardProps = {
  publications: readonly PublicationEntry[];
  recognitions: readonly Recognition[];
  research: readonly ResearchProject[];
  works: readonly SelectedWork[];
};

const SLOTS_PER_YEAR = 8;
const TIMELINE_PADDING_X = 64;
const TIMELINE_ROW_HEIGHT = 56;
const TIMELINE_TOP = 24;
const DOT_RADIUS = 6;
const RING_RADIUS = 8;

function dotClassFor(themeClass: ModalityThemeClass | null): string {
  switch (themeClass) {
    case "theme-drone":
      return styles.dotDrone;
    case "theme-pdm":
      return styles.dotPdm;
    case "theme-anomaly":
      return styles.dotAnomaly;
    case "theme-eltres":
      return styles.dotEltres;
    default:
      return styles.dotNeutral;
  }
}

function modalityColorClass(themeClass: ModalityThemeClass): string {
  switch (themeClass) {
    case "theme-drone":
      return "drone";
    case "theme-pdm":
      return "pdm";
    case "theme-anomaly":
      return "anomaly";
    case "theme-eltres":
      return "eltres";
  }
}

export function ImpactDashboard({
  publications,
  recognitions,
  research,
  works,
}: ImpactDashboardProps) {
  const reduceMotion = useReducedMotion();

  const yearBuckets = getYearBuckets(publications, recognitions);
  const modalityCounts = getModalityCounts(research, publications, works);

  const maxArtifacts = Math.max(
    1,
    ...modalityCounts.map((m) => m.artifactCount),
  );

  const featuredWork = works.find((w) => w.feature);
  const channels = featuredWork?.distribution ?? [];

  const rowCount = Math.max(yearBuckets.length, 1);
  const svgHeight = TIMELINE_TOP + rowCount * TIMELINE_ROW_HEIGHT + 32;
  const svgWidth = 600;
  const trackStart = TIMELINE_PADDING_X;
  const trackEnd = svgWidth - 28;
  const trackWidth = trackEnd - trackStart;
  const slotStep = trackWidth / SLOTS_PER_YEAR;

  // Annotation: find year with most awards (defensible "headline").
  const annotatedBucket = yearBuckets.reduce<typeof yearBuckets[number] | null>(
    (best, bucket) => {
      if (!best) return bucket.awards.length > 0 ? bucket : null;
      return bucket.awards.length > best.awards.length ? bucket : best;
    },
    null,
  );

  const fadeUp: Variants = reduceMotion
    ? {
        hidden: { opacity: 1, y: 0 },
        visible: { opacity: 1, y: 0 },
      }
    : {
        hidden: { opacity: 0, y: 16 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
        },
      };

  const stagger: Variants = reduceMotion
    ? { hidden: {}, visible: {} }
    : {
        hidden: {},
        visible: { transition: { staggerChildren: 0.08 } },
      };

  const totalAwards = recognitions.length;
  const totalPublications = publications.length;

  return (
    <motion.section
      className={styles.section}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={stagger}
      aria-label="Impact metrics"
    >
      <motion.span className={styles.eyebrow} variants={fadeUp}>
        インパクト
      </motion.span>
      <motion.h2 className={styles.title} variants={fadeUp}>
        軌跡を、データで
      </motion.h2>
      <motion.p className={styles.lead} variants={fadeUp}>
        2024 → 2026、4 つのモダリティ、{totalAwards} 件の受賞、
        {channels.length} つの配布チャネル。
      </motion.p>

      <div className={styles.grid}>
        {/* Viz A — Output Cadence Timeline */}
        <motion.article
          className={`${styles.tile} ${styles.vizA}`}
          variants={fadeUp}
        >
          <header className={styles.tileHeader}>
            <h3 className={styles.tileTitle}>制作のペース</h3>
            <p className={styles.tileSubtitle}>
              年ごとの公開、{yearBuckets.length} 年連続
            </p>
          </header>

          <div className={styles.timelineWrap}>
            <svg
              className={styles.timelineSvg}
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              role="img"
              aria-label={`Timeline of ${totalPublications} publications across ${yearBuckets.length} years`}
            >
              {yearBuckets.map((bucket, rowIdx) => {
                const y = TIMELINE_TOP + rowIdx * TIMELINE_ROW_HEIGHT + 18;
                const chevronCount = bucket.awards.length;
                const chevronStartX = trackEnd + 6;

                return (
                  <g key={bucket.year}>
                    <text className={styles.yearLabel} x={12} y={y + 4}>
                      {bucket.year}
                    </text>
                    <line
                      className={styles.yearRule}
                      x1={trackStart}
                      x2={trackEnd}
                      y1={y}
                      y2={y}
                    />
                    {bucket.publications.map((pub, idx) => {
                      const cx = trackStart + slotStep * (idx + 0.5);
                      const themeClass = getPublicationThemeClass(pub);
                      const hasAward = pub.awards.length > 0;
                      return (
                        <g key={pub.id}>
                          {hasAward && (
                            <circle
                              className={styles.awardRing}
                              cx={cx}
                              cy={y}
                              r={RING_RADIUS}
                            />
                          )}
                          <circle
                            className={`${styles.dot} ${dotClassFor(themeClass)}`}
                            cx={cx}
                            cy={y}
                            r={DOT_RADIUS}
                          >
                            <title>{`${pub.dateLabel} · ${pub.title}`}</title>
                          </circle>
                        </g>
                      );
                    })}
                    {Array.from({ length: chevronCount }).map((_, i) => {
                      // Chevrons placed in a small cluster to the right of the year track.
                      const cx = chevronStartX + i * 9;
                      return (
                        <polygon
                          key={`${bucket.year}-chev-${i}`}
                          className={styles.chevron}
                          points={`${cx},${y - 4} ${cx + 4},${y + 3} ${cx - 4},${y + 3}`}
                        />
                      );
                    })}
                  </g>
                );
              })}

              {annotatedBucket && annotatedBucket.awards.length > 0 && (
                <g>
                  {(() => {
                    const rowIdx = yearBuckets.findIndex(
                      (b) => b.year === annotatedBucket.year,
                    );
                    const y =
                      TIMELINE_TOP + rowIdx * TIMELINE_ROW_HEIGHT + 18;
                    const chevronX = trackEnd + 6;
                    const labelX = trackEnd - 60;
                    const labelY = y - 16;
                    return (
                      <>
                        <path
                          className={styles.annotationPointer}
                          d={`M ${chevronX} ${y - 4} C ${chevronX - 20} ${y - 14}, ${labelX + 90} ${labelY + 4}, ${labelX + 70} ${labelY + 2}`}
                        />
                        <text
                          className={styles.annotation}
                          x={labelX}
                          y={labelY}
                          textAnchor="end"
                        >
                          {`${annotatedBucket.year}年に受賞 ${annotatedBucket.awards.length} 件`}
                        </text>
                      </>
                    );
                  })()}
                </g>
              )}
            </svg>

            <div className={styles.legend} aria-hidden>
              <span className={styles.legendItem}>
                <span className={`${styles.legendSwatch} ${styles.drone}`} />
                画像 + IMU
              </span>
              <span className={styles.legendItem}>
                <span className={`${styles.legendSwatch} ${styles.pdm}`} />
                振動 + 音響
              </span>
              <span className={styles.legendItem}>
                <span className={`${styles.legendSwatch} ${styles.anomaly}`} />
                画像 + 運用
              </span>
              <span className={styles.legendItem}>
                <span className={`${styles.legendSwatch} ${styles.eltres}`} />
                CO2 + GPS
              </span>
              <span className={styles.legendItem}>
                <span className={styles.legendRing} />
                受賞作品
              </span>
            </div>
            <p className={styles.vizCaption}>
              記事 {totalPublications} 本 · 受賞 {totalAwards} 件
            </p>
          </div>
        </motion.article>

        {/* Viz B — Signal Modality Coverage */}
        <motion.article
          className={`${styles.tile} ${styles.vizB}`}
          variants={fadeUp}
        >
          <header className={styles.tileHeader}>
            <h3 className={styles.tileTitle}>4 / 4 モダリティ稼働中</h3>
            <p className={styles.tileSubtitle}>信号モダリティのカバー範囲</p>
          </header>

          <div className={styles.lollipopList}>
            {modalityCounts.map((modality) => {
              const colorClass = modalityColorClass(modality.themeClass);
              const widthPct =
                (modality.artifactCount / maxArtifacts) * 100;
              return (
                <div className={styles.lollipopRow} key={modality.key}>
                  <div className={styles.lollipopLabel}>
                    <span className={styles.lollipopLabelJa}>
                      {modality.labelJa}
                    </span>
                    <span className={styles.lollipopLabelEn}>
                      {modality.labelEn}
                    </span>
                  </div>
                  <div className={styles.lollipopTrack}>
                    <motion.span
                      className={`${styles.lollipopBar} ${styles[colorClass]}`}
                      style={{ width: `${widthPct}%` }}
                      initial={
                        reduceMotion ? { scaleX: 1 } : { scaleX: 0 }
                      }
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true, amount: 0.4 }}
                      transition={{
                        duration: reduceMotion ? 0 : 0.7,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    />
                    <span
                      className={`${styles.lollipopDot} ${styles[colorClass]}`}
                      style={{ left: `${widthPct}%` }}
                    />
                  </div>
                  <span className={styles.lollipopCount}>
                    {modality.artifactCount}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.article>

        {/* Viz C — Distribution Reach */}
        <motion.article
          className={`${styles.tile} ${styles.vizC}`}
          variants={fadeUp}
        >
          <header className={styles.tileHeader}>
            <h3 className={styles.tileTitle}>
              {channels.length} マーケットプレイス · 1 codebase
            </h3>
            <p className={styles.tileSubtitle}>
              {featuredWork?.title ?? "配布"} の到達範囲
            </p>
          </header>

          <div className={styles.channelGrid}>
            {channels.map((channel) => (
              <div className={styles.channelTile} key={channel.label}>
                <span
                  className={`${styles.statusDot} ${
                    channel.status === "pending"
                      ? styles.pending
                      : styles.live
                  }`}
                />
                <span>{channel.label}</span>
              </div>
            ))}
          </div>

          <div className={styles.banWrap}>
            <span className={styles.ban}>0</span>
            <span className={styles.banCaption}>
              <span className={styles.banCaptionStrong}>
                テレメトリ送信なし
              </span>
              コードは端末から出ない
              <br />
              0 telemetry · code never leaves the device
            </span>
          </div>
        </motion.article>
      </div>
    </motion.section>
  );
}
