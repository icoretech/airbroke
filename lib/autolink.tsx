// lib/autolink.tsx

import { createElement } from "react";

export type AutolinkContext = {
  repoUrl?: string | null;
  repoIssueTracker?: string | null;
};

type AutolinkNode = string | React.ReactElement;

const URL_RE = /https?:\/\/\S+/g;
const ISSUE_REF_RE = /(?:[A-Z][A-Z0-9]+-\d+|#(\d+))/g;

function buildIssueHref(match: string, ctx: AutolinkContext): string | null {
  if (!match.startsWith("#")) {
    if (ctx.repoIssueTracker) {
      return `${ctx.repoIssueTracker.replace(/\/$/, "")}/${match}`;
    }
    return null;
  }

  const num = match.slice(1);
  if (ctx.repoUrl) {
    const normalized = ctx.repoUrl.replace(/\/$/, "");
    if (
      normalized.includes("github.com") ||
      normalized.includes("gitlab.com")
    ) {
      return `${normalized}/issues/${num}`;
    }
  }
  return null;
}

export function autolink(text: string, ctx: AutolinkContext): AutolinkNode[] {
  const patterns: { re: RegExp; type: "url" | "issue" }[] = [
    { re: URL_RE, type: "url" },
  ];

  const hasIssueContext = ctx.repoIssueTracker || ctx.repoUrl;
  if (hasIssueContext) {
    patterns.push({ re: ISSUE_REF_RE, type: "issue" });
  }

  type Match = {
    index: number;
    length: number;
    text: string;
    type: "url" | "issue";
  };
  const matches: Match[] = [];

  for (const { re, type } of patterns) {
    re.lastIndex = 0;
    let m = re.exec(text);
    while (m !== null) {
      matches.push({
        index: m.index,
        length: m[0].length,
        text: m[0],
        type,
      });
      m = re.exec(text);
    }
  }

  if (matches.length === 0) {
    return [text];
  }

  matches.sort((a, b) => a.index - b.index);
  const filtered: Match[] = [];
  let lastEnd = 0;
  for (const m of matches) {
    if (m.index >= lastEnd) {
      filtered.push(m);
      lastEnd = m.index + m.length;
    }
  }

  const result: AutolinkNode[] = [];
  let cursor = 0;
  let keyCounter = 0;

  for (const m of filtered) {
    if (m.index > cursor) {
      result.push(text.slice(cursor, m.index));
    }

    if (m.type === "url") {
      result.push(
        createElement(
          "a",
          {
            key: `al-${keyCounter++}`,
            href: m.text,
            target: "_blank",
            rel: "noopener noreferrer",
            className:
              "text-indigo-400 underline underline-offset-2 hover:text-indigo-300",
          },
          m.text,
        ),
      );
    } else {
      const href = buildIssueHref(m.text, ctx);
      if (href) {
        result.push(
          createElement(
            "a",
            {
              key: `al-${keyCounter++}`,
              href,
              target: "_blank",
              rel: "noopener noreferrer",
              className:
                "text-indigo-400 underline underline-offset-2 hover:text-indigo-300",
            },
            m.text,
          ),
        );
      } else {
        result.push(m.text);
      }
    }

    cursor = m.index + m.length;
  }

  if (cursor < text.length) {
    result.push(text.slice(cursor));
  }

  return result;
}
