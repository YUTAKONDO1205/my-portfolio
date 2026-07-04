"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import type {
  Positioning,
  PositioningAxis,
  PositioningSilhouette,
} from "../portfolio-data";
import styles from "./positioning-section.module.css";

type PositioningSectionProps = {
  positioning: Positioning;
};

const easeOutQuart = [0.22, 1, 0.36, 1] as const;

// --- SVG canvas constants ---
const SVG_SIZE = 560;
const CX = SVG_SIZE / 2;
const CY = SVG_SIZE / 2;
const RADIUS = 190; // outer radius for value=10
const MAX_VALUE = 10;
const RING_STEPS = [2, 4, 6, 8, 10] as const;
const LABEL_OFFSET = 36;

/**
 * Map (value 0..MAX_VALUE, angle in radians) to a (x, y) point on the
 * pentagon-radial coordinate system, centered at (CX, CY).
 */
function polarToCartesian(
  cx: number,
  cy: number,
  radius: number,
  angleRad: number,
  value: number,
): { x: number; y: number } {
  const r = (value / MAX_VALUE) * radius;
  return {
    x: cx + r * Math.cos(angleRad),
    y: cy + r * Math.sin(angleRad),
  };
}

/**
 * Build a closed SVG polygon path string for a silhouette given the axis
 * order and the silhouette's scores.
 */
function buildSilhouettePath(
  axes: readonly PositioningAxis[],
  scores: PositioningSilhouette["scores"],
  angles: readonly number[],
): string {
  const points = axes.map((axis, i) => {
    const value = scores[axis.key];
    const p = polarToCartesian(CX, CY, RADIUS, angles[i], value);
    return `${p.x.toFixed(2)},${p.y.toFixed(2)}`;
  });
  return `M ${points.join(" L ")} Z`;
}

export function PositioningSection({ positioning }: PositioningSectionProps) {
  const reduceMotion = useReducedMotion();
  const [highlightedAxis, setHighlightedAxis] =
    useState<PositioningAxis["key"] | null>(null);

  const { axes, silhouettes } = positioning;

  // Pentagon starts at top (-π/2), 5 axes spaced at 2π/5.
  const angles = useMemo(
    () => axes.map((_, i) => -Math.PI / 2 + (i * 2 * Math.PI) / axes.length),
    [axes],
  );

  const yutaSilhouette = silhouettes.find((s) => s.id === "yuta");
  const embeddedSilhouette = silhouettes.find(
    (s) => s.id === "typical-embedded",
  );
  const aiSilhouette = silhouettes.find((s) => s.id === "typical-ai");

  // Build ring (pentagon) outlines for each grid step.
  const ringPaths = useMemo(
    () =>
      RING_STEPS.map((step) => {
        const pts = angles.map((a) => {
          const p = polarToCartesian(CX, CY, RADIUS, a, step);
          return `${p.x.toFixed(2)},${p.y.toFixed(2)}`;
        });
        return `M ${pts.join(" L ")} Z`;
      }),
    [angles],
  );

  // Build silhouette paths.
  const yutaPath = useMemo(
    () =>
      yutaSilhouette
        ? buildSilhouettePath(axes, yutaSilhouette.scores, angles)
        : "",
    [yutaSilhouette, axes, angles],
  );

  const embeddedPath = useMemo(
    () =>
      embeddedSilhouette
        ? buildSilhouettePath(axes, embeddedSilhouette.scores, angles)
        : "",
    [embeddedSilhouette, axes, angles],
  );

  const aiPath = useMemo(
    () =>
      aiSilhouette
        ? buildSilhouettePath(axes, aiSilhouette.scores, angles)
        : "",
    [aiSilhouette, axes, angles],
  );

  // Motion variants for entrance + evidence stagger.
  const headerVariants: Variants = {
    hidden: reduceMotion
      ? { opacity: 1, y: 0 }
      : { opacity: 0, y: 24, filter: "blur(10px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: reduceMotion
        ? { duration: 0 }
        : { duration: 0.7, ease: easeOutQuart },
    },
  };

  const radarVariants: Variants = {
    hidden: reduceMotion
      ? { opacity: 1 }
      : { opacity: 0, scale: 0.96, filter: "blur(12px)" },
    visible: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: reduceMotion
        ? { duration: 0 }
        : { duration: 0.9, ease: easeOutQuart, delay: 0.1 },
    },
  };

  const evidenceListVariants: Variants = {
    hidden: { opacity: reduceMotion ? 1 : 0 },
    visible: {
      opacity: 1,
      transition: reduceMotion
        ? { duration: 0 }
        : { staggerChildren: 0.08, delayChildren: 0.2 },
    },
  };

  const evidenceItemVariants: Variants = {
    hidden: reduceMotion
      ? { opacity: 1, x: 0 }
      : { opacity: 0, x: 16, filter: "blur(8px)" },
    visible: {
      opacity: 1,
      x: 0,
      filter: "blur(0px)",
      transition: reduceMotion
        ? { duration: 0 }
        : { duration: 0.55, ease: easeOutQuart },
    },
  };

  return (
    <section
      className={styles.section}
      aria-labelledby="positioning-heading"
    >
      <div className={styles.inner}>
        <motion.header
          className={styles.header}
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-15% 0px -10% 0px" }}
        >
          <span className={styles.eyebrow}>{positioning.label}</span>
          <h2 id="positioning-heading" className={styles.title}>
            {positioning.title}
          </h2>
          <p className={styles.thesisJa}>{positioning.thesisJa}</p>
          <p className={styles.thesisEn}>{positioning.thesisEn}</p>
        </motion.header>

        <div className={styles.body}>
          {/* ------------------- Radar ------------------- */}
          <motion.div
            className={styles.radarPanel}
            variants={radarVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10% 0px -5% 0px" }}
          >
            <svg
              className={styles.radarSvg}
              viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
              role="img"
              aria-label="Positioning radar: Yuta Kondo versus typical embedded and AI engineer silhouettes across five axes."
            >
              <defs>
                <linearGradient
                  id="positioning-primary-gradient"
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#2e6b84" />
                  <stop offset="100%" stopColor="#d9a83f" />
                </linearGradient>
              </defs>

              {/* Grid rings */}
              {ringPaths.map((d, i) => (
                <path
                  key={`ring-${RING_STEPS[i]}`}
                  d={d}
                  className={styles.gridRing}
                />
              ))}

              {/* Spokes (one per axis, from center to outer pentagon vertex) */}
              {angles.map((a, i) => {
                const p = polarToCartesian(CX, CY, RADIUS, a, MAX_VALUE);
                return (
                  <line
                    key={`spoke-${axes[i].key}`}
                    x1={CX}
                    y1={CY}
                    x2={p.x}
                    y2={p.y}
                    className={styles.gridSpoke}
                  />
                );
              })}

              {/* Ring scale labels (along the top spoke for readability) */}
              {RING_STEPS.map((step) => {
                const p = polarToCartesian(
                  CX,
                  CY,
                  RADIUS,
                  -Math.PI / 2,
                  step,
                );
                return (
                  <text
                    key={`scale-${step}`}
                    x={p.x + 6}
                    y={p.y + 3}
                    className={styles.gridLabel}
                  >
                    {step}
                  </text>
                );
              })}

              {/* Ghost silhouettes (drawn under primary) */}
              {embeddedPath && (
                <path
                  d={embeddedPath}
                  className={styles.silhouetteGhostEmbedded}
                />
              )}
              {aiPath && (
                <path d={aiPath} className={styles.silhouetteGhostAi} />
              )}

              {/* Primary silhouette: fill + stroke */}
              {yutaPath && (
                <>
                  <path
                    d={yutaPath}
                    className={styles.silhouettePrimaryFill}
                  />
                  <path
                    d={yutaPath}
                    className={styles.silhouettePrimaryStroke}
                  />
                </>
              )}

              {/* Yuta vertex dots + score numbers */}
              {yutaSilhouette &&
                axes.map((axis, i) => {
                  const value = yutaSilhouette.scores[axis.key];
                  const p = polarToCartesian(
                    CX,
                    CY,
                    RADIUS,
                    angles[i],
                    value,
                  );
                  // Push score label outward from the vertex.
                  const labelOffset = polarToCartesian(
                    CX,
                    CY,
                    RADIUS,
                    angles[i],
                    value + 1.1,
                  );
                  return (
                    <g key={`vertex-${axis.key}`}>
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r={3.5}
                        className={styles.vertexDot}
                      />
                      <text
                        x={labelOffset.x}
                        y={labelOffset.y}
                        className={styles.vertexScore}
                        textAnchor="middle"
                        dominantBaseline="central"
                      >
                        {value}
                      </text>
                    </g>
                  );
                })}

              {/* Axis labels at each vertex (JA + EN small) */}
              {axes.map((axis, i) => {
                const angle = angles[i];
                const labelPt = polarToCartesian(
                  CX,
                  CY,
                  RADIUS + LABEL_OFFSET,
                  angle,
                  MAX_VALUE,
                );
                const isHighlighted = highlightedAxis === axis.key;
                // Text anchor depends on horizontal angle.
                const cos = Math.cos(angle);
                const anchor: "start" | "middle" | "end" =
                  cos > 0.25 ? "start" : cos < -0.25 ? "end" : "middle";
                return (
                  <g
                    key={`axis-label-${axis.key}`}
                    className={`${styles.axisLabelGroup} ${
                      isHighlighted ? styles.highlighted : ""
                    }`}
                  >
                    <text
                      x={labelPt.x}
                      y={labelPt.y - 6}
                      textAnchor={anchor}
                      className={styles.axisLabelJa}
                    >
                      {axis.labelJa}
                    </text>
                    <text
                      x={labelPt.x}
                      y={labelPt.y + 8}
                      textAnchor={anchor}
                      className={styles.axisLabelEn}
                    >
                      {axis.labelEn}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Legend */}
            <div className={styles.legend} role="list">
              <span className={styles.legendItem} role="listitem">
                <span
                  aria-hidden="true"
                  className={`${styles.legendSwatch} ${styles.legendSwatchPrimary}`}
                />
                {yutaSilhouette?.label ?? "近藤悠太"}
              </span>
              <span className={styles.legendItem} role="listitem">
                <span
                  aria-hidden="true"
                  className={`${styles.legendSwatch} ${styles.legendSwatchEmbedded}`}
                />
                {embeddedSilhouette?.label ?? "一般的な組み込みエンジニア"}
              </span>
              <span className={styles.legendItem} role="listitem">
                <span
                  aria-hidden="true"
                  className={`${styles.legendSwatch} ${styles.legendSwatchAi}`}
                />
                {aiSilhouette?.label ?? "一般的な AI エンジニア"}
              </span>
            </div>
          </motion.div>

          {/* ------------------- Evidence ------------------- */}
          <motion.ol
            className={styles.evidenceList}
            variants={evidenceListVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10% 0px -5% 0px" }}
          >
            {axes.map((axis) => (
              <motion.li
                key={axis.key}
                className={styles.evidenceItem}
                variants={evidenceItemVariants}
                onMouseEnter={() => setHighlightedAxis(axis.key)}
                onMouseLeave={() => setHighlightedAxis(null)}
                onFocus={() => setHighlightedAxis(axis.key)}
                onBlur={() => setHighlightedAxis(null)}
                tabIndex={0}
                aria-label={`${axis.labelJa} (${axis.labelEn}) — score ${axis.score} of 10. ${axis.evidence}`}
              >
                <span className={styles.evidenceScore}>{axis.score}</span>
                <span className={styles.evidenceMain}>
                  <span className={styles.evidenceLabel}>
                    {axis.labelJa}
                    <span className={styles.evidenceLabelEn}>
                      {axis.labelEn}
                    </span>
                  </span>
                  <span className={styles.evidenceText}>{axis.evidence}</span>
                </span>
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </div>
    </section>
  );
}
