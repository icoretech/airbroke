import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vitest";
import AppBreadcrumbs from "@/components/layout/AppBreadcrumbs";

describe("AppBreadcrumbs", () => {
  test("keeps an intermediate organization hidden through the tablet shell", () => {
    const html = renderToStaticMarkup(
      <AppBreadcrumbs
        items={[
          { label: "Projects", href: "/projects" },
          { label: "Example Org", href: "/projects" },
          { label: "Sample Project" },
        ]}
      />,
    );
    const document = new DOMParser().parseFromString(html, "text/html");
    const organization = [
      ...document.querySelectorAll('[data-slot="breadcrumb-item"]'),
    ].find((item) => item.textContent === "Example Org");
    const separators = document.querySelectorAll(
      '[data-slot="breadcrumb-separator"]',
    );

    expect(organization?.classList.contains("hidden")).toBe(true);
    expect(organization?.classList.contains("lg:inline-flex")).toBe(true);
    expect(organization?.classList.contains("md:inline-flex")).toBe(false);
    expect(separators[1]?.classList.contains("hidden")).toBe(true);
    expect(separators[1]?.classList.contains("lg:list-item")).toBe(true);
    expect(separators[1]?.classList.contains("md:list-item")).toBe(false);
  });

  test("reserves the remaining width for the current page", () => {
    const html = renderToStaticMarkup(
      <AppBreadcrumbs
        items={[
          { label: "Projects", href: "/projects" },
          { label: "Example Org", href: "/projects" },
          { label: "Sample Project", href: "/projects/project-1" },
          { label: "Error" },
        ]}
      />,
    );
    const document = new DOMParser().parseFromString(html, "text/html");
    const currentPage = document.querySelector('[aria-current="page"]');
    const currentItem = currentPage?.closest('[data-slot="breadcrumb-item"]');

    expect(currentItem?.classList.contains("min-w-0")).toBe(true);
    expect(currentItem?.classList.contains("flex-1")).toBe(true);
  });
});
