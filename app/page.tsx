import type { CSSProperties } from "react";
import Image from "next/image";
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
      <section className="shell landing-hero">
        <header className="landing-header">
          <div>
            <p className="site-mark">Yuta Kondo</p>
            <p className="site-caption">Research Portfolio / Embedded AI / Public Work</p>
          </div>

          <nav className="hero-nav" aria-label="サイト内ナビゲーション">
            <Link href="/research">Research</Link>
            <a href="#projects">Projects</a>
            <a href="#archive">Archive</a>
          </nav>
        </header>

        <div className="landing-hero-grid">
          <div className="landing-copy">
            <p className="eyebrow eyebrow-dark">Portfolio</p>
            <h1 className="landing-title">
              研究と実装を、
              <br />
              ひとつの流れで見せる。
            </h1>
            <p className="landing-lead">
              センシング、組み込み、エッジ AI、イベント運用までを横断しながら、
              現場で動く異常検知の形を探っています。このサイトでは、
              研究の入口を軽く見せつつ、各テーマは個別ページで深く読める構成にしています。
            </p>

            <div className="hero-actions">
              <Link href="/research" className="button-link button-link-dark">
                研究一覧を見る
              </Link>
              <a
                href="https://github.com/YUTAKONDO1205"
                className="button-link button-link-light"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
            </div>
          </div>

          <div className="landing-portrait">
            <div className="landing-portrait-frame">
              <Image
                src="/images/yuta-kondo-portrait.jpeg"
                alt="近藤悠太のポートレート"
                fill
                priority
                sizes="(max-width: 920px) 100vw, 40vw"
                className="landing-portrait-image"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="shell section intro-band">
        <div className="section-heading">
          <p className="eyebrow eyebrow-dark">Intro</p>
          <h2>現場で取った信号を、その場で扱える形まで落とし込む。</h2>
        </div>

        <div className="intro-grid">
          <div className="intro-copy">
            <p>
              興味の中心にあるのは、現場で起きている変化をどう取るか、
              どう軽量に判断するか、どう運用できる単位までつなげるかです。
              画像、振動、音響、通信、保存、可視化を切り離さずに扱っています。
            </p>
            <p>
              参考にした `niwaya.co.jp` のように、一覧ページでは言い切りを強くし、
              各テーマの空気感は個別ページで切り替わるように構成しています。
            </p>
          </div>

          <div className="intro-focus-grid">
            {focusAreas.map((area, index) => (
              <article
                key={area.title}
                className="focus-card"
                style={
                  {
                    "--card-delay": `${index * 120}ms`,
                  } as CSSProperties
                }
              >
                <p className="card-label">{area.label}</p>
                <h3>{area.title}</h3>
                <p>{area.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="projects" className="shell section">
        <div className="section-heading">
          <p className="eyebrow eyebrow-dark">Project Sites</p>
          <h2>各研究は、個別ページでそれぞれ違う表情を持たせています。</h2>
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
                    View Project
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="archive" className="shell section archive-band">
        <div className="section-heading">
          <p className="eyebrow eyebrow-dark">Archive</p>
          <h2>公開記事と受賞歴。</h2>
        </div>

        <div className="archive-grid">
          <div className="archive-column">
            <div className="subsection-heading">
              <p className="card-label">Articles</p>
              <h3>Elchika に残している制作記事</h3>
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
              <h3>研究が評価された記録</h3>
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
          <h2>コードと記事の両方で公開しています。</h2>
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
