import { Archivo, JetBrains_Mono, Zen_Kaku_Gothic_New } from "next/font/google";

/* Latin — Archivo is variable on both weight and width. The width axis is
   what the hero headline plays with; everywhere else it sits at 100–112. */
export const latin = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
  variable: "--font-latin",
});

/* 和文 — five static weights. 300 and 900 are the pair the page is built on;
   400/500/700 cover body, labels and card headings. Google serves this in
   unicode-range slices, so only the glyphs a page uses are fetched. */
export const japanese = Zen_Kaku_Gothic_New({
  weight: ["300", "400", "500", "700", "900"],
  subsets: ["latin"],
  display: "swap",
  preload: false,
  variable: "--font-japanese",
});

/* Data, code and measurement labels. */
export const mono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});
