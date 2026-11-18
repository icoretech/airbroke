import { NAV, REPO_URL, SETUP_URL } from "@/lib/site";
import { GitHubIcon } from "./Icons";
import { Lockup } from "./Logo";
import NavMenu from "./NavMenu";

export default function Nav() {
  return (
    <header className="nav">
      <div className="nav-in">
        <a className="brand" href="/" aria-label="Airbroke home">
          <Lockup className="lockup" />
        </a>
        <nav className="nav-links" aria-label="Sections">
          {NAV.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="nav-actions">
          <a className="btn btn-white btn-sm nav-gh" href={REPO_URL}>
            <GitHubIcon />
            GitHub
          </a>
          <a className="btn btn-coral btn-sm nav-start" href={SETUP_URL}>
            Set it up
          </a>
          <NavMenu />
        </div>
      </div>
    </header>
  );
}
