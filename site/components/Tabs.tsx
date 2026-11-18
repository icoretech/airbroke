"use client";

import { Children, type ReactNode, useId, useRef, useState } from "react";

// Accessible tabs over server-rendered panels: arrow keys, Home and End move
// between tabs, and only the selected panel is shown.
export default function Tabs({
  labels,
  label,
  className,
  listClassName,
  children,
}: {
  labels: string[];
  label: string;
  className?: string;
  listClassName?: string;
  children: ReactNode;
}) {
  const id = useId();
  const [selected, setSelected] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const panels = Children.toArray(children);

  const select = (index: number) => {
    const next = (index + labels.length) % labels.length;
    setSelected(next);
    tabs.current[next]?.focus();
  };

  return (
    <div className={className}>
      <div role="tablist" aria-label={label} className={listClassName}>
        {labels.map((text, index) => (
          <button
            key={text}
            ref={(node) => {
              tabs.current[index] = node;
            }}
            type="button"
            role="tab"
            id={`${id}-tab-${index}`}
            aria-controls={`${id}-panel-${index}`}
            aria-selected={index === selected}
            tabIndex={index === selected ? 0 : -1}
            className="tab"
            onClick={() => setSelected(index)}
            onKeyDown={(event) => {
              if (event.key === "ArrowRight") select(selected + 1);
              else if (event.key === "ArrowLeft") select(selected - 1);
              else if (event.key === "Home") select(0);
              else if (event.key === "End") select(labels.length - 1);
              else return;
              event.preventDefault();
            }}
          >
            {text}
          </button>
        ))}
      </div>
      {panels.map((panel, index) => (
        <div
          // Panels are static and never reordered.
          // biome-ignore lint/suspicious/noArrayIndexKey: fixed panel order
          key={index}
          role="tabpanel"
          id={`${id}-panel-${index}`}
          aria-labelledby={`${id}-tab-${index}`}
          hidden={index !== selected}
          className="tabpanel"
        >
          {panel}
        </div>
      ))}
    </div>
  );
}
