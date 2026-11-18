import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { HEAD } from "@/components/Logo";

// The 1200x630 social card, rendered at build time into out/og.png from the
// same ticket world as the page. Text uses Archivo from @fontsource/archivo.
export const dynamic = "force-static";

const font = (weight: number) =>
  readFile(
    join(
      process.cwd(),
      "node_modules/@fontsource/archivo/files",
      `archivo-latin-${weight}-normal.woff`,
    ),
  );

const GROUND = "#16111f";
const CORAL = "#ff8a6c";
const INK = "#1c1222";
const INK_2 = "#4a1d1f";
const VIOLET = "#7563eb";

export async function GET() {
  const [regular, bold, heavy] = await Promise.all([
    font(400),
    font(700),
    font(800),
  ]);

  const holes = Array.from({ length: 17 }, (_, index) => index);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        padding: 36,
        background: GROUND,
        fontFamily: "Archivo",
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          borderRadius: 20,
          background: CORAL,
          color: INK,
        }}
      >
        <div
          style={{
            width: 190,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "40px 0 44px",
          }}
        >
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: 12,
              background: GROUND,
            }}
          />
          <svg
            width="112"
            height="80"
            viewBox="300 325 424 305"
            style={{ transform: "rotate(-8deg)" }}
            aria-hidden="true"
          >
            <path fill={VIOLET} fillRule="evenodd" d={HEAD} />
          </svg>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                fontSize: 18,
                fontWeight: 800,
                letterSpacing: 3,
              }}
            >
              No.
            </div>
            <div
              style={{
                fontSize: 30,
                fontWeight: 800,
                color: "#4732c9",
              }}
            >
              0002451
            </div>
          </div>
        </div>
        <div
          style={{
            width: 14,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 0",
          }}
        >
          {holes.map((hole) => (
            <div
              key={hole}
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                background: GROUND,
              }}
            />
          ))}
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "54px 64px 50px 60px",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 24,
              fontWeight: 800,
              letterSpacing: 4,
              textTransform: "uppercase",
            }}
          >
            Airbroke · admit every error
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                fontSize: 92,
                fontWeight: 800,
                lineHeight: 0.98,
                letterSpacing: -3,
              }}
            >
              <span>Keep your SDKs.</span>
              <span>Own your errors.</span>
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 28,
                fontSize: 30,
                fontWeight: 400,
                color: INK_2,
              }}
            >
              Self-hosted, open-source error catcher for Airbrake and Sentry
              SDKs.
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 24,
              fontWeight: 700,
            }}
          >
            <span>airbroke.icorete.ch</span>
            <span style={{ color: INK_2 }}>MIT · PostgreSQL · MCP</span>
          </div>
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Archivo", data: regular, weight: 400, style: "normal" },
        { name: "Archivo", data: bold, weight: 700, style: "normal" },
        { name: "Archivo", data: heavy, weight: 800, style: "normal" },
      ],
    },
  );
}
