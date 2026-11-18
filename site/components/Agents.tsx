import { MCP_URL } from "@/lib/site";
import Code from "./Code";
import { ArrowIcon } from "./Icons";
import { Ticket } from "./Ticket";

// lib/mcp/tools/*, lib/mcp/server.ts (readOnlyHint, static key, origin check)
// and the README's MCP section.
const TOOLS = [
  ["airbroke_list_projects", "Find projects by name or organization"],
  ["airbroke_get_project", "One project, by id or an unambiguous name"],
  ["airbroke_list_notices", "A project's notices, with or without resolved"],
  ["airbroke_get_notice", "A notice with its latest and most seen occurrences"],
  [
    "airbroke_list_occurrences",
    "Occurrences, with backtrace previews on request",
  ],
  ["airbroke_get_occurrence", "Full details of one occurrence, with remarks"],
  ["airbroke_search", "Search messages across projects and environments"],
  ["airbroke_get_setup_guide", "SDK snippets for a project"],
] as const;

const CONFIG = `[mcp_servers.airbroke]
url = "https://airbroke.example.com/api/mcp"

[mcp_servers.airbroke.http_headers]
X-Airbroke-Mcp-Key = "<mcp-api-key>"`;

export default function Agents() {
  return (
    <Ticket
      id="agents"
      stock="lilac"
      label="MCP"
      route="POST /api/mcp"
      labelledBy="agents-title"
    >
      <div className="split">
        <div className="split-copy">
          <h2 className="h2" id="agents-title">
            Your agent reads the same errors.
          </h2>
          <p className="lede">
            Airbroke serves a read-only MCP endpoint at <code>/api/mcp</code>.
            Give an agent one key and it can find the project, see what is
            failing, search across projects and pull a backtrace, without
            opening a browser.
          </p>
          <ul className="checks">
            <li>
              One static key, sent as a bearer token or{" "}
              <code>X-Airbroke-Mcp-Key</code>
            </li>
            <li>Every tool reads; none can resolve, edit or delete</li>
            <li>
              Browser clients only from the same origin or the origins you list
            </li>
          </ul>
          <Code code={CONFIG} lang="toml" title="Codex MCP config" />
          <a className="more" href={MCP_URL}>
            MCP setup in the README
            <ArrowIcon />
          </a>
        </div>
        <div className="split-side">
          <ol className="tools" aria-label="MCP tools">
            {TOOLS.map(([name, text]) => (
              <li key={name}>
                <code>{name}</code>
                <span>{text}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Ticket>
  );
}
