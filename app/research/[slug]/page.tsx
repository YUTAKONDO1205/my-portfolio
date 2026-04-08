import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ResearchDetailView } from "../../components/research-detail-view";
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

  return <ResearchDetailView project={project} otherProjects={otherProjects} />;
}
