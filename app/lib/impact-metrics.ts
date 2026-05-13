import type {
  PublicationEntry,
  Recognition,
  ResearchProject,
  SelectedWork,
} from "../portfolio-data";

export type YearBucket = {
  year: string;
  publications: readonly PublicationEntry[];
  awards: readonly Recognition[];
};

export type ModalityKey = "drone" | "pdm" | "anomaly" | "eltres";
export type ModalityThemeClass =
  | "theme-drone"
  | "theme-pdm"
  | "theme-anomaly"
  | "theme-eltres";

export type ModalityCount = {
  key: ModalityKey;
  themeClass: ModalityThemeClass;
  labelJa: string;
  labelEn: string;
  artifactCount: number;
};

type ModalityConfig = {
  key: ModalityKey;
  themeClass: ModalityThemeClass;
  labelJa: string;
  labelEn: string;
  keywords: readonly string[];
};

const MODALITY_CONFIG: readonly ModalityConfig[] = [
  {
    key: "drone",
    themeClass: "theme-drone",
    labelJa: "画像 + IMU",
    labelEn: "Image + IMU",
    keywords: ["drone", "ble", "imu", "mobilenet", "camera", "image"],
  },
  {
    key: "pdm",
    themeClass: "theme-pdm",
    labelJa: "振動 + 音響",
    labelEn: "Vibration + Audio",
    keywords: [
      "fft",
      "audio",
      "mpu6050",
      "max4466",
      "vibration",
      "lora",
      "arduino",
      "predictive",
    ],
  },
  {
    key: "anomaly",
    themeClass: "theme-anomaly",
    labelJa: "画像 + 運用",
    labelEn: "Image + Ops",
    keywords: [
      "anomaly",
      "grad-cam",
      "pytorch",
      "aws",
      "dashboard",
      "sarif",
      "ai code review",
    ],
  },
  {
    key: "eltres",
    themeClass: "theme-eltres",
    labelJa: "CO2 + GPS",
    labelEn: "CO2 + GPS",
    keywords: ["eltres", "matlab", "mapping", "co2", "gps", "sensor", "iot"],
  },
] as const;

export function getYearBuckets(
  publications: readonly PublicationEntry[],
  recognitions: readonly Recognition[],
): YearBucket[] {
  const years = new Set<string>();
  for (const entry of publications) {
    years.add(entry.date.slice(0, 4));
  }
  for (const recognition of recognitions) {
    years.add(recognition.year);
  }

  const sorted = Array.from(years).sort();
  return sorted.map((year) => ({
    year,
    publications: publications.filter((entry) => entry.date.slice(0, 4) === year),
    awards: recognitions.filter((recognition) => recognition.year === year),
  }));
}

export function getModalityCounts(
  research: readonly ResearchProject[],
  publications: readonly PublicationEntry[],
  works: readonly SelectedWork[],
): ModalityCount[] {
  return MODALITY_CONFIG.map((config) => {
    const researchCount = research.filter(
      (project) => project.themeClass === config.themeClass,
    ).length;
    const worksCount = works.filter(
      (work) => work.themeClass === config.themeClass,
    ).length;
    const pubCount = publications.filter((entry) => {
      const lowered = entry.tags.map((tag) => tag.toLowerCase());
      return lowered.some((tag) =>
        config.keywords.some((keyword) => tag.includes(keyword)),
      );
    }).length;

    return {
      key: config.key,
      themeClass: config.themeClass,
      labelJa: config.labelJa,
      labelEn: config.labelEn,
      artifactCount: researchCount + worksCount + pubCount,
    };
  });
}

export function getPublicationThemeClass(
  entry: PublicationEntry,
): ModalityThemeClass | null {
  const lowered = entry.tags.map((tag) => tag.toLowerCase());
  for (const config of MODALITY_CONFIG) {
    if (
      lowered.some((tag) =>
        config.keywords.some((keyword) => tag.includes(keyword)),
      )
    ) {
      return config.themeClass;
    }
  }
  return null;
}
