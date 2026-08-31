import { ImageResponse } from "next/og";

export const size = {
  width: 512,
  height: 512,
};

export const contentType = "image/png";

/* The brand mark: a single angular fragment on the void, violet fading
   through teal — the same glyph the constellation is built from. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#111114",
        }}
      >
        <svg width="300" height="264" viewBox="0 0 300 264">
          <defs>
            <linearGradient id="mark" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#8052ff" />
              <stop offset="100%" stopColor="#15846e" />
            </linearGradient>
          </defs>
          <polygon points="150,8 292,256 8,256" fill="url(#mark)" />
        </svg>
      </div>
    ),
    size,
  );
}
