import Code from "./Code";
import Tabs from "./Tabs";
import { Ticket } from "./Ticket";

// Snippets trimmed from the app's own setup templates in
// lib/integrations/airbrakeConfigTemplates.ts and sentryConfigTemplates.ts.
const SNIPPETS = [
  {
    tab: "Rails",
    title: "config/initializers/airbroke.rb",
    lang: "ruby" as const,
    code: `Airbrake.configure do |config|
  config.project_id = 1 # any number will do
  config.project_key = '<project-key>'
  config.host = 'https://airbroke.example.com'
  config.environment = Rails.env
  config.performance_stats = false # errors only
end`,
  },
  {
    tab: "Node.js",
    title: "airbroke.js",
    lang: "js" as const,
    code: `import { Notifier } from '@airbrake/node';

const airbrake = new Notifier({
  projectId: 1, // any number will do
  projectKey: '<project-key>',
  host: 'https://airbroke.example.com',
  environment: 'production',
  remoteConfig: false,
  performanceStats: false,
});`,
  },
  {
    tab: "Python",
    title: "airbroke.py",
    lang: "python" as const,
    code: `import pybrake

notifier = pybrake.Notifier(
    project_id=1,  # any number will do
    project_key='<project-key>',
    host='https://airbroke.example.com',
    environment='production',
    remote_config=False,
    performance_stats=False,
)`,
  },
  {
    tab: "Sentry",
    title: "sentry.browser.ts",
    lang: "js" as const,
    code: `import { init } from '@sentry/browser';

init({
  // Airbroke takes the project key from the DSN.
  dsn: 'https://<project-key>@airbroke.example.com/1',
  tunnel: 'https://airbroke.example.com/api/sentry/<project-id>/envelope?sentry_key=<project-key>',
  tracesSampleRate: 0, // errors only
});`,
  },
];

export default function How() {
  return (
    <Ticket
      id="how"
      stock="white"
      label="Collector"
      route="POST /api/v3/notices"
      labelledBy="how-title"
    >
      <div className="split">
        <div className="split-copy">
          <h2 className="h2" id="how-title">
            Change one address. Keep the SDK.
          </h2>
          <p className="lede">
            Airbroke accepts the Airbrake v3 notice API and Sentry envelopes.
            Create a project, copy its key, and point the notifier you already
            ship at your own server.
          </p>
          <ol className="route" aria-label="Where an error goes">
            <li>
              <span className="route-k">From</span>
              <b>Your app</b>
              <span>An Airbrake notifier or a Sentry SDK</span>
            </li>
            <li>
              <span className="route-k">Via</span>
              <b>Your Airbroke</b>
              <span>
                <code>/api/v3/notices</code> or{" "}
                <code>/api/sentry/&lt;project&gt;/envelope</code>
              </span>
            </li>
            <li>
              <span className="route-k">To</span>
              <b>Your PostgreSQL</b>
              <span>
                Grouped into notices by project, environment and error class
              </span>
            </li>
          </ol>
        </div>
        <div className="split-side">
          <Tabs
            label="SDK snippets"
            labels={SNIPPETS.map((snippet) => snippet.tab)}
            listClassName="pills"
          >
            {SNIPPETS.map((snippet) => (
              <Code
                key={snippet.tab}
                code={snippet.code}
                lang={snippet.lang}
                title={snippet.title}
              />
            ))}
          </Tabs>
          <p className="fine">
            Each project page has the snippet with your address and key filled
            in, for Ruby and Rails, browser JavaScript, Node.js, Python, Swift,
            Objective-C, Android, .NET, Go, Java and PHP notifiers, and the
            Sentry browser and Node.js SDKs.
          </p>
        </div>
      </div>
    </Ticket>
  );
}
