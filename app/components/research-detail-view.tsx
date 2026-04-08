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
import type { ResearchProject } from "../portfolio-data";

type ResearchDetailViewProps = {
  project: ResearchProject;
  otherProjects: readonly ResearchProject[];
};

const easeOutExpo = [0.22, 1, 0.36, 1] as const;
const viewport = { once: true, amount: 0.2 } as const;

const sectionVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 56,
    filter: "blur(16px)",
  },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.8,
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
    y: 34,
    scale: 0.965,
    filter: "blur(10px)",
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

function MotionCardShell({
  children,
}: PropsWithChildren) {
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
              scale: 1.016,
            }
      }
      transition={{
        type: "spring",
        stiffness: 240,
        damping: 21,
        mass: 0.82,
      }}
    >
      {children}
    </motion.div>
  );
}

export function ResearchDetailView({
  project,
  otherProjects,
}: ResearchDetailViewProps) {
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();

  const copyY = useTransform(scrollY, [0, 640], [0, 76]);
  const copyOpacity = useTransform(scrollY, [0, 640], [1, 0.78]);
  const photoX = useTransform(scrollY, [0, 640], [0, -36]);
  const photoScale = useTransform(scrollY, [0, 640], [1.04, 1.12]);
  const visualY = useTransform(scrollY, [0, 640], [0, -40]);
  const visualRotate = useTransform(scrollY, [0, 640], [0, -2.4]);
  const coreScale = useTransform(scrollY, [0, 640], [1, 1.06]);

  return (
    <main className={`project-site ${project.themeClass}`}>
      <motion.section className="shell project-hero">
        <motion.div
          className={`project-hero-photo ${project.ambientClass}`}
          aria-hidden="true"
          style={reduceMotion ? undefined : { x: photoX, scale: photoScale }}
        />

        <motion.div
          className="project-hero-topbar"
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: easeOutExpo }}
        >
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/research">Research</Link>
          <span>/</span>
          <span>{project.title}</span>
        </motion.div>

        <div className="project-hero-grid">
          <motion.div
            className="project-hero-copy"
            style={reduceMotion ? undefined : { y: copyY, opacity: copyOpacity }}
          >
            <motion.p
              className="eyebrow"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.56, ease: easeOutExpo, delay: 0.08 }}
            >
              {project.heroKicker}
            </motion.p>
            <motion.h1
              initial={{
                opacity: 0,
                y: 56,
                rotateX: reduceMotion ? 0 : -56,
              }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.92, ease: easeOutExpo, delay: 0.18 }}
              style={reduceMotion ? undefined : { transformPerspective: 1200 }}
            >
              {project.title}
            </motion.h1>
            <motion.p
              className="project-hero-subtitle"
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.64, ease: easeOutExpo, delay: 0.28 }}
            >
              {project.subtitle}
            </motion.p>
            <motion.p
              className="project-hero-summary"
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.74, ease: easeOutExpo, delay: 0.36 }}
            >
              {project.pageSummary}
            </motion.p>
            <motion.p
              className="project-hero-english"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.62, ease: easeOutExpo, delay: 0.46 }}
            >
              {project.heroEnglish}
            </motion.p>

            <motion.div
              className="hero-actions"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.66, ease: easeOutExpo, delay: 0.52 }}
            >
              <Link href="/research" className="button-link button-link-primary">
                研究一覧へ戻る
              </Link>
              {project.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="button-link button-link-secondary"
                  target="_blank"
                  rel="noreferrer"
                >
                  {link.label}
                </a>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            className="project-visual"
            style={reduceMotion ? undefined : { y: visualY, rotate: visualRotate }}
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.88, ease: easeOutExpo, delay: 0.22 }}
          >
            <div className={`project-visual-photo ${project.ambientClass}`} aria-hidden="true" />
            <motion.div
              className="project-visual-core-shell"
              style={reduceMotion ? undefined : { scale: coreScale }}
            >
              <div className="project-visual-core">
                <span>{project.year}</span>
                <strong>{project.heroKicker}</strong>
              </div>
            </motion.div>
            <div className="project-visual-layer project-visual-layer-a" />
            <div className="project-visual-layer project-visual-layer-b" />
            <div className="project-visual-layer project-visual-layer-c" />
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        className="shell section project-content-panel"
        variants={sectionVariants}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
      >
        <motion.div className="tag-row" variants={groupVariants}>
          {project.tags.map((tag) => (
            <motion.span key={tag} className="tag project-tag" variants={itemVariants}>
              {tag}
            </motion.span>
          ))}
        </motion.div>

        <motion.div className="project-story-grid" variants={groupVariants}>
          {project.sections.map((section, index) => (
            <MotionCardShell key={section.title}>
              <article className="project-story-card">
                <p className="project-story-index">0{index + 1}</p>
                <h2>{section.title}</h2>
                <p>{section.body}</p>
              </article>
            </MotionCardShell>
          ))}
        </motion.div>
      </motion.section>

      <motion.section
        className="shell section project-content-panel project-content-panel-alt"
        variants={sectionVariants}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
      >
        <div className="section-heading">
          <p className="eyebrow eyebrow-dark">Highlights</p>
          <h2>ポイント</h2>
        </div>

        <motion.div className="project-highlight-grid" variants={groupVariants}>
          {project.highlights.map((highlight, index) => (
            <motion.article
              key={highlight}
              className="project-highlight-card"
              variants={itemVariants}
              whileHover={
                reduceMotion
                  ? undefined
                  : {
                      y: -8,
                      scale: 1.016,
                    }
              }
              transition={{
                type: "spring",
                stiffness: 240,
                damping: 20,
                mass: 0.8,
                delay: index * 0.04,
              }}
            >
              <span className="project-highlight-index">0{index + 1}</span>
              <p>{highlight}</p>
            </motion.article>
          ))}
        </motion.div>
      </motion.section>

      <motion.section
        className="shell section project-content-panel"
        variants={sectionVariants}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
      >
        <div className="section-heading">
          <p className="eyebrow eyebrow-dark">Other Projects</p>
          <h2>ほかの研究</h2>
        </div>

        <motion.div className="project-mini-grid" variants={groupVariants}>
          {otherProjects.map((candidate) => (
            <motion.div
              key={candidate.slug}
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
                damping: 21,
                mass: 0.82,
              }}
            >
              <Link
                href={`/research/${candidate.slug}`}
                className={`project-mini-card ${candidate.themeClass}`}
              >
                <div
                  className={`project-mini-photo ${candidate.ambientClass}`}
                  aria-hidden="true"
                />
                <span className="quick-link-label">{candidate.heroKicker}</span>
                <strong>{candidate.title}</strong>
                <p>{candidate.cardSummary}</p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>
    </main>
  );
}
