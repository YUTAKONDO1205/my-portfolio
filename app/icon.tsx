import { ImageResponse } from "next/og";

export const size = {
  width: 512,
  height: 512,
};

export const contentType = "image/png";

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
          background:
            "radial-gradient(circle at 30% 30%, rgba(206, 60, 85, 0.38), transparent 36%), linear-gradient(180deg, #180b0d 0%, #0b1118 100%)",
          color: "#fff7f0",
          fontSize: 244,
          fontWeight: 800,
          letterSpacing: "-0.08em",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 380,
            height: 380,
            borderRadius: 120,
            border: "1px solid rgba(255, 245, 240, 0.18)",
            boxShadow: "0 0 80px rgba(206, 60, 85, 0.24)",
            background:
              "linear-gradient(145deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.02))",
          }}
        >
          <span
            style={{
              display: "flex",
              transform: "translateY(-12px)",
            }}
          >
            YK
          </span>
        </div>
      </div>
    ),
    size,
  );
}
