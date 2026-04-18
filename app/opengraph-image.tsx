import { ImageResponse } from "next/og";
import { siteDescription, siteTitle } from "./site-metadata";

export const alt = siteTitle;

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

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
          background:
            "radial-gradient(circle at 84% 18%, rgba(201, 67, 92, 0.20), transparent 24%), radial-gradient(circle at 18% 84%, rgba(71, 119, 176, 0.18), transparent 22%), linear-gradient(135deg, #12090b 0%, #161018 46%, #0f1722 100%)",
          color: "#fff7f0",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.18,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />

        <div
          style={{
            position: "absolute",
            right: -60,
            top: -30,
            width: 620,
            height: 620,
            borderRadius: 999,
            opacity: 0.2,
            border: "1px solid rgba(255,255,255,0.24)",
          }}
        />

        <div
          style={{
            position: "absolute",
            right: 80,
            bottom: 72,
            width: 320,
            height: 320,
            display: "flex",
            borderRadius: 999,
            border: "1px solid rgba(255,255,255,0.12)",
          }}
        />

        <div
          style={{
            position: "absolute",
            right: 120,
            top: 88,
            width: 360,
            height: 360,
            opacity: 0.3,
            display: "flex",
          }}
        >
          {[
            [20, 80],
            [120, 24],
            [238, 64],
            [302, 160],
            [240, 260],
            [108, 294],
            [36, 204],
          ].map(([left, top], index) => (
            <div
              key={`${left}-${top}`}
              style={{
                position: "absolute",
                left,
                top,
                width: 18,
                height: 18,
                borderRadius: 999,
                background: index % 3 === 0 ? "#ea9c62" : "#9bd5d9",
                boxShadow: "0 0 12px rgba(255,255,255,0.18)",
              }}
            />
          ))}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 999,
              background:
                "radial-gradient(circle at center, rgba(255,255,255,0.06), transparent 58%)",
            }}
          />
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
              gap: 14,
              maxWidth: 720,
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 28,
                letterSpacing: "0.26em",
                textTransform: "uppercase",
                color: "rgba(255,247,240,0.66)",
              }}
            >
              Sense / Decide / Share
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <div
                style={{
                  display: "flex",
                  fontSize: 92,
                  fontWeight: 800,
                  letterSpacing: "-0.06em",
                  lineHeight: 1,
                }}
              >
                Yuta Kondo
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: 40,
                  color: "rgba(255,247,240,0.9)",
                  letterSpacing: "-0.03em",
                }}
              >
                Portfolio
              </div>
            </div>
            <div
              style={{
                display: "flex",
                maxWidth: 760,
                fontSize: 24,
                lineHeight: 1.6,
                color: "rgba(255,247,240,0.72)",
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
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 18,
              }}
            >
              <div
                style={{
                  display: "flex",
                  width: 82,
                  height: 82,
                  borderRadius: 24,
                  border: "1px solid rgba(255,245,240,0.18)",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 42,
                  fontWeight: 800,
                  letterSpacing: "-0.08em",
                  background:
                    "linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
                }}
              >
                YK
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  fontSize: 24,
                  color: "rgba(255,247,240,0.72)",
                }}
              >
                <div style={{ display: "flex" }}>DroneInspector / pdm_edge</div>
                <div style={{ display: "flex" }}>anomaly-event-api</div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                fontSize: 24,
                color: "rgba(255,247,240,0.56)",
              }}
            >
              {siteTitle}
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
