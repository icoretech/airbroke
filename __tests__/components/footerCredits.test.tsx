import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vitest";
import FooterCredits from "@/components/FooterCredits";

describe("FooterCredits", () => {
  test("renders the current year in server markup without waiting for effects", () => {
    const currentYear = new Date().getFullYear();

    const markup = renderToStaticMarkup(<FooterCredits />);

    expect(markup).toContain("© 2023");
    if (currentYear > 2024) {
      expect(markup).toContain(`-${currentYear}`);
    } else {
      expect(markup).not.toContain(`-${currentYear}`);
    }
  });
});
