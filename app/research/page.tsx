import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  platformLinks,
  publicationTimeline,
  recognitions,
  researchProjects,
  siteAxis,
} from "../portfolio-data";

export const metadata: Metadata = {
  title: "Research",
  description:
    "近藤悠太の研究一覧。各研究は個別ページで世界観を分けて紹介し、ここでは研究全体の見取り図としてまとめています。",
  alternates: {
    canonical: "/research",
  },
  openGraph: {
    title: "Research | 近藤悠太",
    description:
      "近藤悠太の研究一覧。各研究は個別ページで世界観を分けて紹介し、ここでは研究全体の見取り図としてまとめています。",
    url: "/research",
    type: "website",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary",
    title: "Research | 近藤悠太",
    description:
      "近藤悠太の研究一覧。各研究は個別ページで世界観を分けて紹介し、ここでは研究全体の見取り図としてまとめています。",
  },
};

export default function ResearchPage() {
  return (
    <main className="research-page">
      <section className="shell base-hero base-hero-compact">
        <header className="landing-header">
          <div>
            <p className="site-mark">Research Index</p>
            <p className="site-caption">Sense / Decide / Share</p>
          </div>

          <nav className="hero-nav" aria-label="研究ページナビゲーション">
            <Link href="/">Home</Link>
            <a href="#project-sites">Projects</a>
            <a href="#research-archive">Archive</a>
          </nav>
        </header>

        <div className="base-hero-copy base-hero-copy-wide">
          <p className="eyebrow">Research</p>
          <h1 className="base-hero-title">研究の見取り図。</h1>
          <p className="base-hero-lead">
            このページでは {siteAxis.steps[0].en} / {siteAxis.steps[1].en} /{" "}
            {siteAxis.steps[2].en} の流れの中で、各研究がどこを担うかを見渡せるように整理しています。
            詳細な説明や実装は、それぞれの個別ページで掘り下げています。
          </p>

          <div className="research-axis-strip" aria-label="サイトの軸">
            {siteAxis.steps.map((step) => (
              <div key={step.en} className="research-axis-chip">
                <strong>{step.en}</strong>
                <span>{step.ja}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="project-sites" className="shell section dark-panel">
        <div className="section-heading section-heading-inverse">
          <p className="eyebrow">Project Sites</p>
          <h2>研究ごとに違う質感で見せる。</h2>
        </div>

        <div className="project-preview-grid">
          {researchProjects.map((project, index) => (
            <article
              key={project.slug}
              className={`project-preview-card ${project.themeClass}`}
              style={
                {
                  "--card-delay": `${index * 140}ms`,
                } as CSSProperties
              }
            >
              <div className="project-preview-inner">
                <p className="card-label card-label-inverse">{project.heroKicker}</p>
                <h3>{project.title}</h3>
                <p className="project-preview-subtitle">{project.subtitle}</p>
                <p className="project-preview-summary">{project.cardSummary}</p>
                <div className="tag-row">
                  {project.tags.slice(0, 5).map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="link-row">
                  <Link href={`/research/${project.slug}`} className="arrow-link">
                    Open Site
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="research-archive" className="shell section archive-panel">
        <div className="section-heading">
          <p className="eyebrow eyebrow-dark">Archive</p>
          <h2>公開記事と受賞歴。</h2>
        </div>

        <div className="archive-grid">
          <div className="archive-column">
            <div className="subsection-heading">
              <p className="card-label">Articles</p>
              <h3>Elchika の公開記事</h3>
            </div>

            <div className="publication-grid">
              {publicationTimeline.map((entry, index) => (
                <article
                  key={entry.id}
                  className={`publication-card ${entry.awards.length > 0 ? "award-accent-card" : ""}`}
                  style={
                    {
                      "--card-delay": `${index * 110}ms`,
                    } as CSSProperties
                  }
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
              ))}
            </div>
          </div>

          <div className="archive-column">
            <div className="subsection-heading">
              <p className="card-label">Recognition</p>
              <h3>評価の記録</h3>
            </div>

            <div className="recognition-grid">
              {recognitions.map((recognition, index) => (
                <article
                  key={`${recognition.year}-${recognition.award}`}
                  className="recognition-card award-accent-card"
                  style={
                    {
                      "--card-delay": `${index * 120}ms`,
                    } as CSSProperties
                  }
                >
                  <div className="publication-meta">
                    <span>{recognition.year}</span>
                    <a href={recognition.href} target="_blank" rel="noreferrer">
                      Source
                    </a>
                  </div>
                  <h3>{recognition.award}</h3>
                  <p className="recognition-project">{recognition.project}</p>
                  <p>{recognition.note}</p>
                  <span className="recognition-org">{recognition.organization}</span>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="shell section dark-panel">
        <div className="section-heading section-heading-inverse">
          <p className="eyebrow">Platforms</p>
          <h2>研究の外部導線。</h2>
        </div>

        <div className="platform-grid-light">
          {platformLinks.map((platform, index) => (
            <a
              key={platform.label}
              href={platform.href}
              className="platform-card-dark"
              style={
                {
                  "--card-delay": `${index * 120}ms`,
                } as CSSProperties
              }
              target="_blank"
              rel="noreferrer"
            >
              <span className="quick-link-label">{platform.label}</span>
              <strong>{platform.description}</strong>
              <p>{platform.detail}</p>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
