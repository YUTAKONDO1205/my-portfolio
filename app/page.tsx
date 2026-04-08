import type { CSSProperties } from "react";
import Link from "next/link";
import {
  focusAreas,
  platformLinks,
  publicationTimeline,
  recognitions,
  researchProjects,
} from "./portfolio-data";

export default function Home() {
  return (
    <main className="portfolio-home">
      <section className="shell base-hero">
        <header className="landing-header">
          <div>
            <p className="site-mark">Yuta Kondo</p>
            <p className="site-caption">Research Portfolio / Embedded AI / Public Works</p>
          </div>

          <nav className="hero-nav" aria-label="サイト内ナビゲーション">
            <Link href="/research">Research</Link>
            <a href="#projects">Projects</a>
            <a href="#archive">Archive</a>
          </nav>
        </header>

        <div className="base-hero-grid">
          <div className="base-hero-copy">
            <p className="eyebrow">Portfolio</p>
            <h1 className="base-hero-title">
              近藤悠太の
              <br />
              紹介サイト。
            </h1>
            <p className="base-hero-lead">
              センシング、組み込み、エッジ AI、異常検知を軸に、
              現場で動く研究テーマを公開しています。一覧は簡潔に、
              各研究は個別ページで世界観ごと切り替えて見せる構成にしています。
            </p>

            <div className="hero-actions">
              <Link href="/research" className="button-link button-link-primary">
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
            </div>
          </div>

          <div className="hero-stage" aria-label="研究テーマのプレビュー">
            <div className="hero-stage-beam hero-stage-beam-one" />
            <div className="hero-stage-beam hero-stage-beam-two" />
            {researchProjects.map((project, index) => (
              <Link
                key={project.slug}
                href={`/research/${project.slug}`}
                className={`hero-stage-card ${project.themeClass}`}
                style={
                  {
                    "--card-delay": `${index * 140}ms`,
                  } as CSSProperties
                }
              >
                <span className="quick-link-label">{project.heroKicker}</span>
                <strong>{project.title}</strong>
                <p>{project.subtitle}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="hero-band">
          <div className="hero-band-item">
            <span className="quick-link-label">Publications</span>
            <strong>{publicationTimeline.length}</strong>
            <p>Elchika に継続公開</p>
          </div>
          <div className="hero-band-item">
            <span className="quick-link-label">Recognitions</span>
            <strong>{recognitions.length}</strong>
            <p>受賞・評価の記録</p>
          </div>
          <div className="hero-band-item">
            <span className="quick-link-label">Research Themes</span>
            <strong>{researchProjects.length}</strong>
            <p>個別ページで展開</p>
          </div>
        </div>
      </section>

      <section className="shell section dark-panel">
        <div className="section-heading section-heading-inverse">
          <p className="eyebrow">Focus</p>
          <h2>現場の信号を、実装までつなげる。</h2>
        </div>

        <div className="focus-grid">
          {focusAreas.map((area, index) => (
            <article
              key={area.title}
              className="focus-card focus-card-dark"
              style={
                {
                  "--card-delay": `${index * 120}ms`,
                } as CSSProperties
              }
            >
              <p className="card-label card-label-inverse">{area.label}</p>
              <h3>{area.title}</h3>
              <p>{area.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="projects" className="shell section dark-panel">
        <div className="section-heading section-heading-inverse">
          <p className="eyebrow">Project Sites</p>
          <h2>各研究は、テーマごとの空気感で見せる。</h2>
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
                <p className="card-label card-label-inverse">{project.year}</p>
                <h3>{project.title}</h3>
                <p className="project-preview-subtitle">{project.subtitle}</p>
                <p className="project-preview-summary">{project.cardSummary}</p>
                <div className="tag-row">
                  {project.tags.slice(0, 4).map((tag) => (
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

      <section id="archive" className="shell section archive-panel">
        <div className="section-heading">
          <p className="eyebrow eyebrow-dark">Archive</p>
          <h2>公開記事と受賞歴。</h2>
        </div>

        <div className="archive-grid">
          <div className="archive-column">
            <div className="subsection-heading">
              <p className="card-label">Articles</p>
              <h3>Elchika に残している記事</h3>
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
          <h2>コードと記事の両方で公開している。</h2>
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
