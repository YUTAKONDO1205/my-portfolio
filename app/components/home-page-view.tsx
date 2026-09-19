"use client";

import Link from "next/link";
import { LiveScanner } from "./live-scanner";
import { ResearchInstrument, instrumentModeFor } from "./research-instrument";
import { Ja } from "./ja";
import { heroCopyV2, vibeguardStats } from "../portfolio-data";
import type {
  AwardBadge,
  Philosophy,
  PlatformLink,
  Profile,
  PublicationEntry,
  ResearchProject,
  SelectedWork,
  Talk,
} from "../portfolio-data";
import styles from "./home-page-view.module.css";

type HomePageViewProps = {
  awardBadges: readonly AwardBadge[];
  platformLinks: readonly PlatformLink[];
  profile: Profile;
  publicationTimeline: readonly PublicationEntry[];
  researchProjects: readonly ResearchProject[];
  selectedWorks: readonly SelectedWork[];
  talks: readonly Talk[];
  philosophy: Philosophy;
};

function kindLabel(kind: AwardBadge["kind"]) {
  switch (kind) {
    case "selection":
      return "採択";
    case "presentation":
      return "発表";
    default:
      return "受賞";
  }
}

export function HomePageView({
  awardBadges,
  platformLinks,
  profile,
  publicationTimeline,
  researchProjects,
  selectedWorks,
  talks,
  philosophy,
}: HomePageViewProps) {
  const vibeguard = selectedWorks.find((work) => work.slug === "vibeguard");
  const otherWorks = selectedWorks.filter((work) => work.slug !== "vibeguard");
  const channels = vibeguard?.distribution ?? [];

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <a className={styles.brand} href="#top">
          {profile.nameJa}
        </a>
        <nav className={styles.nav} aria-label="主要セクション">
          <a href="#works">制作物</a>
          <a href="#research">研究</a>
          <a href="#talks">学会発表</a>
          <a href="#records">受賞と記事</a>
          <a href="#contact">プロフィールと連絡先</a>
        </nav>
      </header>

      <main id="top" className={styles.main}>
        {/* ---------------- hero: a sentence, then the product itself ---------------- */}
        <section className={styles.hero}>
          <a
            className={styles.latest}
            href={heroCopyV2.latestUpdate.href}
            target="_blank"
            rel="noreferrer"
          >
            <time>{heroCopyV2.latestUpdate.dateLabel}</time>
            <Ja>{heroCopyV2.latestUpdate.title}</Ja>
          </a>

          <h1 className={styles.statement}>
            <Ja>{heroCopyV2.headlineJa}</Ja>
          </h1>

          <div className={styles.heroNote}>
            <p>
              <Ja>{heroCopyV2.subJa}</Ja>
            </p>
            <p className={styles.scannerNote}>
              <Ja>
                下のエディタでは、配布版と同じ VibeGuard の解析エンジンが動作しています。コードを編集すると、その場で再診断します。入力した内容は、外部へ送信しません。
              </Ja>
            </p>
          </div>

          <LiveScanner />

          {vibeguard && (
            <dl className={styles.spec}>
              <div>
                <dt>バージョン</dt>
                <dd>{vibeguardStats.version}</dd>
              </div>
              <div>
                <dt>検出ルール</dt>
                <dd>
                  {vibeguardStats.rules}
                  <small>
                    単一ファイル {vibeguardStats.singleFileRules}、ファイル横断{" "}
                    {vibeguardStats.crossFileRules}
                  </small>
                </dd>
              </div>
              <div>
                <dt>対応言語</dt>
                <dd>{vibeguardStats.languages}</dd>
              </div>
              <div>
                <dt>自動修正</dt>
                <dd>
                  {vibeguardStats.fixers}
                  <small>確認なしで適用できるものは {vibeguardStats.safeFixers}</small>
                </dd>
              </div>
              <div className={styles.specWide}>
                <dt>入手先</dt>
                <dd className={styles.specLinks}>
                  {vibeguard.siteLink && (
                    <a
                      href={vibeguard.siteLink.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {vibeguard.siteLink.label}
                    </a>
                  )}
                  {channels.map((channel) => (
                    <a
                      key={channel.label}
                      href={channel.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {channel.label}
                    </a>
                  ))}
                  <a href={vibeguard.href} target="_blank" rel="noreferrer">
                    GitHub
                  </a>
                </dd>
              </div>
            </dl>
          )}
        </section>

        {/* ---------------- works ---------------- */}
        <section id="works" className={styles.section}>
          <h2 className={styles.heading}>制作物</h2>

          {vibeguard && (
            <article className={styles.lead}>
              <div>
                <h3>{vibeguard.title}</h3>
                <p className={styles.subtitle}>
                  <Ja>{vibeguard.subtitle}</Ja>
                </p>
              </div>
              <div className={styles.leadBody}>
                <p>
                  <Ja>{vibeguard.summary}</Ja>
                </p>
                <ul className={styles.points}>
                  {vibeguard.highlights?.slice(0, 4).map((line) => (
                    <li key={line}>
                      <Ja>{line}</Ja>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          )}

          <div className={styles.rows}>
            {otherWorks.map((work) => (
              <article key={work.slug} className={styles.row}>
                <div className={styles.rowHead}>
                  <h3>
                    <a href={work.href} target="_blank" rel="noreferrer">
                      {work.title}
                    </a>
                  </h3>
                  <p className={styles.subtitle}>
                    <Ja>{work.subtitle}</Ja>
                  </p>
                  {work.award && (
                    <a
                      className={styles.award}
                      href={work.award.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Ja>{work.award.label}</Ja>
                    </a>
                  )}
                </div>
                <div className={styles.rowBody}>
                  <p>
                    <Ja>{work.summary}</Ja>
                  </p>
                  <p className={styles.stack}>{work.tags.slice(0, 6).join(" / ")}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ---------------- research ---------------- */}
        <section id="research" className={styles.section}>
          <h2 className={styles.heading}>研究</h2>
          <div className={styles.rows}>
            {researchProjects.map((project) => (
              <article key={project.slug} className={styles.research}>
                <Link
                  href={`/research/${project.slug}`}
                  className={styles.figure}
                  aria-hidden="true"
                  tabIndex={-1}
                >
                  <ResearchInstrument mode={instrumentModeFor(project.themeClass)} />
                </Link>
                <div className={styles.researchBody}>
                  <p className={styles.year}>{project.year}</p>
                  <h3>
                    <Link href={`/research/${project.slug}`}>{project.title}</Link>
                  </h3>
                  <p className={styles.subtitle}>
                    <Ja>{project.subtitle}</Ja>
                  </p>
                  <p>
                    <Ja>{project.cardSummary}</Ja>
                  </p>
                  <p className={styles.stack}>{project.tags.slice(0, 5).join(" / ")}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ---------------- talks ---------------- */}
        <section id="talks" className={styles.section}>
          <h2 className={styles.heading}>学会発表</h2>
          <ol className={styles.talks}>
            {talks.map((talk) => (
              <li key={talk.id}>
                <div className={styles.talkWhen}>
                  <time>{talk.dateLabel}</time>
                  <span data-status={talk.status}>
                    {talk.status === "presented" ? "発表済" : "発表予定"}
                  </span>
                </div>
                <div>
                  <h3>
                    <a href={talk.href} target="_blank" rel="noreferrer">
                      <Ja>{talk.title}</Ja>
                    </a>
                  </h3>
                  <p>
                    {talk.venue}
                    {talk.place ? `（${talk.place}）` : ""}、{talk.kind}
                    {talk.session ? `、${talk.session}` : ""}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* ---------------- awards & articles ---------------- */}
        <section id="records" className={styles.section}>
          <h2 className={styles.heading}>受賞と記事</h2>
          <div className={styles.records}>
            <ul className={styles.list}>
              {awardBadges.map((award) => (
                <li key={`${award.year}-${award.organization}-${award.award}`}>
                  <span>
                    {award.year} {kindLabel(award.kind)}
                  </span>
                  <a href={award.href} target="_blank" rel="noreferrer">
                    <Ja>{award.award}</Ja>
                  </a>
                  <small>{award.organization}</small>
                </li>
              ))}
            </ul>
            <ul className={styles.list}>
              {publicationTimeline.map((entry) => (
                <li key={entry.id}>
                  <span>{entry.dateLabel} 記事</span>
                  <a href={entry.href} target="_blank" rel="noreferrer">
                    <Ja>{entry.title}</Ja>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---------------- profile & contact ---------------- */}
        <section id="contact" className={styles.section}>
          <h2 className={styles.heading}>{philosophy.title}</h2>
          <div className={styles.contact}>
            <div className={styles.contactCopy}>
              <p>
                <Ja>{philosophy.body}</Ja>
              </p>
              <p>
                <Ja>仕事や研究のご相談は、GitHub のプロフィールからご連絡ください。</Ja>
              </p>
            </div>
            <div>
              <dl className={styles.facts}>
                <div>
                  <dt>名前</dt>
                  <dd>
                    {profile.nameJa}（{profile.nameEn}）
                  </dd>
                </div>
                <div>
                  <dt>分野</dt>
                  <dd>{profile.role}</dd>
                </div>
                <div>
                  <dt>拠点</dt>
                  <dd>{profile.base}</dd>
                </div>
                {profile.facts.map((fact) => (
                  <div key={fact.label}>
                    <dt>{fact.label}</dt>
                    <dd>
                      <Ja>{fact.value}</Ja>
                    </dd>
                  </div>
                ))}
              </dl>
              <ul className={styles.links}>
                {platformLinks.map((platform) => (
                  <li key={platform.label}>
                    <a href={platform.href} target="_blank" rel="noreferrer">
                      {platform.label}
                    </a>
                    <span>{platform.description}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
