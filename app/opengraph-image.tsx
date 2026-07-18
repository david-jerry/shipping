import { ImageResponse } from "next/og"

export const runtime = "edge"

export const alt = "Lyftberan global logistics platform"

export const size = {
  width: 1200,
  height: 630,
}

export const contentType = "image/png"

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        alignItems: "stretch",
        background:
          "linear-gradient(135deg, #0b1020 0%, #111827 45%, #1f2937 100%)",
        color: "#f9fafb",
        display: "flex",
        fontFamily: "Inter, Segoe UI, sans-serif",
        height: "100%",
        justifyContent: "space-between",
        padding: "56px 64px",
        width: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "74%",
        }}
      >
        <div
          style={{
            alignItems: "center",
            color: "#93c5fd",
            display: "flex",
            fontSize: 28,
            fontWeight: 600,
            gap: 14,
            letterSpacing: 1,
            textTransform: "uppercase",
          }}
        >
          <span
            style={{
              background: "#2563eb",
              borderRadius: 999,
              display: "flex",
              height: 12,
              width: 12,
            }}
          />
          Lyftberan Logistics
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              fontSize: 74,
              fontWeight: 800,
              letterSpacing: -2,
              lineHeight: 1.05,
            }}
          >
            Global Smart
            <br />
            Shipping Platform
          </div>
          <div
            style={{
              color: "#d1d5db",
              fontSize: 32,
              fontWeight: 500,
              lineHeight: 1.3,
            }}
          >
            Real-time tracking, enterprise freight, and AI routing across 190+
            countries.
          </div>
        </div>

        <div
          style={{
            color: "#93c5fd",
            display: "flex",
            fontSize: 24,
            fontWeight: 600,
            gap: 22,
          }}
        >
          <span>Ocean</span>
          <span>Air</span>
          <span>Ground</span>
        </div>
      </div>

      <div
        style={{
          alignItems: "center",
          background: "rgba(59,130,246,0.14)",
          border: "1px solid rgba(147,197,253,0.3)",
          borderRadius: 28,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: "24%",
        }}
      >
        <div
          style={{
            color: "#dbeafe",
            fontSize: 72,
            fontWeight: 800,
            letterSpacing: -1,
            lineHeight: 1,
          }}
        >
          190+
        </div>
        <div
          style={{
            color: "#bfdbfe",
            fontSize: 28,
            fontWeight: 500,
            marginTop: 12,
          }}
        >
          Countries
        </div>
      </div>
    </div>,
    size
  )
}
