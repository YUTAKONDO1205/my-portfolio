import { HomePageView } from "./components/home-page-view";
import {
  awardBadges,
  philosophy,
  platformLinks,
  positioning,
  publicationTimeline,
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
      researchProjects={researchProjects}
      selectedWorks={selectedWorks}
      siteAxis={siteAxis}
      philosophy={philosophy}
    />
  );
}
