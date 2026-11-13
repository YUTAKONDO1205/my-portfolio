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
import { homeJsonLd, jsonLdScript } from "./structured-data";

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(homeJsonLd) }}
      />
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
    </>
  );
}
