import { HomePageView } from "./components/home-page-view";
import {
  platformLinks,
  publicationTimeline,
  recognitions,
  researchProjects,
  siteAxis,
} from "./portfolio-data";

export default function Home() {
  return (
    <HomePageView
      platformLinks={platformLinks}
      publicationTimeline={publicationTimeline}
      recognitions={recognitions}
      researchProjects={researchProjects}
      siteAxis={siteAxis}
    />
  );
}
