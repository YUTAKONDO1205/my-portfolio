import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  focusAreas,
  platformLinks,
  publicationTimeline,
  recognitions,
  researchFlow,
  researchProjects,
} from "./portfolio-data";

const totalRecognitions = recognitions.length;
const latestPublicationLabel = publicationTimeline[0]?.dateLabel ?? "2026.01.31";

export default function Home() {
  return (
    <main className="portfolio-home">
      <section className="shell hero-shell home-hero">
        <div className="hero-topbar">
          <div>
            <p className="site-mark">Yuta Kondo / Research Portfolio</p>
            <p className="site-caption">Field Sensing, Edge AI, Public Research</p>
          </div>
          <nav className="hero-nav" aria-label="ページ内ナビゲーション">
            <a href="#projects">Projects</a>
            <a href="#archive">Archive</a>
            <Link href="/research">Research</Link>
          </nav>
        </div>

        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Research Portfolio / 2026</p>
            <h1>
              <span>Field Signals</span>
              <span className="display-line">into Public</span>
              <span>Research.</span>
            </h1>
            <p className="hero-lead">
              センシング、組み込み、エッジ AI、イベント運用までを一気通貫で扱い、
              研究をコードと記事の両方で公開しています。2026 年は
              <strong> DroneInspector</strong>、<strong>pdm_edge</strong>、
              <strong> anomaly-event-api</strong> を軸に、
              現場で動く異常検知の形を磨いています。
            </p>

            <div className="hero-actions">
              <Link href="/research" className="button-link button-link-primary">
                研究ページを深く見る
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

            <div className="hero-stat-row" aria-label="活動概要">
              <article className="hero-stat">
                <span className="hero-stat-value">{researchProjects.length}</span>
                <span className="hero-stat-label">Latest Research Themes</span>
              </article>
              <article className="hero-stat">
                <span className="hero-stat-value">{publicationTimeline.length}</span>
                <span className="hero-stat-label">Public Articles</span>
              </article>
              <article className="hero-stat">
                <span className="hero-stat-value">{totalRecognitions}</span>
                <span className="hero-stat-label">Recognition Threads</span>
              </article>
            </div>
          </div>

          <aside className="hero-aside" aria-label="最新の研究動向">
            <div className="orbit-panel">
              <div className="orbit-ring orbit-ring-one" />
              <div className="orbit-ring orbit-ring-two" />
              <div className="orbit-ring orbit-ring-three" />
              <div className="orbit-core">
                <p className="signal-label">Latest Public Release</p>
                <strong>{latestPublicationLabel}</strong>
                <span>Elchika と GitHub で継続公開中</span>
              </div>
            </div>

            <div className="signal-stack">
              <article className="signal-card">
                <p className="signal-label">Current Focus</p>
                <p className="signal-title">
                  ドローン点検、予兆保全、
                  <br />
                  説明可能な異常検知。
                </p>
              </article>
              <article className="signal-card">
                <p className="signal-label">Research Style</p>
                <p className="signal-copy">
                  センサから運用までを切り離さず、試作、評価、公開のサイクルを回す。
                </p>
              </article>
              <article className="signal-card">
                <p className="signal-label">Public Trail</p>
                <p className="signal-copy">
                  GitHub はコード、Elchika は背景と評価、LinkedIn は全体像の窓口。
                </p>
              </article>
            </div>
          </aside>
        </div>

        <div className="platform-preview-grid">
          {platformLinks.map((platform, index) => (
            <a
              key={platform.label}
              href={platform.href}
              className="platform-preview-card"
              style={
                {
                  "--card-delay": `${index * 120}ms`,
                } as CSSProperties
              }
              target="_blank"
              rel="noreferrer"
            >
              <span className="quick-link-label">{platform.accent}</span>
              <strong>{platform.label}</strong>
              <p>{platform.description}</p>
              <span className="platform-status">{platform.status}</span>
            </a>
          ))}
        </div>
      </section>

      <section className="shell section panel panel-light position-section">
        <div className="section-heading">
          <p className="eyebrow eyebrow-dark">Position</p>
          <h2>現場の信号を、判断に使える研究へ変える。</h2>
        </div>

        <div className="position-grid">
          <div className="position-copy">
            <p>
              関心の中心にあるのは、現場で起きている変化をどう取得し、どう軽量に解釈し、
              どう運用できる形まで持っていくかです。画像、振動、音響、通信、
              イベント管理をばらばらに扱わず、ひとつの研究線としてつなげています。
            </p>
            <p>
              そのため、このサイトでは成果物の見た目だけではなく、課題設定、
              技術構成、改善途中の状態、受賞歴、公開先までを同じ文脈で読める構成にしています。
            </p>
          </div>

          <div className="position-side">
            <article className="profile-photo-card">
              <div className="profile-photo-frame">
                <Image
                  src="/images/yuta-kondo-portrait.jpeg"
                  alt="近藤悠太のポートレート"
                  fill
                  sizes="(max-width: 820px) 100vw, 40vw"
                  className="profile-photo"
                  priority
                />
              </div>
              <div className="profile-photo-overlay">
                <p className="quick-link-label">Portrait</p>
                <strong>Near the field, close to the signal.</strong>
                <p>プロフィール写真も、研究サイトの空気感に合わせて静かな質感で配置しています。</p>
              </div>
            </article>

            <div className="focus-grid">
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
        </div>
      </section>

      <section id="projects" className="shell section panel panel-dark project-section">
        <div className="section-heading section-heading-inverse">
          <p className="eyebrow">Latest Research</p>
          <h2>いま一番深く進めている 3 つの研究テーマ。</h2>
        </div>

        <div className="project-grid">
          {researchProjects.map((project, index) => (
            <article
              key={project.id}
              className="project-card"
              style={
                {
                  "--card-delay": `${index * 160}ms`,
                } as CSSProperties
              }
            >
              <div className="project-head">
                <p className="card-label card-label-inverse">{project.phase}</p>
                <span className="project-year">{project.year}</span>
              </div>
              <h3>{project.title}</h3>
              <p className="project-subtitle">{project.subtitle}</p>
              <p className="project-summary">{project.summary}</p>

              <div className="project-detail-grid">
                <div className="detail-block">
                  <span className="detail-label">Problem</span>
                  <p>{project.problem}</p>
                </div>
                <div className="detail-block">
                  <span className="detail-label">Approach</span>
                  <p>{project.approach}</p>
                </div>
              </div>

              <div className="project-state">
                <span className="detail-label">Current State</span>
                <p>{project.currentState}</p>
              </div>

              <div className="tag-row" aria-label={`${project.title} の技術要素`}>
                {project.stack.map((item) => (
                  <span key={item} className="tag">
                    {item}
                  </span>
                ))}
              </div>

              <div className="link-row">
                <Link href={`/research#${project.id}`} className="arrow-link">
                  詳細を見る
                </Link>
                {project.links.map((link) => (
                  <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
                    {link.label}
                  </a>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="shell section panel panel-light flow-section">
        <div className="section-heading">
          <p className="eyebrow eyebrow-dark">Research Flow</p>
          <h2>取得して、軽量化して、運用までつなぐ。</h2>
        </div>

        <div className="flow-grid">
          {researchFlow.map((step, index) => (
            <article
              key={step.label}
              className="flow-card"
              style={
                {
                  "--card-delay": `${index * 140}ms`,
                } as CSSProperties
              }
            >
              <p className="card-label">{step.label}</p>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="archive" className="shell section panel panel-light archive-section">
        <div className="section-heading">
          <p className="eyebrow eyebrow-dark">Public Trail</p>
          <h2>記事と受賞歴から見える、公開中の研究アーカイブ。</h2>
        </div>

        <div className="archive-grid">
          <div className="archive-column">
            <div className="subsection-heading">
              <p className="card-label">Elchika Articles</p>
              <h3>作品と背景を残す公開ノート</h3>
            </div>

            <div className="publication-grid">
              {publicationTimeline.map((entry, index) => (
                <article
                  key={entry.id}
                  className="publication-card"
                  style={
                    {
                      "--card-delay": `${index * 120}ms`,
                    } as CSSProperties
                  }
                >
                  <div className="publication-meta">
                    <span>{entry.dateLabel}</span>
                    <a href={entry.href} target="_blank" rel="noreferrer">
                      Elchika
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
                    <div className="award-list">
                      {entry.awards.map((award) => (
                        <span key={award} className="award-pill">
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
              <h3>研究が評価された記録</h3>
            </div>

            <div className="recognition-grid">
              {recognitions.map((recognition, index) => (
                <article
                  key={`${recognition.year}-${recognition.award}`}
                  className="recognition-card"
                  style={
                    {
                      "--card-delay": `${index * 140}ms`,
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

      <section className="shell section panel panel-dark platforms-section">
        <div className="section-heading section-heading-inverse">
          <p className="eyebrow">Platforms</p>
          <h2>GitHub と Elchika を中心に、いまも発信を続けています。</h2>
        </div>

        <div className="platform-spotlight-grid">
          {platformLinks.map((platform, index) => (
            <a
              key={platform.label}
              href={platform.href}
              className="platform-spotlight-card"
              style={
                {
                  "--card-delay": `${index * 120}ms`,
                } as CSSProperties
              }
              target="_blank"
              rel="noreferrer"
            >
              <span className="quick-link-label">{platform.accent}</span>
              <strong>{platform.label}</strong>
              <p>{platform.description}</p>
              <p className="platform-detail">{platform.detail}</p>
              <span className="platform-status">{platform.status}</span>
            </a>
          ))}
        </div>
      </section>

      <section className="shell section panel panel-light cta-section">
        <div className="cta-panel">
          <div>
            <p className="eyebrow eyebrow-dark">Next View</p>
            <h2>研究ページでは、各テーマの課題、構成、現在地までさらに深く整理しています。</h2>
          </div>
          <Link href="/research" className="button-link button-link-dark">
            Research Archive
          </Link>
        </div>
      </section>
    </main>
  );
}
