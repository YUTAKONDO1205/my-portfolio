import { ImageResponse } from "next/og";
import { siteDescription, siteTitle } from "./site-metadata";

export const alt = siteTitle;

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

const SPECTRUM = ["#8052ff", "#ffb829", "#2fbfa3", "#d05cff", "#5a8cff"];

/* A loose constellation in the right half — the same triangular glyphs as the
   hero canvas, laid out by hand so the card is deterministic. */
const GLYPHS: Array<[number, number, number, number]> = [
  // x, y, size, colour index
  [60, 40, 9, 0],
  [128, 96, 7, 3],
  [196, 52, 6, 1],
  [92, 158, 11, 4],
  [172, 148, 8, 2],
  [246, 118, 7, 0],
  [40, 232, 8, 1],
  [124, 236, 12, 0],
  [204, 214, 9, 3],
  [278, 196, 6, 4],
  [76, 320, 7, 2],
  [158, 330, 10, 1],
  [238, 300, 8, 0],
  [300, 268, 6, 3],
  [110, 408, 8, 4],
  [196, 400, 7, 0],
  [268, 372, 9, 2],
  [22, 128, 5, 3],
  [318, 92, 5, 1],
  [340, 340, 7, 0],
  [12, 300, 6, 4],
  [250, 452, 6, 1],
  [150, 470, 5, 2],
];

function trianglePoints(x: number, y: number, s: number) {
  return `${x},${y - s} ${x + s * 0.87},${y + s * 0.5} ${x - s * 0.87},${
    y + s * 0.5
  }`;
}

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          background: "#111114",
          color: "#ffffff",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: 40,
            top: 40,
            display: "flex",
          }}
        >
          <svg width="380" height="520" viewBox="0 0 380 520">
            {GLYPHS.map(([x, y, s, colour]) => (
              <polygon
                key={`${x}-${y}`}
                points={trianglePoints(x, y, s)}
                fill="none"
                stroke={SPECTRUM[colour]}
                strokeWidth="1.6"
              />
            ))}
          </svg>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            padding: "60px 72px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 28,
              maxWidth: 700,
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 22,
                fontWeight: 600,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#ffb829",
              }}
            >
              Sense / Decide / Share
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div
                style={{
                  display: "flex",
                  fontSize: 104,
                  fontWeight: 400,
                  letterSpacing: "-0.04em",
                  lineHeight: 1.1,
                }}
              >
                Yuta Kondo
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: 40,
                  fontWeight: 400,
                  letterSpacing: "-0.02em",
                  color: "#9a9a9a",
                }}
              >
                Portfolio
              </div>
            </div>

            <div
              style={{
                display: "flex",
                maxWidth: 620,
                fontSize: 22,
                lineHeight: 1.6,
                color: "#bdbdbd",
              }}
            >
              {siteDescription}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <svg width="34" height="30" viewBox="0 0 34 30">
                <defs>
                  <linearGradient id="og-mark" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#8052ff" />
                    <stop offset="100%" stopColor="#15846e" />
                  </linearGradient>
                </defs>
                <polygon points="17,1 33,29 1,29" fill="url(#og-mark)" />
              </svg>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                  fontSize: 20,
                  color: "#9a9a9a",
                }}
              >
                <div style={{ display: "flex" }}>DroneInspector / pdm_edge</div>
                <div style={{ display: "flex" }}>anomaly-event-api</div>
              </div>
            </div>

            <div style={{ display: "flex", fontSize: 20, color: "#9a9a9a" }}>
              {siteTitle}
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
