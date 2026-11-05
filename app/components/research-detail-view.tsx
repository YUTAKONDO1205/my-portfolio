"use client";

import Link from "next/link";
import { ResearchInstrument, instrumentModeFor } from "./research-instrument";
import { SlideDeckViewer } from "./slide-deck-viewer";
import { Ja, softBreakTitle, tagLine } from "./ja";
import { SiteHeader } from "./site-header";
import type { ResearchProject } from "../portfolio-data";
import styles from "./home-page-view.module.css";
import local from "./research-views.module.css";

/* A research page, set like the home page: the title and its note with the
   instrument beside them, then 内容, スライド, 要点 and ほかの研究, each with
   its heading in the side column. */

type ResearchDetailViewProps = {
  project: ResearchProject;
  otherProjects: readonly ResearchProject[];
};

export function ResearchDetailView({
  project,
  otherProjects,
}: ResearchDetailViewProps) {
  // two lists side by side, as the home page sets 受賞と記事
  const half = Math.ceil(otherProjects.length / 2);
  const relatedColumns = [otherProjects.slice(0, half), otherProjects.slice(half)];

  return (
    <div className={styles.page}>
      <SiteHeader page="other" />

      <main className={styles.main}>
        <section className={styles.hero}>
          <p className={local.kicker}>
            <time>{project.year}</time>
            <span>{project.heroKicker}</span>
          </p>
          <h1 className={styles.statement}>{softBreakTitle(project.title)}</h1>

          <div className={local.detailHero}>
            <div>
              <p className={styles.subtitle}>
                <Ja>{project.subtitle}</Ja>
              </p>
              <p>
                <Ja>{project.pageSummary}</Ja>
              </p>
              <p className={styles.stack}>{tagLine(project.tags)}</p>
              <p className={local.actions}>
                <Link href="/research">研究一覧へ戻る</Link>
                {project.links.map((link) => (
                  <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
                    {link.label}
                  </a>
                ))}
              </p>
            </div>
            <div className={local.detailFigure} aria-hidden="true">
              <ResearchInstrument mode={instrumentModeFor(project.themeClass)} />
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>内容</h2>
          <div className={`${styles.rows} ${local.ruled}`}>
            {project.sections.map((section) => (
              <article key={section.title} className={styles.row}>
                <h3>{section.title}</h3>
                <p>
                  <Ja>{section.body}</Ja>
                </p>
              </article>
            ))}
          </div>
        </section>

        {project.slides && (
          <section className={styles.section}>
            <h2 className={styles.heading}>発表スライド</h2>
            <div className={local.block}>
              <p>
                <Ja>
                  {`${project.slides.context}で発表したスライドです。1〜${project.slides.mainPages} 枚目が本編、${project.slides.mainPages + 1} 枚目以降が質疑用の付録です。`}
                </Ja>
              </p>
              <SlideDeckViewer deck={project.slides} />
            </div>
          </section>
        )}

        <section className={styles.section}>
          <h2 className={styles.heading}>要点</h2>
          <div className={local.block}>
            <ul className={styles.points}>
              {project.highlights.map((highlight) => (
                <li key={highlight}>
                  <Ja>{highlight}</Ja>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>ほかの研究</h2>
          <div className={`${styles.records} ${local.related}`}>
            {relatedColumns.map((column, index) => (
              <ul key={index} className={styles.list}>
                {column.map((candidate) => (
                  <li key={candidate.slug}>
                    <span>{candidate.year}</span>
                    <Link href={`/research/${candidate.slug}`}>
                      {softBreakTitle(candidate.title)}
                    </Link>
                    <small>
                      <Ja>{candidate.subtitle}</Ja>
                    </small>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
