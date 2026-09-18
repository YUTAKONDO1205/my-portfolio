import { HomePageView } from "./components/home-page-view";
import {
  awardBadges,
  philosophy,
  platformLinks,
  positioning,
  profile,
  publicationTimeline,
  researchProjects,
  selectedWorks,
  siteAxis,
  talks,
} from "./portfolio-data";

export default function Home() {
  return (
    <HomePageView
      awardBadges={awardBadges}
      platformLinks={platformLinks}
      positioning={positioning}
      profile={profile}
      publicationTimeline={publicationTimeline}
      researchProjects={researchProjects}
      selectedWorks={selectedWorks}
      siteAxis={siteAxis}
      talks={talks}
      philosophy={philosophy}
    />
  );
}
