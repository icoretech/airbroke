// @vitest-environment node
import { describe, expect, it } from "vitest";
import { autolink } from "@/lib/autolink";

describe("autolink", () => {
  describe("URLs", () => {
    it("converts a plain URL to a link", () => {
      const result = autolink("check https://example.com/path for details", {});
      expect(result).toHaveLength(3);
      expect(result[0]).toBe("check ");
      expect(result[1]).toMatchObject({
        type: "a",
        props: {
          href: "https://example.com/path",
          target: "_blank",
          rel: "noopener noreferrer",
        },
      });
      expect(result[2]).toBe(" for details");
    });

    it("handles multiple URLs", () => {
      const result = autolink("see https://a.com and https://b.com", {});
      const links = result.filter(
        (r) => typeof r === "object" && r !== null && "type" in r,
      );
      expect(links).toHaveLength(2);
    });

    it("returns plain text when no patterns match", () => {
      const result = autolink("just plain text", {});
      expect(result).toHaveLength(1);
      expect(result[0]).toBe("just plain text");
    });
  });

  describe("issue tracker references", () => {
    it("links PROJ-123 when repo_issue_tracker is set", () => {
      const result = autolink("see JIRA-456 for context", {
        repoIssueTracker: "https://jira.example.com/browse",
      });
      const link = result.find(
        (r) => typeof r === "object" && r !== null && "type" in r,
      );
      expect(link).toMatchObject({
        props: { href: "https://jira.example.com/browse/JIRA-456" },
      });
    });

    it("links #123 to GitHub issues when repo_url is GitHub", () => {
      const result = autolink("fix for #42", {
        repoUrl: "https://github.com/icoretech/airbroke",
      });
      const link = result.find(
        (r) => typeof r === "object" && r !== null && "type" in r,
      );
      expect(link).toMatchObject({
        props: { href: "https://github.com/icoretech/airbroke/issues/42" },
      });
    });

    it("links #123 to GitLab issues when repo_url is GitLab", () => {
      const result = autolink("fix for #42", {
        repoUrl: "https://gitlab.com/org/repo",
      });
      const link = result.find(
        (r) => typeof r === "object" && r !== null && "type" in r,
      );
      expect(link).toMatchObject({
        props: { href: "https://gitlab.com/org/repo/issues/42" },
      });
    });

    it("renders #123 as plain text when no repo context", () => {
      const result = autolink("fix for #42", {});
      expect(result).toHaveLength(1);
      expect(result[0]).toBe("fix for #42");
    });

    it("renders PROJ-123 as plain text when no issue tracker", () => {
      const result = autolink("see JIRA-456", {});
      expect(result).toHaveLength(1);
      expect(result[0]).toBe("see JIRA-456");
    });
  });

  describe("mixed content", () => {
    it("handles URLs and issue refs together", () => {
      const result = autolink("see JIRA-99 and https://example.com", {
        repoIssueTracker: "https://jira.example.com/browse",
      });
      const links = result.filter(
        (r) => typeof r === "object" && r !== null && "type" in r,
      );
      expect(links).toHaveLength(2);
    });
  });
});
