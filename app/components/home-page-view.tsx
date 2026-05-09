"use client";

import { type PropsWithChildren } from "react";
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
  homeHeroArtwork,
} from "../artwork";
import type {
  Philosophy,
  PlatformLink,
  PublicationEntry,
  Recognition,
  ResearchProject,
  SelectedWork,
  SiteAxis,
} from "../portfolio-data";

type HomePageViewProps = {
  platformLinks: readonly PlatformLink[];
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

export function HomePageView({
  platformLinks,
  publicationTimeline,
  recognitions,
  researchProjects,
  selectedWorks,
  siteAxis,
  philosophy,
}: HomePageViewProps) {
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();

  const copyY = useTransform(scrollY, [0, 720], [0, 92]);
  const copyOpacity = useTransform(scrollY, [0, 720], [1, 0.72]);
  const stageY = useTransform(scrollY, [0, 720], [0, -68]);
  const bandY = useTransform(scrollY, [0, 720], [0, -28]);

  return (
    <main className="portfolio-home">
      <motion.section className="shell base-hero">
        <motion.div
          className="hero-ambient hero-ambient-left ambient-clouds"
          aria-hidden="true"
        />
        <div
          className="artwork-layer hero-feature-artwork"
          style={getArtworkStyle(homeHeroArtwork)}
          aria-hidden="true"
        />
        <motion.div
          className="hero-ambient hero-ambient-right ambient-tunnel"
          aria-hidden="true"
        />

        <motion.header
          className="landing-header"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.72, ease: easeOutExpo }}
        >
          <div>
            <p className="site-mark">Yuta Kondo</p>
            <p className="site-caption">Sense / Decide / Share</p>
          </div>

          <nav className="hero-nav" aria-label="サイト内ナビゲーション">
            <Link href="/research">Research</Link>
            <a href="#projects">Projects</a>
            <a href="#works">Works</a>
            <a href="#archive">Archive</a>
            <a href="#philosophy">Philosophy</a>
          </nav>
        </motion.header>

        <div className="base-hero-grid">
          <motion.div
            className="base-hero-copy"
            style={
              reduceMotion ? undefined : { y: copyY, opacity: copyOpacity }
            }
          >
            <motion.p
              className="eyebrow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.56, ease: easeOutExpo, delay: 0.08 }}
            >
              Portfolio
            </motion.p>
            <motion.p
              className="hero-personal"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.62, ease: easeOutExpo, delay: 0.14 }}
            >
              近藤悠太の紹介サイト
            </motion.p>
            <motion.h1
              className="base-hero-title"
              style={reduceMotion ? undefined : { transformPerspective: 1200 }}
            >
              {["現場の信号を", "判断と公開へ", "つないでいく"].map(
                (line, index) => (
                  <motion.span
                    key={line}
                    initial={
                      reduceMotion
                        ? { opacity: 0 }
                        : {
                            opacity: 0,
                            y: 64,
                            rotateX: -66,
                          }
                    }
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{
                      duration: 0.92,
                      ease: easeOutExpo,
                      delay: 0.18 + index * 0.1,
                    }}
                  >
                    {line}
                  </motion.span>
                ),
              )}
            </motion.h1>
            <motion.p
              className="base-hero-lead"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.74, ease: easeOutExpo, delay: 0.34 }}
            >
              画像、振動、音響を現場で取り、SPRESENSE 級で判断し、 GitHub と
              Elchika で公開しています。
              研究ごとのサイトから、その流れを順にたどれます。
            </motion.p>

            <motion.div
              className="hero-actions"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.64, ease: easeOutExpo, delay: 0.44 }}
            >
              <Link
                href="/research"
                className="button-link button-link-primary"
              >
                研究一覧を見る
              </Link>
              <a
                href="https://github.com/YUTAKONDO1205"
                className="button-link button-link-secondary"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            className="hero-stage"
            aria-label="研究テーマのプレビュー"
            style={reduceMotion ? undefined : { y: stageY }}
            variants={groupVariants}
            initial="hidden"
            animate="show"
          >
            {researchProjects.map((project) => (
              <motion.div
                key={project.slug}
                variants={itemVariants}
                className="motion-card-shell"
                whileHover={
                  reduceMotion
                    ? undefined
                    : {
                        y: -12,
                        scale: 1.02,
                      }
                }
                transition={{
                  type: "spring",
                  stiffness: 220,
                  damping: 20,
                  mass: 0.9,
                }}
              >
                <Link
                  href={`/research/${project.slug}`}
                  className={`hero-stage-card ${project.themeClass}`}
                >
                  <span className="quick-link-label">{project.heroKicker}</span>
                  <strong>{project.title}</strong>
                  <p>{project.subtitle}</p>
                  <span className="hero-stage-card-cta">詳しく見る</span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div
          className="hero-band"
          style={reduceMotion ? undefined : { y: bandY }}
          variants={groupVariants}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={itemVariants} className="hero-band-item">
            <span className="quick-link-label">Publications</span>
            <strong>{publicationTimeline.length}</strong>
            <p>Elchika に継続公開</p>
          </motion.div>
          <motion.div variants={itemVariants} className="hero-band-item">
            <span className="quick-link-label">Recognitions</span>
            <strong>{recognitions.length}</strong>
            <p>受賞・評価の記録</p>
          </motion.div>
          <motion.div variants={itemVariants} className="hero-band-item">
            <span className="quick-link-label">Research Themes</span>
            <strong>{researchProjects.length}</strong>
            <p>個別ページで展開</p>
          </motion.div>
        </motion.div>

        <div className="marquee" aria-hidden="true">
          <div className="marquee-track">
            <span>Sense</span>
            <span className="marquee-dot" />
            <em>現場で拾う</em>
            <span className="marquee-dot" />
            <span>Decide</span>
            <span className="marquee-dot" />
            <em>軽量に判断</em>
            <span className="marquee-dot" />
            <span>Share</span>
            <span className="marquee-dot" />
            <em>公開して次へ</em>
            <span className="marquee-dot" />
            <span>Sense</span>
            <span className="marquee-dot" />
            <em>現場で拾う</em>
            <span className="marquee-dot" />
            <span>Decide</span>
            <span className="marquee-dot" />
            <em>軽量に判断</em>
            <span className="marquee-dot" />
            <span>Share</span>
            <span className="marquee-dot" />
            <em>公開して次へ</em>
            <span className="marquee-dot" />
          </div>
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
          <h2>研究の軸</h2>
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
        id="projects"
        className="shell section dark-panel"
        variants={sectionVariants}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
      >
        <div className="section-heading section-heading-inverse">
          <p className="eyebrow">Project Sites</p>
          <h2>研究テーマ</h2>
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
          <p className="eyebrow">Selected Works</p>
          <h2>研究の外で作っているもの</h2>
          <p className="section-intro">
            エッジ AI 研究と並行して、セキュリティ、LLM マルチエージェント、業務システムまで横断的に手を動かしています。
          </p>
        </div>

        <motion.div className="selected-works-grid" variants={groupVariants}>
          {selectedWorks.map((work) => (
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
          ))}
        </motion.div>
      </motion.section>

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
          <h2>記事と受賞</h2>
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
        id="philosophy"
        className="shell section dark-panel"
        variants={sectionVariants}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
      >
        <div className="section-heading section-heading-inverse">
          <p className="eyebrow">{philosophy.label}</p>
          <h2>{philosophy.title}</h2>
        </div>

        <div className="philosophy-panel">
          <p>{philosophy.body}</p>
          <p className="philosophy-english">{philosophy.english}</p>
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
          <p className="eyebrow">Platforms</p>
          <h2>公開先</h2>
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
  );
}
