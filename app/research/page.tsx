import type { Metadata } from "next";
import { ResearchPageView } from "../components/research-page-view";
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
    <ResearchPageView
      platformLinks={platformLinks}
      publicationTimeline={publicationTimeline}
      recognitions={recognitions}
      researchProjects={researchProjects}
      siteAxis={siteAxis}
    />
  );
}
