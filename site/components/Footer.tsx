import {
  HELM_URL,
  ICORETECH_URL,
  LICENSE_URL,
  RELEASES_URL,
  REPO_URL,
  X_HANDLE,
  X_URL,
} from "@/lib/site";
import { GitHubIcon, XIcon } from "./Icons";
import { Lockup } from "./Logo";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="foot-in">
        <div className="foot-brand">
          <a href="/" aria-label="Airbroke home">
            <Lockup className="lockup" />
          </a>
          <p>The self-hosted, open-source error catcher.</p>
        </div>
        <nav className="foot-links" aria-label="Project">
          <a href={REPO_URL}>
            <GitHubIcon />
            GitHub
          </a>
          <a href={X_URL}>
            <XIcon />
            {X_HANDLE}
          </a>
          <a href={LICENSE_URL}>MIT license</a>
          <a href={RELEASES_URL}>Releases</a>
          <a href={HELM_URL}>Helm chart</a>
        </nav>
      </div>
      <div className="foot-bottom">
        <p>
          © {year} <a href={ICORETECH_URL}>iCoreTech</a>
        </p>
        <p>
          Airbrake and Sentry are trademarks of their respective owners.
          Airbroke is an independent project and is not affiliated with them.
        </p>
      </div>
    </footer>
  );
}
