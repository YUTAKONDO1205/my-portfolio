import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  platformLinks,
  publicationTimeline,
  recognitions,
  researchProjects,
} from "../portfolio-data";

export const metadata: Metadata = {
  title: "Research",
  description:
    "近藤悠太の研究一覧ページ。各研究は個別ページで世界観を分けて紹介し、ここでは全体の見取り図として簡潔にまとめています。",
  alternates: {
    canonical: "/research",
  },
  openGraph: {
    title: "Research | 近藤悠太",
    description:
      "近藤悠太の研究一覧ページ。各研究は個別ページで世界観を分けて紹介し、ここでは全体の見取り図として簡潔にまとめています。",
    url: "/research",
    type: "website",
    locale: "ja_JP",
    images: [
      {
        url: "/images/yuta-kondo-portrait.jpeg",
        alt: "近藤悠太のポートレート",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Research | 近藤悠太",
    description:
      "近藤悠太の研究一覧ページ。各研究は個別ページで世界観を分けて紹介し、ここでは全体の見取り図として簡潔にまとめています。",
    images: ["/images/yuta-kondo-portrait.jpeg"],
  },
};

export default function ResearchPage() {
  return (
    <main className="research-page">
      <section className="shell landing-hero landing-hero-light">
        <header className="landing-header landing-header-light">
          <div>
            <p className="site-mark">Research Index</p>
            <p className="site-caption site-caption-dark">
              Individual pages for each project
            </p>
          </div>

          <nav className="hero-nav hero-nav-dark" aria-label="研究ページナビゲーション">
            <Link href="/">Home</Link>
            <a href="#project-sites">Projects</a>
            <a href="#research-archive">Archive</a>
          </nav>
        </header>

        <div className="landing-copy landing-copy-wide">
          <p className="eyebrow eyebrow-dark">Research</p>
          <h1 className="landing-title landing-title-dark">
            各研究は、
            <br />
            個別ページで見せる。
          </h1>
          <p className="landing-lead landing-lead-dark">
            ここでは全体の見取り図だけを置き、個別の研究はそれぞれ別ページで紹介しています。
            ドローンなら空、振動解析ならスペクトル、イベント運用なら監視基盤というように、
            テーマごとに核になる空気を変えています。
          </p>
        </div>
      </section>

      <section id="project-sites" className="shell section">
        <div className="section-heading">
          <p className="eyebrow eyebrow-dark">Project Sites</p>
          <h2>3 つの研究テーマを、それぞれ別の質感で見せる。</h2>
        </div>

        <div className="project-preview-grid">
          {researchProjects.map((project, index) => (
            <article
              key={project.slug}
              className={`project-preview-card ${project.themeClass}`}
              style={
                {
                  "--card-delay": `${index * 150}ms`,
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

      <section id="research-archive" className="shell section archive-band">
        <div className="section-heading">
          <p className="eyebrow eyebrow-dark">Archive</p>
          <h2>公開記事と受賞歴から、研究全体の流れを見る。</h2>
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
                  className="publication-card"
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
                  className="recognition-card"
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

      <section className="shell section platform-band">
        <div className="section-heading">
          <p className="eyebrow eyebrow-dark">Platforms</p>
          <h2>GitHub と Elchika を軸に、今も公開を続けています。</h2>
        </div>

        <div className="platform-grid-light">
          {platformLinks.map((platform, index) => (
            <a
              key={platform.label}
              href={platform.href}
              className="platform-card-light"
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
