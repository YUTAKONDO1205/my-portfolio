// JSON-LD (schema.org) for search engines. Everything is derived from
// portfolio-data so the markup never says more than the visible page.
import {
  awardBadges,
  isAwardPrize,
  profile,
  talks,
  type Talk,
} from "./portfolio-data";
import { personName, siteDescription, siteTitle, siteUrl } from "./site-metadata";

const personId = `${siteUrl}/#person`;
const websiteId = `${siteUrl}/#website`;

/** Profiles that are about this person, not pages that merely mention them.
    Add ORCID / researchmap / Google Scholar here once those profiles exist. */
const sameAs = [
  "https://github.com/YUTAKONDO1205",
  "https://elchika.com/user/kd_yuta/?page=0",
  "https://zenn.dev/kd_yuta",
];

/** Spellings used by the conference programs and proceedings
    (e.g. 「近藤 悠太」 with a space) and the romanized forms. */
const alternateNames = ["近藤 悠太", "Yuta Kondo", "Kondo Yuta", "KONDO Yuta"];

const person = {
  "@type": "Person",
  "@id": personId,
  name: personName,
  alternateName: alternateNames,
  url: siteUrl,
  description: profile.role,
  knowsAbout: [
    "エッジAI",
    "組み込みシステム",
    "異常検知",
    "AI生成コードのセキュリティ",
    "SPRESENSE",
  ],
  award: awardBadges
    .filter(isAwardPrize)
    .map((badge) => `${badge.year} ${badge.organization} ${badge.award}`),
  sameAs,
};

const website = {
  "@type": "WebSite",
  "@id": websiteId,
  name: personName,
  alternateName: siteTitle,
  description: siteDescription,
  url: siteUrl,
  inLanguage: "ja",
  publisher: { "@id": personId },
};

/** Site-wide graph, rendered in the root layout. */
export const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [website, person],
};

function venueLine(talk: Talk) {
  return `${talk.venue}${talk.place ? `（${talk.place}）` : ""}、${talk.kind}${talk.session ? `、${talk.session}` : ""}`;
}

/** A talk with a proceedings record is a ScholarlyArticle pointing at the
    publisher's record; the others are works pointing at the official page
    that lists the title and the presenter. No dates: several talks only have
    a year or a month on record. */
function talkNode(talk: Talk) {
  const common = {
    "@id": `${siteUrl}/#${talk.id}`,
    name: talk.title,
    author: { "@id": personId },
    inLanguage: "ja",
  };

  if (talk.paper) {
    return {
      "@type": "ScholarlyArticle",
      ...common,
      headline: talk.title,
      description: `${venueLine(talk)}。${talk.paper.citation}（${talk.paper.source}）`,
      url: talk.paper.href,
    };
  }

  return {
    "@type": "CreativeWork",
    ...common,
    genre: talk.kind,
    description: venueLine(talk),
    url: talk.href,
  };
}

/** Home page graph: the page is the owner's profile page. */
export const homeJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfilePage",
      "@id": `${siteUrl}/#profilepage`,
      url: siteUrl,
      name: siteTitle,
      inLanguage: "ja",
      isPartOf: { "@id": websiteId },
      mainEntity: person,
    },
    ...talks.map(talkNode),
  ],
};

/** Serialize for a <script type="application/ld+json"> body. `<` is escaped
    so a title can never close the script element. */
export function jsonLdScript(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
