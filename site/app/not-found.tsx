import type { Metadata } from "next";
import Footer from "@/components/Footer";
import { ArrowIcon } from "@/components/Icons";
import Nav from "@/components/Nav";
import { Ticket } from "@/components/Ticket";
import { REPO_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Page not found · Airbroke",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <>
      <Nav />
      <main id="main" className="roll">
        <Ticket
          stock="coral"
          label="Not found"
          route="HTTP 404"
          labelledBy="lost-title"
          className="cta lost"
        >
          <h1 className="h1" id="lost-title">
            No ticket for this page.
          </h1>
          <p className="lede">
            The address doesn&apos;t match anything on this site. The rest of
            Airbroke lives on GitHub.
          </p>
          <div className="actions">
            <a className="btn btn-ink" href="/">
              Back to Airbroke
              <ArrowIcon />
            </a>
            <a className="btn btn-white" href={REPO_URL}>
              GitHub
            </a>
          </div>
        </Ticket>
      </main>
      <Footer />
    </>
  );
}
