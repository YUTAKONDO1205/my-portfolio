"use client";

import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { getArtworkStyle, getProjectArtwork } from "../artwork";
import { FrameSequenceHero } from "./frame-sequence-hero";
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
import styles from "./home-page-view.module.css";

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

const easeOut = [0.22, 1, 0.36, 1] as const;

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.64, ease: easeOut },
  },
};

const groupVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06, delayChildren: 0.08 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.52, ease: easeOut },
  },
};

function themeClassName(themeClass: ResearchProject["themeClass"]) {
  switch (themeClass) {
    case "theme-drone":
      return styles.themeDrone;
    case "theme-pdm":
      return styles.themePdm;
    case "theme-anomaly":
      return styles.themeAnomaly;
    case "theme-eltres":
      return styles.themeEltres;
  }
}

function SectionHeader({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <div className={styles.sectionHeader}>
      <p>{eyebrow}</p>
      <h2>{title}</h2>
      <span>{body}</span>
    </div>
  );
}

export function HomePageView({
  awardBadges,
  platformLinks,
  positioning,
  publicationTimeline,
  recognitions,
  researchProjects,
  selectedWorks,
  siteAxis,
  philosophy,
}: HomePageViewProps) {
  const reduceMotion = useReducedMotion();
  const liveChannels = selectedWorks.flatMap((work) => work.distribution ?? []);
  const featuredWorks = selectedWorks.filter((work) => work.feature);

  const hoverLift = reduceMotion
    ? undefined
    : {
        y: -4,
      };

  return (
    <>
      <div id="top" />
      <FrameSequenceHero />

      <main className={styles.home}>
        <motion.section
          className={`${styles.shell} ${styles.proofSection}`}
          variants={sectionVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.24 }}
        >
          <div className={styles.proofLead}>
            <p>Field-ready portfolio</p>
            <h2>研究、実装、公開までをひとつの流れとして見せる。</h2>
          </div>
          <div className={styles.proofGrid}>
            <div>
              <strong>{recognitions.length}</strong>
              <span>受賞・採択・発表</span>
            </div>
            <div>
              <strong>{researchProjects.length}</strong>
              <span>公開研究テーマ</span>
            </div>
            <div>
              <strong>{liveChannels.length}</strong>
              <span>プロダクト配布面</span>
            </div>
            <div>
              <strong>{publicationTimeline.length}</strong>
              <span>技術記事</span>
            </div>
          </div>
        </motion.section>

        <motion.section
          id="works"
          className={`${styles.shell} ${styles.section}`}
          variants={sectionVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.16 }}
        >
          <SectionHeader
            eyebrow="Shipped Work"
            title="動くものとして届いている制作物"
            body="公開リポジトリだけでなく、Marketplace、拡張機能、運用ワークフローまで届く形にした制作を前面に出しています。"
          />

          <motion.div
            className={styles.workGrid}
            variants={groupVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.12 }}
          >
            {selectedWorks.map((work) => (
              <motion.article
                key={work.slug}
                className={`${styles.workCard} ${
                  work.feature ? styles.workCardFeature : ""
                } ${themeClassName(work.themeClass)}`}
                variants={itemVariants}
                whileHover={hoverLift}
              >
                <a href={work.href} target="_blank" rel="noreferrer">
                  <span className={styles.cardMeta}>{work.category}</span>
                  <h3>{work.title}</h3>
                  <p className={styles.cardSubtitle}>{work.subtitle}</p>
                  <p>{work.summary}</p>
                </a>

                {work.highlights && (
                  <ul className={styles.highlights}>
                    {work.highlights.slice(0, work.feature ? 4 : 2).map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                )}

                {work.distribution && (
                  <div className={styles.channelRow}>
                    {work.distribution.map((channel) => (
                      <a
                        key={channel.label}
                        href={channel.href}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {channel.label}
                      </a>
                    ))}
                  </div>
                )}

                <div className={styles.tagRow}>
                  {work.tags.slice(0, 5).map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </motion.article>
            ))}
          </motion.div>
        </motion.section>

        <motion.section
          id="research"
          className={`${styles.shell} ${styles.section}`}
          variants={sectionVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.16 }}
        >
          <SectionHeader
            eyebrow="Research"
            title={siteAxis.title}
            body={siteAxis.summary}
          />

          <motion.div
            className={styles.researchGrid}
            variants={groupVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.12 }}
          >
            {researchProjects.map((project) => {
              const artworkStyle = getArtworkStyle(getProjectArtwork(project));

              return (
                <motion.article
                  key={project.slug}
                  className={`${styles.researchCard} ${themeClassName(
                    project.themeClass,
                  )}`}
                  variants={itemVariants}
                  whileHover={hoverLift}
                >
                  <Link href={`/research/${project.slug}`}>
                    <div className={styles.researchImageWrap} aria-hidden="true">
                      <div
                        className={styles.researchImage}
                        style={artworkStyle}
                      />
                    </div>
                    <span className={styles.cardMeta}>{project.year}</span>
                    <h3>{project.title}</h3>
                    <p className={styles.cardSubtitle}>{project.subtitle}</p>
                    <p>{project.cardSummary}</p>
                  </Link>
                  <div className={styles.tagRow}>
                    {project.tags.slice(0, 4).map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        </motion.section>

        <motion.section
          className={`${styles.shell} ${styles.positioningSection}`}
          variants={sectionVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.18 }}
        >
          <div className={styles.positioningCopy}>
            <p>{positioning.label}</p>
            <h2>{positioning.title}</h2>
            <span>{positioning.thesisJa}</span>
            <em>{positioning.thesisEn}</em>
          </div>
          <motion.div
            className={styles.axisList}
            variants={groupVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.18 }}
          >
            {positioning.axes.map((axis) => (
              <motion.article key={axis.key} variants={itemVariants}>
                <div className={styles.axisTopline}>
                  <strong>{axis.labelJa}</strong>
                  <span>{axis.score}/10</span>
                </div>
                <div
                  className={styles.axisTrack}
                  aria-label={`${axis.labelJa} ${axis.score} out of 10`}
                >
                  <span style={{ width: `${axis.score * 10}%` }} />
                </div>
                <p>{axis.evidence}</p>
              </motion.article>
            ))}
          </motion.div>
        </motion.section>

        <motion.section
          className={`${styles.shell} ${styles.section}`}
          variants={sectionVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.16 }}
        >
          <SectionHeader
            eyebrow="Recognition Archive"
            title="外部評価と公開ログ"
            body="研究記事、コンテスト、学会発表、セキュリティ育成プログラムまで、公開された実績を年表として追えるようにしています。"
          />

          <div className={styles.archiveGrid}>
            <div className={styles.archiveColumn}>
              <h3>Articles</h3>
              {publicationTimeline.map((entry) => (
                <a
                  key={entry.id}
                  className={styles.archiveItem}
                  href={entry.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span>{entry.dateLabel}</span>
                  <strong>{entry.title}</strong>
                  <p>{entry.summary}</p>
                </a>
              ))}
            </div>

            <div className={styles.archiveColumn}>
              <h3>Awards</h3>
              {awardBadges.slice(0, 6).map((award) => (
                <a
                  key={`${award.year}-${award.organization}-${award.award}`}
                  className={styles.archiveItem}
                  href={award.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span>{award.year}</span>
                  <strong>{award.award}</strong>
                  <p>{award.organization}</p>
                </a>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section
          id="contact"
          className={`${styles.shell} ${styles.contactSection}`}
          variants={sectionVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.18 }}
        >
          <div className={styles.contactCopy}>
            <p>{philosophy.label}</p>
            <h2>{philosophy.title}</h2>
            <span>{philosophy.body}</span>
          </div>

          <div className={styles.platformGrid}>
            {platformLinks.map((platform) => (
              <a
                key={platform.label}
                href={platform.href}
                target="_blank"
                rel="noreferrer"
              >
                <span>{platform.label}</span>
                <strong>{platform.description}</strong>
                <p>{platform.detail}</p>
              </a>
            ))}
          </div>
        </motion.section>

        {featuredWorks.length > 0 && (
          <section className={`${styles.shell} ${styles.footerNote}`}>
            <span>Featured shipping focus</span>
            <strong>{featuredWorks.map((work) => work.title).join(" / ")}</strong>
          </section>
        )}
      </main>
    </>
  );
}
