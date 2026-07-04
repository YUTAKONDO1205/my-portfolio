"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { getArtworkStyle, getProjectArtwork } from "../artwork";
import { FrameSequenceHero } from "./frame-sequence-hero";
import { AwardsStrip } from "./awards-strip";
import { ImpactDashboard } from "./impact-dashboard";
import { PositioningSection } from "./positioning-section";
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

/* margin-based trigger: fires as soon as the element's top clears the bottom
   edge minus 90px — unlike a fractional `amount`, this stays satisfiable for
   sections taller than the viewport (small screens). */
const revealViewport = { once: true, margin: "0px 0px -90px 0px" } as const;

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 44, filter: "blur(14px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: easeOut },
  },
};

const groupVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07, delayChildren: 0.08 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.97, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.68, ease: easeOut },
  },
};

const charVariants: Variants = {
  hidden: { opacity: 0, y: "0.42em", filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: "0em",
    filter: "blur(0px)",
    transition: { duration: 0.56, ease: easeOut },
  },
};

const hoverLift = {
  y: -8,
  scale: 1.012,
  transition: { type: "spring", stiffness: 240, damping: 20 },
} as const;

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

/* Per-character heading reveal — restored from the pre-rewrite design. */
function SplitHeading({ text }: { text: string }) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <h2>{text}</h2>;
  }

  return (
    <motion.h2
      aria-label={text}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.024 } },
      }}
    >
      {Array.from(text).map((char, index) =>
        char === " " || char === "　" ? (
          <span
            key={`${char}-${index}`}
            className="heading-char-space"
            aria-hidden="true"
          />
        ) : (
          <motion.span
            key={`${char}-${index}`}
            className="heading-char"
            aria-hidden="true"
            variants={charVariants}
          >
            {char}
          </motion.span>
        ),
      )}
    </motion.h2>
  );
}

/* Count-up numerals for the proof strip — restored utility. */
function AnimatedCount({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        observer.disconnect();
        const started = performance.now();
        const duration = 1300;
        const step = (now: number) => {
          const t = Math.min(1, (now - started) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          el.textContent = String(Math.round(eased * value));
          if (t < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
      },
      { threshold: 0.5 },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, reduceMotion]);

  return <span ref={ref}>{value}</span>;
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
      <SplitHeading text={title} />
      <span>{body}</span>
    </div>
  );
}

const MARQUEE_WORDS = [
  "Sense",
  "Decide",
  "Share",
  "Edge AI",
  "Embedded",
  "Local First",
] as const;

function MarqueeInterlude() {
  // 8 copies ≈ 5300px track — one half must exceed the widest supported
  // viewport for the translateX(-50%) loop to stay seamless at 4K.
  const sequence = Array.from({ length: 8 }, () => MARQUEE_WORDS).flat();
  return (
    <div className="interlude-marquee" aria-hidden="true">
      <div className="marquee">
        <div className="marquee-track">
          {sequence.flatMap((word, index) => [
            <span key={`${word}-${index}`}>
              {index % 6 === 3 || index % 6 === 5 ? <em>{word}</em> : word}
            </span>,
            <span
              key={`dot-${word}-${index}`}
              className="marquee-dot"
              aria-hidden="true"
            />,
          ])}
        </div>
      </div>
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

  const cardHover = reduceMotion ? undefined : hoverLift;

  return (
    <>
      <div id="top" />
      <FrameSequenceHero />

      <main className={styles.home}>
        {/* Social proof rail — restored, directly under the hero (full-bleed) */}
        <AwardsStrip awards={awardBadges} />

        <motion.section
          className={`${styles.shell} ${styles.proofSection}`}
          variants={sectionVariants}
          initial="hidden"
          whileInView="show"
          viewport={revealViewport}
        >
          <div className={styles.proofLead}>
            <p>Field-ready portfolio</p>
            <h2>研究、実装、公開までをひとつの流れとして見せる。</h2>
          </div>
          <div className={styles.proofGrid}>
            <div>
              <strong>
                <AnimatedCount value={recognitions.length} />
              </strong>
              <span>受賞・採択・発表</span>
            </div>
            <div>
              <strong>
                <AnimatedCount value={researchProjects.length} />
              </strong>
              <span>公開研究テーマ</span>
            </div>
            <div>
              <strong>
                <AnimatedCount value={liveChannels.length} />
              </strong>
              <span>プロダクト配布面</span>
            </div>
            <div>
              <strong>
                <AnimatedCount value={publicationTimeline.length} />
              </strong>
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
          viewport={revealViewport}
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
            viewport={revealViewport}
          >
            {selectedWorks.map((work) => (
              <motion.article
                key={work.slug}
                className={`${styles.workCard} ${
                  work.feature ? styles.workCardFeature : ""
                } ${themeClassName(work.themeClass)}`}
                variants={itemVariants}
                whileHover={cardHover}
              >
                <a href={work.href} target="_blank" rel="noreferrer">
                  <span className={styles.cardMeta}>{work.category}</span>
                  <h3>
                    {work.feature && !reduceMotion ? (
                      <span className="glitch-text" data-text={work.title}>
                        {work.title}
                      </span>
                    ) : (
                      work.title
                    )}
                  </h3>
                  <p className={styles.cardSubtitle}>{work.subtitle}</p>
                  <p>{work.summary}</p>
                </a>

                {work.highlights && (
                  <ul className={styles.highlights}>
                    {work.highlights
                      .slice(0, work.feature ? 4 : 2)
                      .map((line) => (
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
                        data-status={channel.status ?? "live"}
                      >
                        <i aria-hidden="true" />
                        {channel.label}
                        {channel.status === "pending" ? "（申請中）" : ""}
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

        <MarqueeInterlude />

        <motion.section
          id="research"
          className={`${styles.shell} ${styles.section}`}
          variants={sectionVariants}
          initial="hidden"
          whileInView="show"
          viewport={revealViewport}
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
            viewport={revealViewport}
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
                  whileHover={cardHover}
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

        {/* Sense → Decide → Share pipeline — restored axis flow */}
        <motion.section
          className={`${styles.shell} ${styles.section}`}
          variants={sectionVariants}
          initial="hidden"
          whileInView="show"
          viewport={revealViewport}
        >
          <SectionHeader
            eyebrow={siteAxis.label}
            title="Sense → Decide → Share"
            body={siteAxis.detail}
          />
          <motion.div
            className="axis-flow"
            variants={groupVariants}
            initial="hidden"
            whileInView="show"
            viewport={revealViewport}
          >
            {siteAxis.steps.map((step, index) => (
              <motion.article
                key={step.en}
                className="axis-step"
                variants={itemVariants}
                whileHover={cardHover}
              >
                <span className="axis-step-index">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="axis-step-heading">
                  <strong>{step.en}</strong>
                  <span>{step.ja}</span>
                </div>
                <p className="axis-step-copy">{step.description}</p>
              </motion.article>
            ))}
          </motion.div>
        </motion.section>

        {/* Pentagon radar — restored interactive positioning */}
        <div className={`${styles.shell} ${styles.section}`}>
          <PositioningSection positioning={positioning} />
        </div>

        {/* Data room — restored impact dashboard as a night panel */}
        <div className={`${styles.shell} ${styles.section}`}>
          <ImpactDashboard
            publications={publicationTimeline}
            recognitions={recognitions}
            research={researchProjects}
            works={selectedWorks}
          />
        </div>

        <motion.section
          className={`${styles.shell} ${styles.section}`}
          variants={sectionVariants}
          initial="hidden"
          whileInView="show"
          viewport={revealViewport}
        >
          <SectionHeader
            eyebrow="Recognition Archive"
            title="外部評価と公開ログ"
            body="研究記事、コンテスト、学会発表、セキュリティ育成プログラムまで、公開された実績を年表として追えるようにしています。"
          />

          <motion.div
            className={styles.archiveGrid}
            variants={groupVariants}
            initial="hidden"
            whileInView="show"
            viewport={revealViewport}
          >
            <div className={styles.archiveColumn}>
              <h3>Articles</h3>
              {publicationTimeline.map((entry) => (
                <motion.a
                  key={entry.id}
                  className={styles.archiveItem}
                  href={entry.href}
                  target="_blank"
                  rel="noreferrer"
                  variants={itemVariants}
                >
                  <span>{entry.dateLabel}</span>
                  <strong>{entry.title}</strong>
                  <p>{entry.summary}</p>
                </motion.a>
              ))}
            </div>

            <div className={styles.archiveColumn}>
              <h3>Awards</h3>
              {awardBadges.slice(0, 6).map((award) => (
                <motion.a
                  key={`${award.year}-${award.organization}-${award.award}`}
                  className={styles.archiveItem}
                  href={award.href}
                  target="_blank"
                  rel="noreferrer"
                  variants={itemVariants}
                >
                  <span>{award.year}</span>
                  <strong>{award.award}</strong>
                  <p>{award.organization}</p>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </motion.section>

        {/* Contact — night panel finale */}
        <motion.section
          id="contact"
          className={`${styles.shell} ${styles.contactSection}`}
          variants={sectionVariants}
          initial="hidden"
          whileInView="show"
          viewport={revealViewport}
        >
          <div className={styles.contactCopy}>
            <p>Contact — {philosophy.label}</p>
            <h2>{philosophy.title}</h2>
            <span>{philosophy.body}</span>
            <em className={styles.contactHint}>
              お仕事・研究のご相談は LinkedIn または GitHub からお気軽にどうぞ。
            </em>
          </div>

          <div className={styles.platformGrid}>
            {platformLinks.map((platform) => (
              <motion.a
                key={platform.label}
                href={platform.href}
                target="_blank"
                rel="noreferrer"
                whileHover={cardHover}
              >
                <span>{platform.label}</span>
                <strong>{platform.description}</strong>
                <p>{platform.detail}</p>
              </motion.a>
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
