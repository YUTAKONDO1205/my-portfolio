import { HomePageView } from "./components/home-page-view";
import {
  awardBadges,
  philosophy,
  platformLinks,
  positioning,
  publicationTimeline,
  recognitions,
  researchProjects,
  selectedWorks,
  siteAxis,
} from "./portfolio-data";

export default function Home() {
  return (
    <HomePageView
      awardBadges={awardBadges}
      platformLinks={platformLinks}
      positioning={positioning}
      publicationTimeline={publicationTimeline}
      recognitions={recognitions}
      researchProjects={researchProjects}
      selectedWorks={selectedWorks}
      siteAxis={siteAxis}
      philosophy={philosophy}
    />
  );
}
