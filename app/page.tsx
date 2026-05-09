import { HomePageView } from "./components/home-page-view";
import {
  philosophy,
  platformLinks,
  publicationTimeline,
  recognitions,
  researchProjects,
  selectedWorks,
  siteAxis,
} from "./portfolio-data";

export default function Home() {
  return (
    <HomePageView
      platformLinks={platformLinks}
      publicationTimeline={publicationTimeline}
      recognitions={recognitions}
      researchProjects={researchProjects}
      selectedWorks={selectedWorks}
      siteAxis={siteAxis}
      philosophy={philosophy}
    />
  );
}
