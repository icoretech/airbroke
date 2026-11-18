import type { CSSProperties, ReactNode } from "react";

export type Stock = "coral" | "white" | "ink" | "lilac";

// One ticket on the roll: a stub printed with what the section is about, a
// perforated tear line, and the body. Sections are tickets of different stock.
export function Ticket({
  id,
  stock,
  label,
  route,
  stub,
  labelledBy,
  className,
  children,
}: {
  id?: string;
  stock: Stock;
  label: string;
  route: string;
  stub?: ReactNode;
  labelledBy: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={`ticket stock-${stock}${className ? ` ${className}` : ""}`}
      aria-labelledby={labelledBy}
    >
      <div className="stub" aria-hidden="true">
        <span className="stub-hole" />
        <span className="stub-text">
          <span className="stub-label">{label}</span>
          <span className="stub-route">{route}</span>
        </span>
        {stub}
      </div>
      <div className="ticket-body">{children}</div>
    </section>
  );
}

// The tear line between two tickets: a row of punched holes with a notch at
// each edge, the top half in the upper ticket's stock and the lower in the next.
export function Seam({ from, to }: { from: Stock; to: Stock }) {
  return (
    <div
      className="seam"
      style={
        {
          "--from": `var(--stock-${from})`,
          "--to": `var(--stock-${to})`,
        } as CSSProperties
      }
      aria-hidden="true"
    />
  );
}
