import { LICENSE_URL, RELEASES_URL, REPO_URL, SETUP_URL } from "@/lib/site";
import { ArrowIcon, GitHubIcon } from "./Icons";
import { Ticket } from "./Ticket";

export default function FinalCta() {
  return (
    <Ticket
      stock="coral"
      label="MIT"
      route="LICENSE"
      labelledBy="cta-title"
      className="cta"
    >
      <h2 className="h2 cta-title" id="cta-title">
        Your errors, on your server.
      </h2>
      <p className="lede">
        Airbroke is open source under the MIT license, built in the open by
        iCoreTech. Read the code, run it, change it.
      </p>
      <div className="actions">
        <a className="btn btn-ink" href={SETUP_URL}>
          Set it up
          <ArrowIcon />
        </a>
        <a className="btn btn-white" href={REPO_URL}>
          <GitHubIcon />
          Star on GitHub
        </a>
      </div>
      <p className="cta-links">
        <a href={RELEASES_URL}>Releases</a>
        <a href={LICENSE_URL}>MIT license</a>
        <a href={`${REPO_URL}/issues`}>Issues</a>
      </p>
    </Ticket>
  );
}
