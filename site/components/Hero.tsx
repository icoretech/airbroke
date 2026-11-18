import { REPO_URL, SETUP_URL } from "@/lib/site";
import { ArrowIcon, GitHubIcon } from "./Icons";
import { Mark } from "./Logo";
import PunchStrip from "./PunchStrip";
import { Ticket } from "./Ticket";

export default function Hero() {
  return (
    <Ticket
      stock="coral"
      label="Admit every error"
      route="github.com/icoretech/airbroke"
      labelledBy="hero-title"
      className="hero"
      stub={
        <span className="stub-serial">
          <Mark className="stub-mark" />
          <span className="stub-no">No.</span>
          <span id="hero-serial">0002451</span>
        </span>
      }
    >
      <h1 className="h1" id="hero-title">
        Keep your SDKs.
        <br /> Own your errors.
      </h1>
      <p className="lede hero-lede">
        Airbroke is an open-source error catcher you run yourself. Point the
        Airbrake notifiers or Sentry SDKs you already ship at it, and every
        error lands in your own PostgreSQL, grouped, counted and ready to
        replay.
      </p>
      <div className="actions">
        <a className="btn btn-ink" href={SETUP_URL}>
          Set it up
          <ArrowIcon />
        </a>
        <a className="btn btn-white" href={REPO_URL}>
          <GitHubIcon />
          View on GitHub
        </a>
      </div>
      <ul className="facts" aria-label="At a glance">
        <li>MIT licensed</li>
        <li>PostgreSQL 15+</li>
        <li>Docker, Helm or one-click deploys</li>
      </ul>
      <PunchStrip />
      <p className="punch-caption">
        Same class, same message, same ticket: a repeat moves its counter
        instead of storing another copy.
      </p>
    </Ticket>
  );
}
