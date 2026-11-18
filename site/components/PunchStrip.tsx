"use client";

import { useEffect, useRef, useState } from "react";

// The hero's one moving part: reports arrive from three SDKs and punch the
// ticket of their occurrence, whose counter moves instead of a new row being
// stored (lib/intake/upsertNoticeOccurrence.ts). It runs only while visible and
// not at all with reduced motion; without JavaScript the counts simply stand.

type Row = {
  sdk: string;
  route: string;
  kind: string;
  message: string;
  where: string;
  count: number;
  weight: number;
};

const ROWS: Row[] = [
  {
    sdk: "airbrake-ruby",
    route: "POST /api/v3/notices",
    kind: "Net::ReadTimeout",
    message: "Net::ReadTimeout with #<TCPSocket:(closed)>",
    where: "checkout-api · production",
    count: 1180,
    weight: 5,
  },
  {
    sdk: "@sentry/browser",
    route: "POST /api/sentry/…/envelope",
    kind: "TypeError",
    message: "Cannot read properties of undefined (reading 'variantId')",
    where: "storefront-web · production",
    count: 883,
    weight: 3,
  },
  {
    sdk: "pybrake",
    route: "POST /api/v3/notices",
    kind: "KeyError",
    message: "'invoice_id'",
    where: "billing-worker · production",
    count: 388,
    weight: 2,
  },
];

const TOTAL_WEIGHT = ROWS.reduce((sum, row) => sum + row.weight, 0);
const format = new Intl.NumberFormat("en-US");

function pick(): number {
  let roll = Math.random() * TOTAL_WEIGHT;
  for (let index = 0; index < ROWS.length; index++) {
    roll -= ROWS[index].weight;
    if (roll <= 0) return index;
  }
  return 0;
}

export default function PunchStrip() {
  const [counts, setCounts] = useState(() => ROWS.map((row) => row.count));
  const [packets, setPackets] = useState<{ id: number; row: number }[]>([]);
  const [punched, setPunched] = useState<number | null>(null);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = root.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let visible = false;
    let interval = 0;
    let nextId = 0;
    const timers = new Set<number>();
    const later = (fn: () => void, ms: number) => {
      const timer = window.setTimeout(() => {
        timers.delete(timer);
        fn();
      }, ms);
      timers.add(timer);
    };

    const tick = () => {
      const row = pick();
      const id = nextId++;
      setPackets((current) => [...current, { id, row }]);
      later(() => {
        setPackets((current) => current.filter((packet) => packet.id !== id));
        setCounts((current) =>
          current.map((value, index) => (index === row ? value + 1 : value)),
        );
        setPunched(row);
        later(() => setPunched((value) => (value === row ? null : value)), 520);
      }, 760);
    };

    const sync = () => {
      const run = visible && document.visibilityState === "visible";
      if (run && !interval) {
        tick();
        interval = window.setInterval(tick, 1350);
      } else if (!run && interval) {
        window.clearInterval(interval);
        interval = 0;
      }
    };

    const observer = new IntersectionObserver((entries) => {
      visible = entries.some((entry) => entry.isIntersecting);
      sync();
    });
    observer.observe(node);
    document.addEventListener("visibilitychange", sync);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      window.clearInterval(interval);
      for (const timer of timers) window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const serial = document.getElementById("hero-serial");
    if (serial) {
      serial.textContent = String(counts.reduce((a, b) => a + b, 0)).padStart(
        7,
        "0",
      );
    }
  }, [counts]);

  return (
    <div className="punch" ref={root} aria-hidden="true">
      {ROWS.map((row, index) => (
        <div
          key={row.kind}
          className={`punch-row${punched === index ? " is-punched" : ""}`}
        >
          <div className="punch-lane">
            <span className="punch-sdk">{row.sdk}</span>
            <span className="punch-route">{row.route}</span>
            <span className="punch-wire">
              {packets
                .filter((packet) => packet.row === index)
                .map((packet) => (
                  <i key={packet.id} className="punch-packet" />
                ))}
            </span>
          </div>
          <div className="mini">
            <div className="mini-body">
              <b className="mini-kind">{row.kind}</b>
              <span className="mini-msg">{row.message}</span>
              <span className="mini-where">{row.where}</span>
            </div>
            <div className="mini-stub">
              <span className="mini-x">seen</span>
              <span className="mini-count">{format.format(counts[index])}</span>
              <span className="mini-stamp">+1</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
