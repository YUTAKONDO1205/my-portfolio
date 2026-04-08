import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getResearchProject,
  projectSlugs,
  researchProjects,
} from "../../portfolio-data";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return projectSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getResearchProject(slug);

  if (!project) {
    return {
      title: "Research",
    };
  }

  return {
    title: project.title,
    description: project.pageSummary,
    alternates: {
      canonical: `/research/${project.slug}`,
    },
    openGraph: {
      title: `${project.title} | 近藤悠太`,
      description: project.pageSummary,
      url: `/research/${project.slug}`,
      type: "article",
      locale: "ja_JP",
    },
    twitter: {
      card: "summary",
      title: `${project.title} | 近藤悠太`,
      description: project.pageSummary,
    },
  };
}

export default async function ResearchDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = getResearchProject(slug);

  if (!project) {
    notFound();
  }

  const otherProjects = researchProjects.filter(
    (candidate) => candidate.slug !== project.slug,
  );

  return (
    <main className={`project-site ${project.themeClass}`}>
      <section className="shell project-hero">
        <div className="project-hero-topbar">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/research">Research</Link>
          <span>/</span>
          <span>{project.title}</span>
        </div>

        <div className="project-hero-grid">
          <div className="project-hero-copy">
            <p className="eyebrow">{project.heroKicker}</p>
            <h1>{project.title}</h1>
            <p className="project-hero-subtitle">{project.subtitle}</p>
            <p className="project-hero-summary">{project.pageSummary}</p>
            <p className="project-hero-english">{project.heroEnglish}</p>

            <div className="hero-actions">
              <Link href="/research" className="button-link button-link-primary">
                研究一覧へ戻る
              </Link>
              {project.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="button-link button-link-secondary"
                  target="_blank"
                  rel="noreferrer"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div className="project-visual">
            <div className="project-visual-core">
              <span>{project.year}</span>
              <strong>{project.heroKicker}</strong>
            </div>
            <div className="project-visual-layer project-visual-layer-a" />
            <div className="project-visual-layer project-visual-layer-b" />
            <div className="project-visual-layer project-visual-layer-c" />
          </div>
        </div>
      </section>

      <section className="shell section project-content-panel">
        <div className="tag-row">
          {project.tags.map((tag) => (
            <span key={tag} className="tag project-tag">
              {tag}
            </span>
          ))}
        </div>

        <div className="project-story-grid">
          {project.sections.map((section, index) => (
            <article
              key={section.title}
              className="project-story-card"
              style={
                {
                  "--card-delay": `${index * 120}ms`,
                } as CSSProperties
              }
            >
              <p className="card-label">{section.title}</p>
              <h2>{section.title}</h2>
              <p>{section.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="shell section project-content-panel project-content-panel-alt">
        <div className="section-heading">
          <p className="eyebrow eyebrow-dark">Highlights</p>
          <h2>この研究のポイント。</h2>
        </div>

        <div className="project-highlight-grid">
          {project.highlights.map((highlight, index) => (
            <article
              key={highlight}
              className="project-highlight-card"
              style={
                {
                  "--card-delay": `${index * 120}ms`,
                } as CSSProperties
              }
            >
              <span className="project-highlight-index">0{index + 1}</span>
              <p>{highlight}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="shell section project-content-panel">
        <div className="section-heading">
          <p className="eyebrow eyebrow-dark">Other Projects</p>
          <h2>ほかの研究テーマ。</h2>
        </div>

        <div className="project-mini-grid">
          {otherProjects.map((candidate, index) => (
            <Link
              key={candidate.slug}
              href={`/research/${candidate.slug}`}
              className={`project-mini-card ${candidate.themeClass}`}
              style={
                {
                  "--card-delay": `${index * 120}ms`,
                } as CSSProperties
              }
            >
              <span className="quick-link-label">{candidate.heroKicker}</span>
              <strong>{candidate.title}</strong>
              <p>{candidate.cardSummary}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
