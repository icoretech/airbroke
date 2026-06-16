import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import OccurrenceKeyValuePanel from "@/components/occurrence/OccurrenceKeyValuePanel";

describe("OccurrenceKeyValuePanel", () => {
  it("renders flattened object values", () => {
    const html = renderToStaticMarkup(
      <OccurrenceKeyValuePanel
        value={{
          request: {
            path: "/notices",
          },
          user: {
            id: 123,
          },
        }}
      />,
    );

    expect(html).toContain("request.path:");
    expect(html).toContain("&quot;/notices&quot;");
    expect(html).toContain("user.id:");
    expect(html).toContain("123");
  });

  it("keeps non-object values empty like the old wrappers", () => {
    const html = renderToStaticMarkup(
      <OccurrenceKeyValuePanel value={["not", "rendered"]} />,
    );

    expect(html).not.toContain("not");
    expect(html).not.toContain("rendered");
  });
});
