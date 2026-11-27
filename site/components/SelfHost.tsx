import {
  AUTH_URL,
  CONFIG_URL,
  HELM_URL,
  IMAGE_URL,
  RAILWAY_URL,
  SETUP_URL,
} from "@/lib/site";
import Code from "./Code";
import { ArrowIcon } from "./Icons";
import { Ticket } from "./Ticket";

// README "Deployment Options" and "System Requirements", .github/workflows/build.yml
// (amd64 and arm64 images), the icoretech/helm airbroke chart, lib/auth/*.
const WAYS = [
  {
    name: "Docker",
    where: "ghcr.io/icoretech/airbroke",
    text: "Images for amd64 and arm64, tagged by version, minor and latest.",
    href: IMAGE_URL,
  },
  {
    name: "Kubernetes",
    where: "oci://ghcr.io/icoretech/charts/airbroke",
    text: "A Helm chart that runs migrations before start, with PgBouncer as an option.",
    href: HELM_URL,
  },
  {
    name: "One click",
    where: "Vercel · Render · Railway · Netlify · Heroku",
    text: "Deploy buttons in the README. Railway's template adds PostgreSQL 18 and generated secrets.",
    href: RAILWAY_URL,
  },
  {
    name: "Compose",
    where: "make build && make run",
    text: "The repository's Compose stack runs Airbroke beside PostgreSQL 19.",
    href: SETUP_URL,
  },
] as const;

const HELM = `helm install airbroke \\
  oci://ghcr.io/icoretech/charts/airbroke \\
  --set database.url="$DATABASE_URL" \\
  --set database.migrations_url="$DIRECT_URL"`;

export default function SelfHost() {
  return (
    <Ticket
      id="self-host"
      stock="white"
      label="Deploy"
      route="ghcr.io/icoretech/airbroke"
      labelledBy="self-host-title"
    >
      <div className="head">
        <h2 className="h2" id="self-host-title">
          Runs on your servers, signs in your people.
        </h2>
        <p className="lede">
          Airbroke is a Next.js server and a PostgreSQL database, nothing else
          to run. Pick the way you already deploy things.
        </p>
      </div>
      <ul className="timetable">
        {WAYS.map((way) => (
          <li key={way.name}>
            <a href={way.href}>
              <b>{way.name}</b>
              <code>
                {way.where
                  .split("/")
                  .flatMap((part, index) =>
                    index === 0 ? [part] : [<wbr key={part} />, `/${part}`],
                  )}
              </code>
              <span>{way.text}</span>
              <ArrowIcon />
            </a>
          </li>
        ))}
      </ul>
      <div className="split split-even">
        <div>
          <Code code={HELM} lang="sh" title="Kubernetes" />
          <p className="fine">
            Add your sign-in settings as well; the chart&apos;s README lists
            every value, and <a href={CONFIG_URL}>the setup notes</a> cover
            connection pooling and migrations.
          </p>
        </div>
        <dl className="specs specs-grid">
          <div>
            <dt>Needs</dt>
            <dd>
              PostgreSQL 15+, 8 free connections per instance, about 300 MB of
              memory and one CPU core.
            </dd>
          </div>
          <div>
            <dt>Sign-in</dt>
            <dd>
              GitHub, GitLab, Google, Microsoft Entra ID, Okta, Keycloak and ten
              more OAuth providers, limited to your organization, group,
              workspace, tenant or email domain.{" "}
              <a href={AUTH_URL}>Providers</a>
            </dd>
          </div>
          <div>
            <dt>Errors only</dt>
            <dd>
              Airbroke stores errors and their hourly counts, not traces or
              performance data; the snippets switch those SDK features off.
            </dd>
          </div>
        </dl>
      </div>
    </Ticket>
  );
}
