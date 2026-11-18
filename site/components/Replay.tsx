import { Ticket } from "./Ticket";

// components/occurrence/toolbox/{Curl,Replay,AI}.tsx,
// lib/actions/occurrenceActions.ts (performReplay), app/api/completion/route.ts
export default function Replay() {
  return (
    <Ticket
      id="replay"
      stock="coral"
      label="Replay"
      route="curl -v -X POST"
      labelledBy="replay-title"
    >
      <div className="split split-wide">
        <div className="split-copy">
          <h2 className="h2" id="replay-title">
            Replay the request that broke.
          </h2>
          <p className="lede">
            When an error report carries the request&apos;s URL, method and
            headers, the occurrence&apos;s toolbox turns them into a cURL
            command and can send the request again from your Airbroke server.
          </p>
          <dl className="specs">
            <div>
              <dt>cURL</dt>
              <dd>
                The recorded method, URL and headers, ready to paste into a
                terminal.
              </dd>
            </div>
            <div>
              <dt>Replay</dt>
              <dd>
                Sends the same method, URL and headers and shows the status that
                comes back, with the response body when it fails. Request bodies
                are not resent.
              </dd>
            </div>
            <div>
              <dt>Ask the AI</dt>
              <dd>
                With your OpenAI key set, explains the occurrence from its class
                and message, and from its backtrace when you ask for details.
              </dd>
            </div>
          </dl>
        </div>
        <figure className="split-side shot shot-replay">
          <div className="shot-frame">
            {/* biome-ignore lint/performance/noImgElement: a static export, sized by our own srcset */}
            <img
              src="/screens/replay-1292.webp"
              srcSet="/screens/replay-646.webp 646w, /screens/replay-1292.webp 1292w"
              sizes="(min-width: 1100px) 600px, 92vw"
              width={1292}
              height={774}
              loading="lazy"
              decoding="async"
              alt="The occurrence toolbox: a cURL command for POST /v1/checkouts/7c1e/confirm with its headers, and a replay that answered HTTP 504 with a gateway_timeout body."
            />
          </div>
          <figcaption className="fine">
            The toolbox of a <code>Net::ReadTimeout</code> occurrence: the
            replay reproduces the timeout as a 504.
          </figcaption>
        </figure>
      </div>
    </Ticket>
  );
}
