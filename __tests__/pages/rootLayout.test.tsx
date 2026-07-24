import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test, vi } from "vitest";

vi.mock("next/font/google", () => ({
  Geist: () => ({ variable: "geist-sans-variable" }),
  Geist_Mono: () => ({ variable: "geist-mono-variable" }),
}));

import RootLayout from "@/app/layout";

describe("RootLayout", () => {
  test("applies the configured sans font to the document body", async () => {
    const html = renderToStaticMarkup(
      await RootLayout({ children: <main>Airbroke</main> }),
    );
    const document = new DOMParser().parseFromString(html, "text/html");

    expect(document.body.classList.contains("font-sans")).toBe(true);
  });
});
