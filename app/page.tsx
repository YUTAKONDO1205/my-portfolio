import { HomePageView } from "./components/home-page-view";
import {
  awardBadges,
  philosophy,
  platformLinks,
  profile,
  publicationTimeline,
  researchProjects,
  selectedWorks,
  talks,
} from "./portfolio-data";

export default function Home() {
  return (
    <HomePageView
      awardBadges={awardBadges}
      platformLinks={platformLinks}
      profile={profile}
      publicationTimeline={publicationTimeline}
      researchProjects={researchProjects}
      selectedWorks={selectedWorks}
      talks={talks}
      philosophy={philosophy}
    />
  );
}
