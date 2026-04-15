import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "EaseVote Ghana — Premier E-Voting & Ticketing Platform";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #1e3a8a 0%, #4f46e5 60%, #7c3aed 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
          padding: "0 80px",
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 20,
            background: "rgba(255,255,255,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 40,
            marginBottom: 8,
          }}
        >
          🗳️
        </div>

        <div
          style={{
            color: "white",
            fontSize: 68,
            fontWeight: 800,
            letterSpacing: -2,
            textAlign: "center",
            lineHeight: 1.1,
          }}
        >
          EaseVote Ghana
        </div>

        <div
          style={{
            color: "rgba(255,255,255,0.75)",
            fontSize: 30,
            textAlign: "center",
            maxWidth: 800,
          }}
        >
          Premier E-Voting &amp; Ticketing Platform
        </div>

        <div
          style={{
            marginTop: 16,
            padding: "10px 28px",
            borderRadius: 100,
            background: "rgba(255,255,255,0.15)",
            color: "rgba(255,255,255,0.9)",
            fontSize: 20,
            letterSpacing: 1,
          }}
        >
          Secure · Transparent · Easy
        </div>
      </div>
    ),
    { ...size },
  );
}
