"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  type Variants,
} from "motion/react";
import { FrameSequenceHero } from "./frame-sequence-hero";
import { AwardsStrip } from "./awards-strip";
import { ImpactDashboard } from "./impact-dashboard";
import { PositioningSection } from "./positioning-section";
import { ResearchInstrument, instrumentModeFor } from "./research-instrument";
import { VibeGuardScan } from "./vibeguard-scan";
import { Ja, phrasesOf } from "./ja";
import { awardPrizeCount, vibeguardStats } from "../portfolio-data";
import type {
  AwardBadge,
  Philosophy,
  PlatformLink,
  Positioning,
  Profile,
  PublicationEntry,
  ResearchProject,
  SelectedWork,
  SiteAxis,
  Talk,
} from "../portfolio-data";
import styles from "./home-page-view.module.css";

type HomePageViewProps = {
  awardBadges: readonly AwardBadge[];
  platformLinks: readonly PlatformLink[];
  positioning: Positioning;
  profile: Profile;
  publicationTimeline: readonly PublicationEntry[];
  researchProjects: readonly ResearchProject[];
  selectedWorks: readonly SelectedWork[];
  siteAxis: SiteAxis;
  talks: readonly Talk[];
  philosophy: Philosophy;
};

const easeOut = [0.22, 1, 0.36, 1] as const;

/* margin-based trigger: fires as soon as the element's top clears the bottom
   edge minus 90px — unlike a fractional `amount`, this stays satisfiable for
   sections taller than the viewport (small screens). */
const revealViewport = { once: true, margin: "0px 0px -90px 0px" } as const;

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 92, filter: "blur(24px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1.05, ease: easeOut },
  },
};

const groupVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.11, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 62, scale: 0.9, filter: "blur(16px)" },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: easeOut },
  },
};

const charVariants: Variants = {
  hidden: { opacity: 0, y: "0.95em", filter: "blur(16px)" },
  show: {
    opacity: 1,
    y: "0em",
    filter: "blur(0px)",
    transition: { duration: 0.72, ease: easeOut },
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

/* Per-character heading reveal.
   Every character is its own inline-block span, which creates a line-break
   opportunity between each pair. Japanese wants most of those, but not all:
   because the characters are separate inline-block boxes rather than one text
   run, the browser's kinsoku (禁則処理) cannot apply, and a line happily starts
   with 、 or ends with 「. Latin has the opposite problem — an 78px headline
   would split as "De / cide".

   So the text is tokenized into units that must not be broken apart, and only
   the gaps between units stay breakable. */
type HeadingToken = { kind: "space" } | { kind: "unit"; text: string };

/* must not begin a line */
const NO_BREAK_BEFORE = new Set(
  Array.from(
    "、。，．・：；？！）〕］｝〉》」』】’”ゝゞヽヾーぁぃぅぇぉっゃゅょゎァィゥェォッャュョヮヵヶ々),.;:?!]}",
  ),
);

/* must not end a line */
const NO_BREAK_AFTER = new Set(Array.from("「（〔［｛〈《『【‘“([{"));

function tokenizeHeading(text: string): HeadingToken[] {
  const chars = Array.from(text);
  const tokens: HeadingToken[] = [];
  let latin = "";

  const flushLatin = () => {
    if (latin) {
      tokens.push({ kind: "unit", text: latin });
      latin = "";
    }
  };

  for (let i = 0; i < chars.length; i += 1) {
    const char = chars[i];

    if (/[A-Za-z0-9]/.test(char)) {
      latin += char;
      continue;
    }

    flushLatin();

    if (char === " " || char === "　") {
      tokens.push({ kind: "space" });
      continue;
    }

    let unit = char;
    // an opening bracket drags the character after it onto the same line
    while (NO_BREAK_AFTER.has(chars[i]) && i + 1 < chars.length) {
      i += 1;
      unit += chars[i];
    }
    // trailing punctuation stays with the character it follows
    while (i + 1 < chars.length && NO_BREAK_BEFORE.has(chars[i + 1])) {
      i += 1;
      unit += chars[i];
    }

    tokens.push({ kind: "unit", text: unit });
  }

  flushLatin();

  return tokens;
}

/* Phrase groups for the heading reveal. BudouX decides where a line may
   break; inside a group nothing breaks. A phrase too long to be safe on a
   phone is left breakable between units. */
type HeadingGroup =
  | "space"
  | { units: string[]; keepTogether: boolean };

const MAX_KEEP_TOGETHER = 9;

function headingGroups(text: string): HeadingGroup[] {
  const groups: HeadingGroup[] = [];

  for (const phrase of phrasesOf(text)) {
    let units: string[] = [];
    const flush = () => {
      if (units.length === 0) return;
      const length = units.reduce((n, u) => n + Array.from(u).length, 0);
      groups.push({ units, keepTogether: length <= MAX_KEEP_TOGETHER });
      units = [];
    };

    for (const token of tokenizeHeading(phrase)) {
      if (token.kind === "space") {
        flush();
        groups.push("space");
      } else {
        units.push(token.text);
      }
    }
    flush();
  }

  return groups;
}

function SplitHeading({ text }: { text: string }) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <h2>
        <Ja>{text}</Ja>
      </h2>
    );
  }

  return (
    <motion.h2
      aria-label={text}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.034 } },
      }}
    >
      {headingGroups(text).map((group, groupIndex) => {
        if (group === "space") {
          return (
            <span
              key={`space-${groupIndex}`}
              className="heading-char-space"
              aria-hidden="true"
            />
          );
        }

        // The animated element is the unit, not each character inside it. A
        // unit is a single CJK character (plus any punctuation that must not
        // be split from it) or one Latin word, so the reveal still reads as
        // per-character in 和文. Units are grouped by phrase, and the group
        // does not wrap, so a line can only break between phrases.
        const units = group.units.map((unit, unitIndex) => (
          <motion.span
            key={`unit-${groupIndex}-${unitIndex}`}
            className="heading-word heading-char"
            aria-hidden="true"
            variants={charVariants}
          >
            {unit}
          </motion.span>
        ));

        return group.keepTogether ? (
          <span
            key={`phrase-${groupIndex}`}
            className="heading-phrase"
            aria-hidden="true"
          >
            {units}
          </span>
        ) : (
          units
        );
      })}
    </motion.h2>
  );
}

/* Count-up numerals for the proof strip. */
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
      <span>
        <Ja>{body}</Ja>
      </span>
    </div>
  );
}

/* A ticker of facts, not slogans — every item is derived from the data the
   rest of the page is built from. */
function MarqueeInterlude({ items }: { items: readonly string[] }) {
  // 6 copies ≈ 5000px+ track — one half must exceed the widest supported
  // viewport for the translateX(-50%) loop to stay seamless at 4K.
  const sequence = Array.from({ length: 6 }, () => items).flat();
  return (
    <div className="interlude-marquee" aria-hidden="true">
      <div className="marquee">
        <div className="marquee-track">
          {sequence.flatMap((word, index) => [
            <span key={`${word}-${index}`}>
              {index % 3 === 1 ? <em>{word}</em> : word}
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

/* Talks — a real chronology, so it gets a real spine. The line draws itself
   as the list scrolls into view; each marker is the constellation's triangle,
   amber for a date still ahead. */
function TalksTimeline({ talks }: { talks: readonly Talk[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "end 60%"],
  });
  const spine = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    mass: 0.4,
  });

  return (
    <motion.ol
      ref={ref}
      className={styles.talkList}
      variants={groupVariants}
      initial="hidden"
      whileInView="show"
      viewport={revealViewport}
    >
      <motion.span
        className={styles.talkSpine}
        aria-hidden="true"
        style={{ scaleY: reduceMotion ? 1 : spine }}
      />
      {talks.map((talk) => (
        <motion.li
          key={talk.id}
          className={styles.talk}
          variants={itemVariants}
          data-status={talk.status}
        >
          <div className={styles.talkWhen}>
            <span>{talk.dateLabel}</span>
            <em>{talk.status === "presented" ? "発表済" : "発表予定"}</em>
          </div>
          <div className={styles.talkBody}>
            <span className={styles.talkVenue}>
              {talk.venueShort} · {talk.kind}
              {talk.session ? ` · ${talk.session}` : ""}
            </span>
            <h3>
              <Ja>{talk.title}</Ja>
            </h3>
            <p>
              {talk.venue}
              {talk.place ? `（${talk.place}）` : ""} · {talk.project}
            </p>
            <a href={talk.href} target="_blank" rel="noreferrer">
              プログラムを見る
            </a>
          </div>
        </motion.li>
      ))}
    </motion.ol>
  );
}

export function HomePageView({
  awardBadges,
  platformLinks,
  positioning,
  profile,
  publicationTimeline,
  researchProjects,
  selectedWorks,
  siteAxis,
  talks,
  philosophy,
}: HomePageViewProps) {
  const reduceMotion = useReducedMotion();
  const liveChannels = selectedWorks.flatMap((work) => work.distribution ?? []);
  const featuredWorks = selectedWorks.filter((work) => work.feature);
  const tickerItems = [
    `VibeGuard v${vibeguardStats.version}`,
    `${vibeguardStats.rules} rules`,
    `${vibeguardStats.languages} languages`,
    `${liveChannels.length} marketplaces`,
    `${awardPrizeCount} awards`,
    ...talks
      .filter((talk) => talk.date.startsWith("2026"))
      .map((talk) =>
        talk.status === "presented"
          ? `${talk.venueShort} presented`
          : `${talk.venueShort} · ${talk.dateLabel.slice(5)}`,
      ),
    "100% local",
    "SPRESENSE",
  ];

  return (
    <>
      <div id="top" />
      <FrameSequenceHero />

      <main className={styles.home}>
        {/* Social proof rail — directly under the hero (full-bleed) */}
        <AwardsStrip awards={awardBadges} talkCount={talks.length} />

        <motion.section
          className={`${styles.shell} ${styles.proofSection}`}
          variants={sectionVariants}
          initial="hidden"
          whileInView="show"
          viewport={revealViewport}
        >
          <div className={styles.proofLead}>
            <p>In numbers</p>
            <h2>
              <Ja>2024〜2026 年の実績</Ja>
            </h2>
          </div>
          <div className={styles.proofGrid}>
            <div>
              <strong>
                <AnimatedCount value={awardPrizeCount} />
              </strong>
              <span>受賞</span>
            </div>
            <div>
              <strong>
                <AnimatedCount value={talks.length} />
              </strong>
              <span>学会発表</span>
            </div>
            <div>
              <strong>
                <AnimatedCount value={liveChannels.length} />
              </strong>
              <span>VibeGuard の配布先</span>
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
          data-signal="share"
          className={`${styles.shell} ${styles.section}`}
          variants={sectionVariants}
          initial="hidden"
          whileInView="show"
          viewport={revealViewport}
        >
          <SectionHeader
            eyebrow="Shipped Work"
            title="制作物"
            body="VibeGuard は Marketplace と拡張機能ストアからインストールして利用できます。ほかの制作物は GitHub でコードを公開しています。"
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
                  <p className={styles.cardSubtitle}>
                    <Ja>{work.subtitle}</Ja>
                  </p>
                  <p>{work.feature ? <Ja>{work.summary}</Ja> : work.summary}</p>
                </a>

                {work.slug === "vibeguard" && <VibeGuardScan />}

                {work.award && (
                  <a
                    className={`${styles.cardSiteLink} ${styles.cardAward}`}
                    href={work.award.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {work.award.label}
                  </a>
                )}

                {work.siteLink && (
                  <a
                    className={styles.cardSiteLink}
                    href={work.siteLink.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {work.siteLink.label}
                  </a>
                )}

                {work.highlights && (
                  <ul className={styles.highlights}>
                    {work.highlights
                      .slice(0, work.feature ? 4 : 2)
                      .map((line) => (
                        <li key={line}>
                          <Ja>{line}</Ja>
                        </li>
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

        <MarqueeInterlude items={tickerItems} />

        <motion.section
          id="research"
          data-signal="sense"
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
              return (
                <motion.article
                  key={project.slug}
                  className={`${styles.researchCard} ${themeClassName(
                    project.themeClass,
                  )}`}
                  variants={itemVariants}
                >
                  <Link href={`/research/${project.slug}`}>
                    <div className={styles.researchImageWrap} aria-hidden="true">
                      <ResearchInstrument
                        mode={instrumentModeFor(project.themeClass)}
                      />
                    </div>
                    <span className={styles.cardMeta}>{project.year}</span>
                    <h3>{project.title}</h3>
                    <p className={styles.cardSubtitle}>
                      <Ja>{project.subtitle}</Ja>
                    </p>
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

        {/* Sense → Decide → Share pipeline */}
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
              >
                <span className="axis-step-index">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="axis-step-heading">
                  <strong>{step.en}</strong>
                  <span>{step.ja}</span>
                </div>
                <p className="axis-step-copy">
                  <Ja>{step.description}</Ja>
                </p>
              </motion.article>
            ))}
          </motion.div>
        </motion.section>

        {/* Talks & papers — refereed venues */}
        <motion.section
          id="talks"
          data-signal="decide"
          className={`${styles.shell} ${styles.section}`}
          variants={sectionVariants}
          initial="hidden"
          whileInView="show"
          viewport={revealViewport}
        >
          <SectionHeader
            eyebrow="Talks & Papers"
            title="学会発表"
            body="VibeGuard の論文を SES2026 で発表しました。2026 年 10 月 22 日には、CSS2026 で VibeGuard Compiler を発表する予定です。振動解析の研究は、電気学会で 2 回発表しました。"
          />
          <TalksTimeline talks={talks} />
        </motion.section>

        {/* Pentagon radar — positioning */}
        <div id="positioning" className={`${styles.shell} ${styles.section}`}>
          <PositioningSection positioning={positioning} />
        </div>

        {/* Data room — impact dashboard */}
        <div
          id="data"
          data-signal="decide"
          className={`${styles.shell} ${styles.section}`}
        >
          <ImpactDashboard
            publications={publicationTimeline}
            awards={awardBadges}
            research={researchProjects}
            works={selectedWorks}
          />
        </div>

        <motion.section
          id="archive"
          data-signal="sense"
          className={`${styles.shell} ${styles.section}`}
          variants={sectionVariants}
          initial="hidden"
          whileInView="show"
          viewport={revealViewport}
        >
          <SectionHeader
            eyebrow="Recognition Archive"
            title="記事と受賞の一覧"
            body="執筆した記事と、受賞、採択、発表を新しい順に掲載しています。"
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
                  <strong>
                    <Ja>{entry.title}</Ja>
                  </strong>
                  <p>
                    <Ja>{entry.summary}</Ja>
                  </p>
                </motion.a>
              ))}
            </div>

            <div className={styles.archiveColumn}>
              <h3>Recognition</h3>
              {awardBadges.map((award) => (
                <motion.a
                  key={`${award.year}-${award.organization}-${award.award}`}
                  className={styles.archiveItem}
                  href={award.href}
                  target="_blank"
                  rel="noreferrer"
                  variants={itemVariants}
                >
                  <span>{award.year}</span>
                  <strong>
                    <Ja>{award.award}</Ja>
                  </strong>
                  <p>{award.organization}</p>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </motion.section>

        {/* Profile & Contact — finale */}
        <motion.section
          id="contact"
          data-signal="share"
          className={`${styles.shell} ${styles.contactSection}`}
          variants={sectionVariants}
          initial="hidden"
          whileInView="show"
          viewport={revealViewport}
        >
          <div className={styles.contactCopy}>
            <p>Profile &amp; Contact</p>
            <h2>
              <Ja>{philosophy.title}</Ja>
            </h2>
            <span>
              <Ja>{philosophy.body}</Ja>
            </span>
            <em className={styles.contactHint}>
              <Ja>仕事や研究のご相談は、GitHub のプロフィールからご連絡ください。</Ja>
            </em>
          </div>

          <div className={styles.profileBlock}>
            <div className={styles.profileName}>
              <span>Profile</span>
              <strong>{profile.nameJa}</strong>
              <em>
                {profile.nameEn} · {profile.role}
              </em>
            </div>
            <p className={styles.profileAffil}>
              {profile.affiliation}
              <br />
              {profile.grade} · {profile.base}
            </p>
            <dl className={styles.profileFacts}>
              {profile.facts.map((fact) => (
                <div key={fact.label}>
                  <dt>{fact.label}</dt>
                  <dd>
                    <Ja>{fact.value}</Ja>
                  </dd>
                </div>
              ))}
            </dl>

            <div className={styles.platformGrid}>
              {platformLinks.map((platform) => (
                <motion.a
                  key={platform.label}
                  href={platform.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span>{platform.label}</span>
                  <strong>
                    <Ja>{platform.description}</Ja>
                  </strong>
                  <p>
                    <Ja>{platform.detail}</Ja>
                  </p>
                </motion.a>
              ))}
            </div>
          </div>
        </motion.section>

        {featuredWorks.length > 0 && (
          <section className={`${styles.shell} ${styles.footerNote}`}>
            <span>Main works</span>
            <strong>{featuredWorks.map((work) => work.title).join(" / ")}</strong>
          </section>
        )}
      </main>
    </>
  );
}
