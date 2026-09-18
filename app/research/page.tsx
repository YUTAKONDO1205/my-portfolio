import type { Metadata } from "next";
import { ResearchPageView } from "../components/research-page-view";
import {
  platformLinks,
  publicationTimeline,
  recognitions,
  researchProjects,
  siteAxis,
} from "../portfolio-data";
import { personName, siteLabel } from "../site-metadata";

const researchDescription =
  "近藤悠太の研究一覧。DroneInspector、pdm_edge、anomaly-event-api、Eltres_CO2_Mapping の概要と個別ページへのリンクです。";

export const metadata: Metadata = {
  title: "Research",
  description: researchDescription,
  alternates: {
    canonical: "/research",
  },
  openGraph: {
    title: `Research | ${personName}`,
    description: researchDescription,
    url: "/research",
    type: "website",
    siteName: siteLabel,
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title: `Research | ${personName}`,
    description: researchDescription,
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
