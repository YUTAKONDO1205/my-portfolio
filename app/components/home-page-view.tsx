"use client";

import { useEffect, useRef, useState, type PropsWithChildren } from "react";
import Link from "next/link";
import {
  motion,
  useInView,
  useReducedMotion,
  type Variants,
} from "motion/react";
import { getArtworkStyle, getProjectArtwork } from "../artwork";
import { FrameSequenceHero } from "./frame-sequence-hero";
import { AwardsStrip } from "./awards-strip";
import { PositioningSection } from "./positioning-section";
import { ImpactDashboard } from "./impact-dashboard";
import type {
  AwardBadge,
  Philosophy,
  PlatformLink,
  Positioning,
  PublicationEntry,
  Recognition,
  ResearchProject,
  SelectedWork,
  SiteAxis,
} from "../portfolio-data";

type HomePageViewProps = {
  awardBadges: readonly AwardBadge[];
  platformLinks: readonly PlatformLink[];
  positioning: Positioning;
  publicationTimeline: readonly PublicationEntry[];
  recognitions: readonly Recognition[];
  researchProjects: readonly ResearchProject[];
  selectedWorks: readonly SelectedWork[];
  siteAxis: SiteAxis;
  philosophy: Philosophy;
};

const easeOutExpo = [0.22, 1, 0.36, 1] as const;
const viewport = { once: true, amount: 0.22 } as const;

const sectionVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 54,
    filter: "blur(16px)",
  },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.78,
      ease: easeOutExpo,
    },
  },
};

const groupVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      delayChildren: 0.08,
      staggerChildren: 0.08,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 36,
    scale: 0.96,
    filter: "blur(12px)",
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.68,
      ease: easeOutExpo,
    },
  },
};

const featureCardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 36,
    scale: 0.96,
    filter: "blur(12px)",
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.7,
      ease: easeOutExpo,
      delayChildren: 0.22,
      staggerChildren: 0.06,
    },
  },
};

const featureChildVariants: Variants = {
  hidden: { opacity: 0, x: -14, filter: "blur(6px)" },
  show: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: easeOutExpo },
  },
};

const featureChipVariants: Variants = {
  hidden: { opacity: 0, y: 10, scale: 0.92 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.42, ease: easeOutExpo },
  },
};

const charVariants: Variants = {
  hidden: { opacity: 0, y: 18, filter: "blur(10px)" },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.58,
      delay: i * 0.028,
      ease: easeOutExpo,
    },
  }),
};

function SplitHeading({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <h2 className={className}>{text}</h2>;
  }

  const chars = Array.from(text);

  return (
    <motion.h2
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
      aria-label={text}
    >
      {chars.map((char, index) => {
        if (char === " " || char === "　") {
          return (
            <span
              key={`${index}-space`}
              className="heading-char-space"
              aria-hidden="true"
            />
          );
        }
        return (
          <motion.span
            key={`${index}-${char}`}
            className="heading-char"
            custom={index}
            variants={charVariants}
            aria-hidden="true"
          >
            {char}
          </motion.span>
        );
      })}
    </motion.h2>
  );
}

function AnimatedCount({ value }: { value: number }) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [display, setDisplay] = useState(reduceMotion ? value : 0);

  useEffect(() => {
    if (reduceMotion) {
      setDisplay(value);
      return;
    }
    if (!inView) return;
    let raf = 0;
    const duration = 900;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduceMotion, value]);

  return <strong ref={ref}>{display}</strong>;
}

function MotionCardShell({ children }: PropsWithChildren) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="motion-card-shell"
      variants={itemVariants}
      whileHover={
        reduceMotion
          ? undefined
          : {
              y: -10,
              scale: 1.018,
            }
      }
      transition={{
        type: "spring",
        stiffness: 240,
        damping: 20,
        mass: 0.8,
      }}
    >
      {children}
    </motion.div>
  );
}

// Suppress unused-import lint while keeping AnimatedCount available for future use
void AnimatedCount;

export function HomePageView({
  awardBadges,
  platformLinks,
  positioning,
  publicationTimeline,
  recognitions,
  researchProjects,
  selectedWorks,
  siteAxis,
}: HomePageViewProps) {
  const reduceMotion = useReducedMotion();

  return (
    <>
      <FrameSequenceHero />
      <main className="portfolio-home">
        <AwardsStrip awards={awardBadges} />

        <motion.section
          id="projects"
          className="shell section dark-panel"
          variants={sectionVariants}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
        >
          <div className="section-heading section-heading-inverse">
            <p className="eyebrow">Project Sites</p>
            <SplitHeading text="研究テーマ" />
            <p className="section-intro">
              気になる研究から個別ページに入り、背景、構成、現在地まで追えます。
            </p>
          </div>

          <motion.div className="project-preview-grid" variants={groupVariants}>
            {researchProjects.map((project) => {
              const artworkStyle = getArtworkStyle(getProjectArtwork(project));

              return (
                <MotionCardShell key={project.slug}>
                  <article
                    className={`project-preview-card ${project.themeClass}`}
                  >
                    <div
                      className={`project-preview-photo ${project.ambientClass}`}
                      aria-hidden="true"
                    />
                    {artworkStyle && (
                      <div
                        className="artwork-layer project-preview-artwork"
                        style={artworkStyle}
                        aria-hidden="true"
                      />
                    )}
                    <div className="project-preview-inner">
                      <p className="card-label card-label-inverse">
                        {project.year}
                      </p>
                      <h3>{project.title}</h3>
                      <p className="project-preview-subtitle">
                        {project.subtitle}
                      </p>
                      <p className="project-preview-summary">
                        {project.cardSummary}
                      </p>
                      <div className="tag-row">
                        {project.tags.slice(0, 4).map((tag) => (
                          <span key={tag} className="tag">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="link-row">
                        <Link
                          href={`/research/${project.slug}`}
                          className="arrow-link"
                        >
                          詳しく見る
                        </Link>
                      </div>
                    </div>
                  </article>
                </MotionCardShell>
              );
            })}
          </motion.div>
        </motion.section>

        <motion.section
          id="works"
          className="shell section dark-panel"
          variants={sectionVariants}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
        >
          <div className="section-heading section-heading-inverse">
            <p className="eyebrow">Practice</p>
            <SplitHeading text="実装と公開" />
            <p className="section-intro">
              研究の傍らで動かしているプロダクト群。
              セキュリティ、LLM マルチエージェント、業務システムまで、領域を横断して実装から公開までを通して手を動かしています。
            </p>
          </div>

          <motion.div className="selected-works-grid" variants={groupVariants}>
            {selectedWorks.map((work) => {
              const hasRich =
                (work.highlights && work.highlights.length > 0) ||
                (work.distribution && work.distribution.length > 0);

              if (hasRich) {
                return (
                  <motion.article
                    key={work.slug}
                    className={`selected-work-card selected-work-card-rich ${
                      work.feature ? "selected-work-card-feature" : ""
                    } ${work.themeClass}`}
                    variants={work.feature ? featureCardVariants : itemVariants}
                    whileHover={
                      reduceMotion
                        ? undefined
                        : {
                            y: -8,
                            scale: 1.012,
                          }
                    }
                    transition={{
                      type: "spring",
                      stiffness: 220,
                      damping: 22,
                      mass: 0.88,
                    }}
                  >
                    <span className="quick-link-label">{work.category}</span>
                    <a
                      href={work.href}
                      target="_blank"
                      rel="noreferrer"
                      className="selected-work-title-link"
                    >
                      <strong>
                        {work.feature ? (
                          <span className="glitch-text" data-text={work.title}>
                            {work.title}
                          </span>
                        ) : (
                          work.title
                        )}
                      </strong>
                      <span className="selected-work-arrow" aria-hidden="true">
                        ↗
                      </span>
                    </a>
                    <p className="selected-work-subtitle">{work.subtitle}</p>
                    <p className="selected-work-summary">{work.summary}</p>

                    {work.highlights && work.highlights.length > 0 && (
                      <ul className="selected-work-highlights">
                        {work.highlights.map((line, i) => (
                          <motion.li
                            key={i}
                            variants={
                              work.feature ? featureChildVariants : undefined
                            }
                          >
                            <span
                              className="selected-work-bullet"
                              aria-hidden="true"
                            />
                            <span>{line}</span>
                          </motion.li>
                        ))}
                      </ul>
                    )}

                    {work.distribution && work.distribution.length > 0 && (
                      <div className="selected-work-dist">
                        <span className="selected-work-dist-label">
                          Distribution
                        </span>
                        <div className="selected-work-dist-chips">
                          {work.distribution.map((d) => {
                            const chipBody = (
                              <>
                                <span
                                  className={`selected-work-dist-status selected-work-dist-status-${
                                    d.status ?? "live"
                                  }`}
                                  aria-hidden="true"
                                />
                                <span>{d.label}</span>
                                {d.status === "pending" && (
                                  <span className="selected-work-dist-tag">
                                    申請中
                                  </span>
                                )}
                              </>
                            );
                            return d.href ? (
                              <motion.a
                                key={d.label}
                                href={d.href}
                                target="_blank"
                                rel="noreferrer"
                                className="selected-work-dist-chip is-link"
                                variants={
                                  work.feature ? featureChipVariants : undefined
                                }
                                whileHover={
                                  reduceMotion
                                    ? undefined
                                    : { y: -3, scale: 1.04 }
                                }
                                transition={{
                                  type: "spring",
                                  stiffness: 320,
                                  damping: 18,
                                }}
                              >
                                {chipBody}
                              </motion.a>
                            ) : (
                              <motion.span
                                key={d.label}
                                className="selected-work-dist-chip"
                                variants={
                                  work.feature ? featureChipVariants : undefined
                                }
                              >
                                {chipBody}
                              </motion.span>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <div className="tag-row">
                      {work.tags.slice(0, 6).map((tag) => (
                        <span key={tag} className="tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </motion.article>
                );
              }

              return (
                <motion.a
                  key={work.slug}
                  href={work.href}
                  className={`selected-work-card ${work.themeClass}`}
                  variants={itemVariants}
                  whileHover={
                    reduceMotion
                      ? undefined
                      : {
                          y: -10,
                          scale: 1.018,
                        }
                  }
                  transition={{
                    type: "spring",
                    stiffness: 240,
                    damping: 20,
                    mass: 0.82,
                  }}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="quick-link-label">{work.category}</span>
                  <strong>{work.title}</strong>
                  <p className="selected-work-subtitle">{work.subtitle}</p>
                  <p>{work.summary}</p>
                  <div className="tag-row">
                    {work.tags.slice(0, 4).map((tag) => (
                      <span key={tag} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.a>
              );
            })}
          </motion.div>
        </motion.section>

        <PositioningSection positioning={positioning} />

        <ImpactDashboard
          publications={publicationTimeline}
          recognitions={recognitions}
          research={researchProjects}
          works={selectedWorks}
        />

        <motion.section
          id="archive"
          className="shell section archive-panel"
          variants={sectionVariants}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
        >
          <div className="section-heading">
            <p className="eyebrow eyebrow-dark">Archive</p>
            <SplitHeading text="記事と受賞" />
            <p className="section-intro">
              公開記事と受賞歴をまとめて見られるようにしています。
            </p>
          </div>

          <div className="archive-grid">
            <motion.div className="archive-column" variants={groupVariants}>
              <div className="subsection-heading">
                <p className="card-label">Articles</p>
                <h3>Elchika に残している記事</h3>
              </div>

              <div className="publication-grid">
                {publicationTimeline.map((entry) => (
                  <MotionCardShell key={entry.id}>
                    <article
                      className={`publication-card ${entry.awards.length > 0 ? "award-accent-card" : ""}`}
                    >
                      <div className="publication-meta">
                        <span>{entry.dateLabel}</span>
                        <a href={entry.href} target="_blank" rel="noreferrer">
                          Read
                        </a>
                      </div>
                      <h3>{entry.title}</h3>
                      <p>{entry.summary}</p>
                      <div className="tag-row">
                        {entry.tags.map((tag) => (
                          <span key={tag} className="tag tag-light">
                            {tag}
                          </span>
                        ))}
                      </div>
                      {entry.awards.length > 0 && (
                        <div className="award-strip-list">
                          {entry.awards.map((award) => (
                            <span key={award} className="award-strip">
                              {award}
                            </span>
                          ))}
                        </div>
                      )}
                    </article>
                  </MotionCardShell>
                ))}
              </div>
            </motion.div>

            <motion.div className="archive-column" variants={groupVariants}>
              <div className="subsection-heading">
                <p className="card-label">Recognition</p>
                <h3>受賞の記録</h3>
              </div>

              <div className="recognition-grid">
                {recognitions.map((recognition) => (
                  <MotionCardShell
                    key={`${recognition.year}-${recognition.award}`}
                  >
                    <article className="recognition-card award-accent-card">
                      <div className="publication-meta">
                        <span>{recognition.year}</span>
                        <a
                          href={recognition.href}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Source
                        </a>
                      </div>
                      <h3>{recognition.award}</h3>
                      <p className="recognition-project">{recognition.project}</p>
                      <p>{recognition.note}</p>
                      <span className="recognition-org">
                        {recognition.organization}
                      </span>
                    </article>
                  </MotionCardShell>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.section>

        <motion.section
          className="shell section dark-panel"
          variants={sectionVariants}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
        >
          <div className="section-heading section-heading-inverse">
            <p className="eyebrow">{siteAxis.label}</p>
            <SplitHeading text="研究の軸" />
            <p className="section-intro">{siteAxis.summary}</p>
          </div>

          <motion.div className="axis-flow" variants={groupVariants}>
            {siteAxis.steps.map((step, index) => (
              <motion.article
                key={step.en}
                className="axis-step"
                variants={itemVariants}
                whileHover={
                  reduceMotion
                    ? undefined
                    : {
                        y: -8,
                        scale: 1.012,
                      }
                }
                transition={{
                  type: "spring",
                  stiffness: 240,
                  damping: 20,
                  mass: 0.88,
                  delay: index * 0.04,
                }}
              >
                <span className="axis-step-index">0{index + 1}</span>
                <div className="axis-step-heading">
                  <strong>{step.en}</strong>
                  <span>{step.ja}</span>
                </div>
                <p className="axis-step-copy">{step.description}</p>
              </motion.article>
            ))}
          </motion.div>
        </motion.section>

        <motion.section
          className="shell section dark-panel"
          variants={sectionVariants}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
        >
          <div className="section-heading section-heading-inverse">
            <p className="eyebrow">Platforms</p>
            <SplitHeading text="話を聞きたい方へ" />
            <p className="section-intro">
              実装、記事、プロフィールの入口をここに集約しています。
            </p>
          </div>

          <motion.div className="platform-grid-light" variants={groupVariants}>
            {platformLinks.map((platform) => (
              <motion.a
                key={platform.label}
                href={platform.href}
                className="platform-card-dark"
                variants={itemVariants}
                whileHover={
                  reduceMotion
                    ? undefined
                    : {
                        y: -10,
                        scale: 1.015,
                      }
                }
                transition={{
                  type: "spring",
                  stiffness: 240,
                  damping: 20,
                  mass: 0.8,
                }}
                target="_blank"
                rel="noreferrer"
              >
                <span className="quick-link-label">{platform.label}</span>
                <strong>{platform.description}</strong>
                <p>{platform.detail}</p>
              </motion.a>
            ))}
          </motion.div>
        </motion.section>
      </main>
    </>
  );
}
