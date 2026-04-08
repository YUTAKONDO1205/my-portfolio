import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  platformLinks,
  publicationTimeline,
  recognitions,
  researchFlow,
  researchProjects,
} from "../portfolio-data";

export const metadata: Metadata = {
  title: "Research",
  description:
    "DroneInspector、pdm_edge、anomaly-event-api を中心に、近藤悠太の研究テーマを背景、構成、現在地まで含めて紹介するページです。",
  alternates: {
    canonical: "/research",
  },
  openGraph: {
    title: "Research | 近藤悠太",
    description:
      "DroneInspector、pdm_edge、anomaly-event-api を中心に、近藤悠太の研究テーマを背景、構成、現在地まで含めて紹介するページです。",
    url: "/research",
    type: "article",
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
      "DroneInspector、pdm_edge、anomaly-event-api を中心に、近藤悠太の研究テーマを背景、構成、現在地まで含めて紹介するページです。",
    images: ["/images/yuta-kondo-portrait.jpeg"],
  },
};

const researchArc = [
  {
    label: "Waveform Edge",
    title: "設備の振動・音響を近くで判断する",
    description:
      "pdm_edge では固定設備を対象に、加速度と音響を軽量特徴へ変換し、予兆保全をエッジで完結させる方向を探っています。",
  },
  {
    label: "Mobile Inspection",
    title: "移動体に載せて現場で判断する",
    description:
      "DroneInspector では、狭小インフラ空間で画像取得と証跡保存を両立しながら、機体側判断の実装可能性を詰めています。",
  },
  {
    label: "Operational Layer",
    title: "結果をイベントとして運用につなげる",
    description:
      "anomaly-event-api では、検知結果を event 化し、可視化、状態管理、ローカル検証、AWS 検証までつなげています。",
  },
] as const;

export default function ResearchPage() {
  return (
    <main className="research-page">
      <section className="shell hero-shell research-hero">
        <div className="subpage-topbar">
          <Link href="/">Home</Link>
          <span>/</span>
          <span>Research</span>
        </div>

        <div className="hero-grid research-hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Research Archive</p>
            <h1>
              <span>Public Research,</span>
              <span className="display-line">from Context</span>
              <span>to Current State.</span>
            </h1>
            <p className="hero-lead">
              ここでは、公開している研究テーマを「何を解こうとしているか」「どんな構成で実装しているか」
              「いまどこまで進んでいるか」まで含めて整理しています。単なる成果の一覧ではなく、
              研究の思考過程と実装の現在地が見えるページとして構成しています。
            </p>

            <div className="hero-actions">
              <Link href="/" className="button-link button-link-primary">
                Home
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

          <aside className="hero-aside" aria-label="研究ページの要点">
            <div className="signal-stack">
              <article className="signal-card">
                <p className="signal-label">Latest Themes</p>
                <p className="signal-title">
                  DroneInspector
                  <br />
                  pdm_edge
                  <br />
                  anomaly-event-api
                </p>
              </article>
              <article className="signal-card">
                <p className="signal-label">Public Notes</p>
                <p className="signal-copy">
                  2025 年から 2026 年にかけて Elchika で継続公開。研究ページでは各記事とのつながりも整理しています。
                </p>
              </article>
              <article className="signal-card">
                <p className="signal-label">Recognition</p>
                <p className="signal-copy">
                  IEEJ U-21 の奨励賞、SPRESENSE 活用コンテスト受賞歴を含めて、研究の評価軸も見えるようにしています。
                </p>
              </article>
            </div>
          </aside>
        </div>
      </section>

      <section id="projects" className="shell section panel panel-dark deep-project-section">
        <div className="section-heading section-heading-inverse">
          <p className="eyebrow">Deep Dive</p>
          <h2>最新研究 3 件を、背景から現在地まで読む。</h2>
        </div>

        <div className="deep-project-grid">
          {researchProjects.map((project, index) => (
            <article
              key={project.id}
              id={project.id}
              className="deep-project-card"
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

              <div className="deep-project-columns">
                <div className="detail-block">
                  <span className="detail-label">Problem Setting</span>
                  <p>{project.problem}</p>
                </div>
                <div className="detail-block">
                  <span className="detail-label">Technical Approach</span>
                  <p>{project.approach}</p>
                </div>
                <div className="detail-block">
                  <span className="detail-label">Current State</span>
                  <p>{project.currentState}</p>
                </div>
              </div>

              <div className="tag-row" aria-label={`${project.title} の技術要素`}>
                {project.stack.map((item) => (
                  <span key={item} className="tag">
                    {item}
                  </span>
                ))}
              </div>

              <ul className="highlight-list">
                {project.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>

              <div className="link-row">
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
          <p className="eyebrow eyebrow-dark">Research Continuum</p>
          <h2>個別テーマではなく、ひとつの研究線としてつながっている。</h2>
        </div>

        <div className="flow-grid">
          {researchArc.map((step, index) => (
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

        <div className="continuum-copy">
          <p>
            3 つのテーマはそれぞれ別の作品に見えますが、実際にはひとつの流れの上にあります。
            固定設備の予兆保全で培った軽量特徴設計は、ドローン搭載時の制約理解につながり、
            その結果として得られた異常判定をどう保存し運用へつなげるかが anomaly-event-api に接続しています。
          </p>
          <p>
            つまり研究の中心にあるのは「現場で取れる信号を、軽量に判断し、運用できる単位にまで落とすこと」です。
            研究ページでは、その連続性が読み取れるように各テーマを並べています。
          </p>
        </div>
      </section>

      <section className="shell section panel panel-light flow-section">
        <div className="section-heading">
          <p className="eyebrow eyebrow-dark">Method</p>
          <h2>研究の進め方そのものも、公開対象にしている。</h2>
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

      <section id="publications" className="shell section panel panel-light archive-section">
        <div className="section-heading">
          <p className="eyebrow eyebrow-dark">Articles & Awards</p>
          <h2>記事、受賞、コメントから研究の輪郭を補強する。</h2>
        </div>

        <div className="archive-grid">
          <div className="archive-column">
            <div className="subsection-heading">
              <p className="card-label">Elchika Articles</p>
              <h3>公開記事の流れ</h3>
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
              <p className="card-label">Recognitions</p>
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

      <section className="shell section panel panel-dark platforms-section">
        <div className="section-heading section-heading-inverse">
          <p className="eyebrow">Open Lab</p>
          <h2>GitHub と Elchika を軸に、研究過程をいまも公開しています。</h2>
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
            <p className="eyebrow eyebrow-dark">Back To Home</p>
            <h2>トップページでは全体像を、研究ページでは各テーマの深度を見せています。</h2>
          </div>
          <Link href="/" className="button-link button-link-dark">
            Home
          </Link>
        </div>
      </section>
    </main>
  );
}
