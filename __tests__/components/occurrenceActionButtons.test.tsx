import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";
import BookmarkButton from "@/components/occurrence/BookmarkButton";
import ResolveButton from "@/components/occurrence/ResolveButton";
import {
  createOccurrenceBookmark,
  reinstateOccurrence,
  resolveOccurrence,
} from "@/lib/actions/occurrenceActions";

vi.mock("@/lib/actions/occurrenceActions", () => ({
  createOccurrenceBookmark: vi.fn(async () => {}),
  removeOccurrenceBookmark: vi.fn(async () => {}),
  resolveOccurrence: vi.fn(async () => {}),
  reinstateOccurrence: vi.fn(async () => {}),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("occurrence action buttons", () => {
  test.each([false, true])(
    "bookmarks through the real button with iconOnly=%s",
    async (iconOnly) => {
      render(
        <BookmarkButton
          occurrenceId="sample-occurrence"
          isBookmarked={false}
          iconOnly={iconOnly}
        />,
      );
      fireEvent.click(screen.getByRole("button", { name: "Bookmark" }));
      await waitFor(() =>
        expect(createOccurrenceBookmark).toHaveBeenCalledWith(
          "sample-occurrence",
        ),
      );
      expect(
        screen
          .getByRole("button", { name: "Bookmarked" })
          .getAttribute("aria-pressed"),
      ).toBe("true");
    },
  );

  test.each([
    { resolvedAt: null, label: "Resolve", action: resolveOccurrence },
    {
      resolvedAt: new Date(0),
      label: "Reinstate",
      action: reinstateOccurrence,
    },
  ])(
    "runs $label from the detail action",
    async ({ resolvedAt, label, action }) => {
      render(
        <ResolveButton
          occurrenceId="sample-occurrence"
          resolvedAt={resolvedAt}
        />,
      );
      fireEvent.click(screen.getByRole("button", { name: label }));
      await waitFor(() =>
        expect(action).toHaveBeenCalledWith("sample-occurrence"),
      );
    },
  );
});
