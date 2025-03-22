import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Get title from search params
    const title = searchParams.get("title") || "Markdown Blog";

    // Font
    const interSemiBold = await fetch(
      new URL(
        "https://fonts.googleapis.com/css2?family=Inter:wght@600&display=swap",
        request.url
      )
    ).then((res) => res.arrayBuffer());

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f8fafc",
            backgroundImage:
              "linear-gradient(to bottom right, #f8fafc, #e2e8f0)",
            fontSize: 60,
            fontWeight: 600,
            textAlign: "center",
            padding: "40px 80px",
            color: "#0f172a",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 30,
              left: 30,
              fontSize: 30,
              color: "#64748b",
            }}
          >
            Markdown Blog
          </div>
          <div style={{ marginTop: 40 }}>{title}</div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: "Inter",
            data: interSemiBold,
            style: "normal",
            weight: 600,
          },
        ],
      }
    );
  } catch (e) {
    console.error(e);
    return new Response(`Failed to generate OG image`, {
      status: 500,
    });
  }
}
