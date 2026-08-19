"use client";

import type { PropsWithChildren } from "react";
import Link from "next/link";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "motion/react";
import {
  getArtworkStyle,
  getProjectArtwork,
  researchHeroArtwork,
} from "../artwork";
import type {
  PlatformLink,
  PublicationEntry,
  Recognition,
  ResearchProject,
  SiteAxis,
} from "../portfolio-data";

type ResearchPageViewProps = {
  platformLinks: readonly PlatformLink[];
  publicationTimeline: readonly PublicationEntry[];
  recognitions: readonly Recognition[];
  researchProjects: readonly ResearchProject[];
  siteAxis: SiteAxis;
};

const easeOutExpo = [0.22, 1, 0.36, 1] as const;
const viewport = { once: true, amount: 0.22 } as const;

/* Latin project names like "Eltres_CO2_Mapping" have no natural break
   points — insert zero-width spaces after underscores so wrapping happens
   there instead of orphaning a single character. */
function softBreakTitle(title: string) {
  return title.replace(/_/g, "_​");
}

const sectionVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 52,
    filter: "blur(15px)",
  },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.76,
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
    y: 32,
    scale: 0.965,
    filter: "blur(10px)",
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.66,
      ease: easeOutExpo,
    },
  },
};

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
        mass: 0.82,
      }}
    >
      {children}
    </motion.div>
  );
}

export function ResearchPageView({
  platformLinks,
  publicationTimeline,
  recognitions,
  researchProjects,
  siteAxis,
}: ResearchPageViewProps) {
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();

  const heroY = useTransform(scrollY, [0, 620], [0, 74]);
  const heroOpacity = useTransform(scrollY, [0, 620], [1, 0.76]);
  const chipsY = useTransform(scrollY, [0, 620], [0, -26]);

  return (
    <main className="research-page">
      <motion.section className="shell base-hero base-hero-compact">
        <motion.div
          className="hero-ambient hero-ambient-left ambient-clouds"
          aria-hidden="true"
        />
        <div
          className="artwork-layer research-feature-artwork"
          style={getArtworkStyle(researchHeroArtwork)}
          aria-hidden="true"
        />
        <motion.div
          className="hero-ambient hero-ambient-right ambient-machine"
          aria-hidden="true"
        />

        <motion.header
          className="landing-header"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: easeOutExpo }}
        >
          <div>
            <p className="site-mark">研究インデックス</p>
            <p className="site-caption">Sense / Decide / Share</p>
          </div>

          <nav className="hero-nav" aria-label="研究ページナビゲーション">
            <Link href="/">ホーム</Link>
            <a href="#project-sites">研究テーマ</a>
            <a href="#research-archive">アーカイブ</a>
          </nav>
        </motion.header>

        <motion.div
          className="base-hero-copy base-hero-copy-wide"
          style={reduceMotion ? undefined : { y: heroY, opacity: heroOpacity }}
        >
          <motion.p
            className="eyebrow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.54, ease: easeOutExpo, delay: 0.08 }}
          >
            研究
          </motion.p>
          <motion.h1
            className="base-hero-title"
            initial={{
              opacity: 0,
              y: 48,
              rotateX: reduceMotion ? 0 : -50,
            }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.84, ease: easeOutExpo, delay: 0.18 }}
            style={reduceMotion ? undefined : { transformPerspective: 1200 }}
          >
            公開中の研究
          </motion.h1>
          <motion.p
            className="base-hero-lead"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.72, ease: easeOutExpo, delay: 0.28 }}
          >
            公開している研究を一覧できるページです。各研究の役割を概観し、
            詳しい説明や実装はそれぞれの個別ページで確認できます。
          </motion.p>

          <motion.div
            className="research-axis-strip"
            aria-label="サイトの軸"
            variants={groupVariants}
            initial="hidden"
            animate="show"
            style={reduceMotion ? undefined : { y: chipsY }}
          >
            {siteAxis.steps.map((step) => (
              <motion.div
                key={step.en}
                className="research-axis-chip"
                variants={itemVariants}
                whileHover={
                  reduceMotion
                    ? undefined
                    : {
                        y: -8,
                        scale: 1.018,
                      }
                }
                transition={{
                  type: "spring",
                  stiffness: 220,
                  damping: 20,
                  mass: 0.8,
                }}
              >
                <strong>{step.en}</strong>
                <span>{step.ja}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.section>

      <motion.section
        id="project-sites"
        className="shell section dark-panel"
        variants={sectionVariants}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
      >
        <div className="section-heading section-heading-inverse">
          <p className="eyebrow">プロジェクト</p>
          <h2>研究から見る</h2>
          <p className="section-intro">
            それぞれの研究は個別ページで、背景から構成まで詳しく紹介しています。
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
                      {project.heroKicker}
                    </p>
                    <h3>{softBreakTitle(project.title)}</h3>
                    <p className="project-preview-subtitle">
                      {project.subtitle}
                    </p>
                    <p className="project-preview-summary">
                      {project.cardSummary}
                    </p>
                    <div className="tag-row">
                      {project.tags.slice(0, 5).map((tag) => (
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
        id="research-archive"
        className="shell section archive-panel"
        variants={sectionVariants}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
      >
        <div className="section-heading">
          <p className="eyebrow eyebrow-dark">アーカイブ</p>
          <h2>記事と受賞</h2>
          <p className="section-intro">
            公開記事と外部評価を、研究全体の流れとしてまとめています。
          </p>
        </div>

        <div className="archive-grid">
          <motion.div className="archive-column" variants={groupVariants}>
            <div className="subsection-heading">
              <p className="card-label">記事</p>
              <h3>Elchika の公開記事</h3>
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
                        記事を読む
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
              <p className="card-label">受賞</p>
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
                        詳細を見る
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
          <p className="eyebrow">活動の入口</p>
          <h2>公開先</h2>
          <p className="section-intro">
            実装、記事、活動の窓口をここにまとめています。
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
  );
}
