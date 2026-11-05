import { ImageResponse } from "next/og";
import { heroCopyV2, profile } from "./portfolio-data";
import { personName, siteTitle, siteUrl } from "./site-metadata";

export const alt = siteTitle;

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

/* The share card is the top of the home page: the name, the latest line,
   the one sentence, on the same paper, ink and single blue. Nothing here is
   drawn for the card alone. */

const PAPER = "#fdfdfc";
const INK = "#0b0d14";
const INK_SOFT = "#3d4350";
const INK_MUTE = "#6c7280";
const BLUE = "#1a3cff";

/* The sentence, broken where the hero breaks it at desktop width. If the
   copy changes and these no longer spell it, the card falls back to the
   sentence as one block. */
const STATEMENT_LINES = ["マイコン上で動作する", "AI と、AI 生成コードの", "診断ツールを開発しています。"];

const compact = (text: string) => text.replace(/\s/g, "");

/* next/og has no Japanese face of its own; fetch the site's faces, cut down
   to the characters on the card. */
async function loadGoogleFont(family: string, weight: number, text: string) {
  const url = `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, "+")}:wght@${weight}&text=${encodeURIComponent(text)}`;
  const css = await (await fetch(url)).text();
  const resource = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/);
  if (!resource) throw new Error(`no font file for ${family} ${weight}`);
  const response = await fetch(resource[1]);
  if (!response.ok) throw new Error(`font fetch failed for ${family} ${weight}`);
  return response.arrayBuffer();
}

export default async function OpenGraphImage() {
  const { latestUpdate, headlineJa } = heroCopyV2;
  const lines =
    compact(STATEMENT_LINES.join("")) === compact(headlineJa) ? STATEMENT_LINES : [headlineJa];
  const host = new URL(siteUrl).host;

  const boldText = personName + lines.join("");
  const regularText = latestUpdate.title + profile.role + host + "Portfolio";
  const monoText = latestUpdate.dateLabel;

  let fonts:
    | { name: string; data: ArrayBuffer; weight: 400 | 800; style: "normal" }[]
    | undefined;
  try {
    const [bold, regular, mono] = await Promise.all([
      loadGoogleFont("LINE Seed JP", 800, boldText),
      loadGoogleFont("LINE Seed JP", 400, regularText),
      loadGoogleFont("JetBrains Mono", 400, monoText),
    ]);
    fonts = [
      { name: "LINE Seed JP", data: bold, weight: 800, style: "normal" },
      { name: "LINE Seed JP", data: regular, weight: 400, style: "normal" },
      { name: "JetBrains Mono", data: mono, weight: 400, style: "normal" },
    ];
  } catch {
    // offline build: next/og's own fallback still renders the text
    fonts = undefined;
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 80px 56px",
          background: PAPER,
          color: INK,
          fontFamily: "LINE Seed JP",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <div style={{ display: "flex", fontSize: 28, fontWeight: 800, letterSpacing: "0.04em" }}>
            {personName}
          </div>
          <div style={{ display: "flex", fontSize: 22, fontWeight: 400, color: INK_MUTE }}>
            Portfolio
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 18, fontSize: 22, fontWeight: 400 }}>
            <div style={{ display: "flex", fontFamily: "JetBrains Mono", fontSize: 20, color: BLUE }}>
              {latestUpdate.dateLabel}
            </div>
            <div style={{ display: "flex", color: INK_SOFT }}>{latestUpdate.title}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 66, fontWeight: 800, lineHeight: 1.28 }}>
            {lines.map((line) => (
              <div key={line} style={{ display: "flex" }}>
                {line}
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: 22,
            borderTop: `1px solid ${INK}`,
            fontSize: 20,
            fontWeight: 400,
            color: INK_SOFT,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ display: "flex", width: 12, height: 12, background: BLUE }} />
            {profile.role}
          </div>
          <div style={{ display: "flex", color: INK_MUTE }}>{host}</div>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
