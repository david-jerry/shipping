import { ImageResponse } from "next/og"

export const runtime = "edge"

export const alt = "Lyftberan global logistics platform"

export const size = {
  width: 1200,
  height: 630,
}

export const contentType = "image/png"

export default function TwitterImage() {
  return new ImageResponse(
    <div
      style={{
        alignItems: "center",
        background:
          "linear-gradient(140deg, #111827 0%, #1e293b 50%, #0f172a 100%)",
        color: "#f9fafb",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Inter, Segoe UI, sans-serif",
        height: "100%",
        justifyContent: "center",
        padding: "64px",
        textAlign: "center",
        width: "100%",
      }}
    >
      <div
        style={{
          color: "#93c5fd",
          fontSize: 32,
          fontWeight: 600,
          letterSpacing: 1,
          marginBottom: 26,
          textTransform: "uppercase",
        }}
      >
        Lyftberan
      </div>
      <div
        style={{
          fontSize: 86,
          fontWeight: 800,
          letterSpacing: -2,
          lineHeight: 1,
          marginBottom: 24,
        }}
      >
        Track. Ship. Scale.
      </div>
      <div
        style={{
          color: "#d1d5db",
          fontSize: 34,
          lineHeight: 1.3,
          maxWidth: 920,
        }}
      >
        Enterprise logistics platform for modern supply chains.
      </div>
    </div>,
    size
  )
}
