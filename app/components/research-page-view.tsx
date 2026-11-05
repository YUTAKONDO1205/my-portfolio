"use client";

import Link from "next/link";
import { ResearchInstrument, instrumentModeFor } from "./research-instrument";
import { Ja, softBreakTitle, tagLine } from "./ja";
import { SiteHeader } from "./site-header";
import type {
  PlatformLink,
  PublicationEntry,
  Recognition,
  ResearchProject,
  SiteAxis,
} from "../portfolio-data";
import styles from "./home-page-view.module.css";
import local from "./research-views.module.css";

/* The research index, set like the home page: the header, a title with its
   note, then sections whose heading stays in the side column while their
   rows scroll past. */

type ResearchPageViewProps = {
  platformLinks: readonly PlatformLink[];
  publicationTimeline: readonly PublicationEntry[];
  recognitions: readonly Recognition[];
  researchProjects: readonly ResearchProject[];
  siteAxis: SiteAxis;
};

export function ResearchPageView({
  platformLinks,
  publicationTimeline,
  recognitions,
  researchProjects,
  siteAxis,
}: ResearchPageViewProps) {
  return (
    <div className={styles.page}>
      <SiteHeader page="research-index" />

      <main className={styles.main}>
        <section className={styles.hero}>
          <h1 className={styles.statement}>研究一覧</h1>
          <div className={styles.heroNote}>
            <p>
              <Ja>
                公開している研究の一覧です。概要はこのページに、背景、構成、測定結果は個別ページに記載しています。
              </Ja>
            </p>
            <p>
              <Ja>{siteAxis.summary}</Ja>
            </p>
          </div>
        </section>

        <section id="projects" className={styles.section}>
          <h2 className={styles.heading}>研究テーマ</h2>
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
                    <Link href={`/research/${project.slug}`}>
                      {softBreakTitle(project.title)}
                    </Link>
                  </h3>
                  <p className={styles.subtitle}>
                    <Ja>{project.subtitle}</Ja>
                  </p>
                  <p>
                    <Ja>{project.cardSummary}</Ja>
                  </p>
                  <p className={styles.stack}>{tagLine(project.tags.slice(0, 5))}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="awards" className={styles.section}>
          <h2 className={styles.heading}>受賞と発表</h2>
          <div className={`${styles.rows} ${local.ruled}`}>
            {recognitions.map((recognition) => (
              <article
                key={`${recognition.year}-${recognition.award}`}
                className={styles.row}
              >
                <div className={styles.rowHead}>
                  <p className={styles.year}>{recognition.year}</p>
                  <h3 className={`${local.rowTitle} ${local.awardName}`}>
                    <a href={recognition.href} target="_blank" rel="noreferrer">
                      {recognition.award}
                    </a>
                  </h3>
                  <p className={local.org}>
                    <Ja>{recognition.organization}</Ja>
                  </p>
                </div>
                <div className={`${styles.rowBody} ${local.body}`}>
                  <p className={styles.subtitle}>
                    <Ja>{recognition.project}</Ja>
                  </p>
                  <p>
                    <Ja>{recognition.note}</Ja>
                  </p>
                  {recognition.paper && (
                    <p className={styles.paper}>
                      <span>論文</span>
                      <a
                        href={recognition.paper.href}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Ja>{recognition.paper.citation}</Ja>
                      </a>
                      <Ja>{`（${recognition.paper.source}）`}</Ja>
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="articles" className={styles.section}>
          <h2 className={styles.heading}>記事</h2>
          <div className={`${styles.rows} ${local.ruled}`}>
            {publicationTimeline.map((entry) => (
              <article key={entry.id} className={styles.row}>
                <div className={styles.rowHead}>
                  <p className={styles.year}>{entry.dateLabel}</p>
                  <h3 className={local.rowTitle}>
                    <a href={entry.href} target="_blank" rel="noreferrer">
                      <Ja>{entry.title}</Ja>
                    </a>
                  </h3>
                </div>
                <div className={`${styles.rowBody} ${local.body}`}>
                  <p>
                    <Ja>{entry.summary}</Ja>
                  </p>
                  <p className={styles.stack}>{tagLine(entry.tags)}</p>
                  {entry.awards.map((award) => (
                    <p key={award} className={local.awardNote}>
                      <Ja>{award}</Ja>
                    </p>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="links" className={styles.section}>
          <h2 className={styles.heading}>公開先</h2>
          <div className={`${styles.rows} ${local.ruled}`}>
            {platformLinks.map((platform) => (
              <article key={platform.label} className={styles.row}>
                <div className={styles.rowHead}>
                  <h3 className={local.rowTitle}>
                    <a href={platform.href} target="_blank" rel="noreferrer">
                      {platform.label}
                    </a>
                  </h3>
                </div>
                <div className={`${styles.rowBody} ${local.body}`}>
                  <p className={styles.subtitle}>
                    <Ja>{platform.description}</Ja>
                  </p>
                  <p>
                    <Ja>{platform.detail}</Ja>
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
