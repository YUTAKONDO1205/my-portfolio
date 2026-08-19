import type { CSSProperties } from "react";

import type { ResearchProject } from "./portfolio-data";

export type ArtworkSpec = {
  src: string;
  position?: string;
  mobilePosition?: string;
};

const projectArtworkBySlug: Record<string, ArtworkSpec> = {
  "drone-inspector": {
    src: "/images/ambient/ドローン損傷検出カード.png",
    position: "58% 40%",
    mobilePosition: "62% 48%",
  },
  "pdm-edge": {
    src: "/images/ambient/Spresense異常予知カード.png",
    position: "54% 48%",
    mobilePosition: "58% 52%",
  },
  "anomaly-event-api": {
    src: "/images/ambient/GitHub汎用ソーシャルプレビュー.png",
    position: "56% 42%",
    mobilePosition: "60% 46%",
  },
  "eltres-co2-mapping": {
    src: "/images/ambient/GitHub汎用ソーシャルプレビュー.png",
    position: "52% 46%",
    mobilePosition: "58% 50%",
  },
};

export const homeHeroArtwork: ArtworkSpec = {
  src: "/images/ambient/Xヘッダー.png",
  position: "82% 48%",
  mobilePosition: "74% 46%",
};

export const researchHeroArtwork: ArtworkSpec = {
  src: "/images/ambient/research-hero-bg.png",
  position: "84% 48%",
  mobilePosition: "76% 44%",
};

export function getProjectArtwork(project: Pick<ResearchProject, "slug">) {
  return projectArtworkBySlug[project.slug] ?? null;
}

export function getArtworkStyle(
  artwork: ArtworkSpec | null,
): CSSProperties | undefined {
  if (!artwork) {
    return undefined;
  }

  const style: Record<string, string> = {
    "--artwork-image": `url("${encodeURI(artwork.src)}")`,
  };

  if (artwork.position) {
    style["--artwork-position"] = artwork.position;
  }

  if (artwork.mobilePosition) {
    style["--artwork-position-mobile"] = artwork.mobilePosition;
  }

  return style as CSSProperties;
}
