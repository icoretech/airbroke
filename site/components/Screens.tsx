import Tabs from "./Tabs";
import { Ticket } from "./Ticket";

// Captures of the real app (dark theme, 1280x800 at 2x) from a local stack
// seeded with synthetic projects and errors sent through its own collectors.
// Captions are sourced from the components and queries named beside them.
const SCREENS: {
  tab: string;
  file: string;
  height?: number;
  title: string;
  text: string;
  alt: string;
}[] = [
  {
    tab: "Projects",
    file: "projects",
    height: 520,
    title: "Every project at a glance",
    // app/projects/page.tsx, lib/queries/projectChartOccurrences.ts, components/layout/TopbarSearch.tsx
    text: "Grouped by organization, each with 14 days of hourly activity behind it. Search with ⌘K.",
    alt: "The Airbroke projects page: six projects in two organizations, each row with an hourly activity chart and a notice count.",
  },
  {
    tab: "Notices",
    file: "notices",
    title: "Notices by class and environment",
    // components/notice/StatusFilter.tsx, app/projects/[project_id]/Sort.tsx, NoticesWithBulkActions.tsx
    text: "Filter by status and environment, sort by last seen, count, class or environment, and resolve in bulk.",
    alt: "The checkout-api project: its repository, API key and five unresolved production notices with counts and resolve buttons.",
  },
  {
    tab: "Backtrace",
    file: "backtrace",
    title: "Frames that open your code",
    // components/occurrence/BacktraceLine.tsx, lib/gitProvider.ts
    text: "Frames from your project link to the file and line on GitHub, GitLab, Bitbucket or Gitea, beside the context, environment, session and params.",
    alt: "An occurrence of Net::ReadTimeout with its backtrace; frames under the project root are highlighted as links.",
  },
  {
    tab: "Chart",
    file: "chart",
    title: "Fourteen days, hour by hour",
    // lib/queries/hourlyOccurrenceWindow.ts, components/occurrence/OccurrenceChartWrapper.tsx
    text: "Every occurrence charts its hourly count, so a spike after a deploy stands out.",
    alt: "The hourly occurrence chart for the past 14 days, with a daily rhythm and one sharp spike.",
  },
  {
    tab: "Remarks",
    file: "remarks",
    title: "Notes that stay with the error",
    // components/remark/*, components/occurrence/BookmarkButton.tsx
    text: "Leave remarks on a notice or a single occurrence, bookmark the ones to come back to, and resolve when it's fixed.",
    alt: "A remark from a teammate on the Net::ReadTimeout occurrence, with Resolve and Bookmarked buttons above.",
  },
  {
    tab: "Overview",
    file: "overview",
    title: "Health and a test zone",
    // components/analytics/*, components/project/TestZone.tsx
    text: "Activity, incoming rate and a test zone that sends a sample error through each collector.",
    alt: "The project overview: a 14-day activity chart, health counters, settings and a test zone for Airbrake and Sentry.",
  },
];

export default function Screens() {
  return (
    <Ticket
      id="ui"
      stock="ink"
      label="Triage"
      route="GET /projects"
      labelledBy="ui-title"
    >
      <div className="head">
        <h2 className="h2" id="ui-title">
          Built for the morning after a deploy.
        </h2>
        <p className="lede">
          Projects, notices and occurrences in one dense, dark interface:
          backtraces that open your code, request context, hourly charts,
          resolve, bookmarks and remarks.
        </p>
      </div>
      <Tabs
        label="Airbroke screens"
        labels={SCREENS.map((screen) => screen.tab)}
        className="gallery"
        listClassName="pills pills-dark"
      >
        {SCREENS.map((screen) => (
          <figure key={screen.file} className="shot">
            <a
              className="shot-frame"
              href={`/screens/${screen.file}-2560.webp`}
              aria-label={`${screen.tab}: open the full-size screenshot`}
            >
              {/* biome-ignore lint/performance/noImgElement: a static export, sized by our own srcset */}
              <img
                src={`/screens/${screen.file}-1280.webp`}
                srcSet={`/screens/${screen.file}-1280.webp 1280w, /screens/${screen.file}-2560.webp 2560w`}
                sizes="(min-width: 1400px) 1160px, 92vw"
                width={1280}
                height={screen.height ?? 800}
                loading="lazy"
                decoding="async"
                alt={screen.alt}
              />
            </a>
            <figcaption>
              <b>{screen.title}</b>
              <span>{screen.text}</span>
            </figcaption>
          </figure>
        ))}
      </Tabs>
    </Ticket>
  );
}
