"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type {
  AwardBadge,
  PublicationEntry,
  ResearchProject,
  SelectedWork,
} from "../portfolio-data";
import { isAwardPrize } from "../portfolio-data";
import {
  getModalityCounts,
  type ModalityThemeClass,
} from "../lib/impact-metrics";
import styles from "./impact-dashboard.module.css";

export type ImpactDashboardProps = {
  publications: readonly PublicationEntry[];
  /** Full recognition badges; the "受賞" count uses only actual prizes. */
  awards: readonly AwardBadge[];
  research: readonly ResearchProject[];
  works: readonly SelectedWork[];
};

/* ---- Cadence column-chart geometry (Viz A) ---- */
const CAD_W = 480;
const CAD_H = 258;
const CAD_PAD_L = 30;
const CAD_PAD_R = 14;
const CAD_PAD_T = 28;
const CAD_PAD_B = 44;
const CAD_PLOT_X0 = CAD_PAD_L;
const CAD_PLOT_X1 = CAD_W - CAD_PAD_R;
const CAD_BASELINE = CAD_H - CAD_PAD_B;
const CAD_PLOT_TOP = CAD_PAD_T;
const CAD_PLOT_H = CAD_BASELINE - CAD_PLOT_TOP;

function niceMax(v: number): number {
  if (v <= 4) return 4;
  if (v <= 6) return 6;
  return Math.ceil(v / 2) * 2;
}

/* A bar segment with only its TOP corners rounded and a flush square bottom —
   lets stacked segments sit seamlessly and the column foot stay flat on the
   baseline (no rounded-corner notch), for any articles/awards combination. */
function roundedTopBar(
  x: number,
  y: number,
  w: number,
  h: number,
  radius: number,
): string {
  const r = Math.max(0, Math.min(radius, w / 2, h));
  return `M ${x} ${y + h} L ${x} ${y + r} Q ${x} ${y} ${x + r} ${y} L ${
    x + w - r
  } ${y} Q ${x + w} ${y} ${x + w} ${y + r} L ${x + w} ${y + h} Z`;
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
  awards,
  research,
  works,
}: ImpactDashboardProps) {
  const reduceMotion = useReducedMotion();

  const modalityCounts = getModalityCounts(research, publications, works);

  const maxArtifacts = Math.max(
    1,
    ...modalityCounts.map((m) => m.artifactCount),
  );

  const featuredWork = works.find((w) => w.feature);
  const channels = featuredWork?.distribution ?? [];

  // ---- Cadence chart: per-year stacked columns (記事 + 受賞) ----
  // "受賞" counts actual prizes only (excludes 採択 / 発表), so the chart and the
  // headline "受賞 N 件" agree everywhere on the site.
  const prizeBadges = awards.filter(isAwardPrize);
  const cadenceYears = Array.from(
    new Set([
      ...publications.map((p) => p.date.slice(0, 4)),
      ...prizeBadges.map((a) => a.year),
    ]),
  ).sort();
  const cadence = cadenceYears.map((year) => {
    const articles = publications.filter(
      (p) => p.date.slice(0, 4) === year,
    ).length;
    const yearAwards = prizeBadges.filter((a) => a.year === year).length;
    return { year, articles, awards: yearAwards, total: articles + yearAwards };
  });
  const cadenceMax = niceMax(Math.max(1, ...cadence.map((c) => c.total)));
  const cadenceUnit = CAD_PLOT_H / cadenceMax;
  const cadenceBand = (CAD_PLOT_X1 - CAD_PLOT_X0) / Math.max(cadence.length, 1);
  const cadenceColW = Math.min(74, cadenceBand * 0.52);
  const cadenceTicks = Array.from(
    { length: cadenceMax / 2 + 1 },
    (_, i) => i * 2,
  );
  const cumulativeTotal = cadence.reduce((sum, c) => sum + c.total, 0);
  // The most recent year is still in progress (partial / YTD), so mark it —
  // otherwise a shorter latest column reads as a decline in output pace.
  const currentYear = String(new Date().getFullYear());

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

  const totalAwards = prizeBadges.length;
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
        {/* Viz A — Output Cadence (per-year stacked columns) */}
        <motion.article
          className={`${styles.tile} ${styles.vizA}`}
          variants={fadeUp}
        >
          <header className={styles.tileHeader}>
            <h3 className={styles.tileTitle}>制作のペース</h3>
            <p className={styles.tileSubtitle}>
              記事と受賞を、{cadence.length} 年連続で積み上げ
            </p>
          </header>

          <div className={styles.cadenceWrap}>
            <svg
              className={styles.cadenceSvg}
              viewBox={`0 0 ${CAD_W} ${CAD_H}`}
              role="img"
              aria-label={`年別の公開実績。${cadence
                .map(
                  (c) => `${c.year}年 記事${c.articles}本・受賞${c.awards}件`,
                )
                .join("、")}。累計 ${cumulativeTotal} 件。`}
            >
              {/* horizontal gridlines + y scale */}
              {cadenceTicks.map((tick) => {
                const y = CAD_BASELINE - tick * cadenceUnit;
                return (
                  <g key={`grid-${tick}`}>
                    <line
                      className={
                        tick === 0 ? styles.cadenceBaseline : styles.cadenceGrid
                      }
                      x1={CAD_PLOT_X0}
                      x2={CAD_PLOT_X1}
                      y1={y}
                      y2={y}
                    />
                    <text
                      className={styles.cadenceAxisLabel}
                      x={CAD_PLOT_X0 - 8}
                      y={y + 3}
                      textAnchor="end"
                    >
                      {tick}
                    </text>
                  </g>
                );
              })}

              {/* per-year stacked columns */}
              {cadence.map((c, i) => {
                const cx = CAD_PLOT_X0 + cadenceBand * (i + 0.5);
                const x = cx - cadenceColW / 2;
                const artH = c.articles * cadenceUnit;
                const awdH = c.awards * cadenceUnit;
                const artY = CAD_BASELINE - artH;
                const awdY = artY - awdH;
                const totalY = CAD_BASELINE - c.total * cadenceUnit;
                const r = Math.min(7, cadenceColW / 2);
                const ytd = c.year === currentYear;
                const artClass = ytd ? styles.barArticleYtd : styles.barArticle;
                const awdClass = ytd ? styles.barAwardYtd : styles.barAward;

                return (
                  <motion.g
                    key={c.year}
                    style={{
                      transformBox: "fill-box",
                      transformOrigin: "center bottom",
                    }}
                    initial={reduceMotion ? { scaleY: 1 } : { scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{
                      duration: reduceMotion ? 0 : 0.75,
                      ease: [0.22, 1, 0.36, 1],
                      delay: reduceMotion ? 0 : 0.1 + i * 0.12,
                    }}
                  >
                    {/* articles (base): square, flush on baseline. Rounded top
                        only when it is the topmost (no awards above it). */}
                    {c.articles > 0 &&
                      (c.awards > 0 ? (
                        <rect
                          className={artClass}
                          x={x}
                          y={artY}
                          width={cadenceColW}
                          height={artH}
                        />
                      ) : (
                        <path
                          className={artClass}
                          d={roundedTopBar(x, artY, cadenceColW, artH, r)}
                        />
                      ))}
                    {/* awards (top): rounded top, flush square bottom */}
                    {c.awards > 0 && (
                      <path
                        className={awdClass}
                        d={roundedTopBar(x, awdY, cadenceColW, awdH, r)}
                      />
                    )}
                    {/* in-progress year: dashed outline of the full column */}
                    {ytd && c.total > 0 && (
                      <path
                        className={styles.barYtdOutline}
                        d={roundedTopBar(
                          x,
                          totalY,
                          cadenceColW,
                          c.total * cadenceUnit,
                          r,
                        )}
                      />
                    )}
                    {/* total label above column */}
                    <text
                      className={styles.cadenceTotalLabel}
                      x={cx}
                      y={totalY - 8}
                      textAnchor="middle"
                    >
                      {c.total}
                    </text>
                  </motion.g>
                );
              })}

              {/* year labels (+ in-progress tag on the current year) */}
              {cadence.map((c, i) => {
                const cx = CAD_PLOT_X0 + cadenceBand * (i + 0.5);
                return (
                  <g key={`yl-${c.year}`}>
                    <text
                      className={styles.cadenceYearLabel}
                      x={cx}
                      y={CAD_BASELINE + 22}
                      textAnchor="middle"
                    >
                      {c.year}
                    </text>
                    {c.year === currentYear && (
                      <text
                        className={styles.cadenceYtdTag}
                        x={cx}
                        y={CAD_BASELINE + 37}
                        textAnchor="middle"
                      >
                        進行中
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>

            <div className={styles.cadenceFooter}>
              <div className={styles.cadenceLegend} aria-hidden>
                <span className={styles.cadenceLegendItem}>
                  <span
                    className={`${styles.cadenceSwatch} ${styles.swatchArticle}`}
                  />
                  記事 {totalPublications}
                </span>
                <span className={styles.cadenceLegendItem}>
                  <span
                    className={`${styles.cadenceSwatch} ${styles.swatchAward}`}
                  />
                  受賞 {totalAwards}
                </span>
              </div>
              <span className={styles.cadenceCumulative}>
                累計 <strong>{cumulativeTotal}</strong> 件
              </span>
            </div>
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
