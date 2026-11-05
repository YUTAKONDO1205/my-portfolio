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
  "近藤悠太の研究一覧です。自己対戦型自律実験、DroneInspector、pdm_edge、anomaly-event-api、Eltres_CO2_Mapping の概要を掲載しています。";

export const metadata: Metadata = {
  title: "研究一覧",
  description: researchDescription,
  alternates: {
    canonical: "/research",
  },
  openGraph: {
    title: `研究一覧 | ${personName}`,
    description: researchDescription,
    url: "/research",
    type: "website",
    siteName: siteLabel,
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title: `研究一覧 | ${personName}`,
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
