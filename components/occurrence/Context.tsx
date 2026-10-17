// components/occurrence/Context.tsx

"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import OccurrenceKeyValuePanel from "@/components/occurrence/OccurrenceKeyValuePanel";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { isObjectWithKeys } from "@/lib/occurrenceUtils";
import type { Occurrence } from "@/prisma/generated/client";

function FlatContextView({ occurrence }: { occurrence: Occurrence }) {
  return <OccurrenceKeyValuePanel value={occurrence.context} />;
}

// -- The JSON viewer approach (using @microlink/react-json-view)
const ReactJsonView = dynamic(() => import("@microlink/react-json-view"), {
  ssr: false,
});

const customDarkTheme = {
  base00: "#141c2b",
  base01: "#192231",
  base02: "#1f2633",
  base03: "#2b3442",
  base04: "#909cb7",
  base05: "#cbd5e1",
  base06: "#e2e8f0",
  base07: "#ffffff",
  base08: "#f56565",
  base09: "#ffffff",
  base0A: "#0f131a",
  base0B: "#48bb78",
  base0C: "#81e6d9",
  base0D: "#63b3ed",
  base0E: "#b794f4",
  base0F: "#f56565",
};

function JsonContextView({ occurrence }: { occurrence: Occurrence }) {
  if (!occurrence?.context) {
    return <div className="text-sm text-gray-400">No context data</div>;
  }

  return (
    <div className="min-w-0 overflow-x-auto text-xs leading-5">
      <ReactJsonView
        src={occurrence.context as object}
        theme={customDarkTheme}
        name={false}
        collapsed={2}
        onEdit={false}
        onAdd={false}
        onDelete={false}
        enableClipboard={false}
        displayObjectSize={false}
        displayDataTypes={false}
        iconStyle="triangle"
        collapseStringsAfterLength={100}
        style={{
          backgroundColor: "transparent",
          fontFamily:
            'var(--font-roboto-mono), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
        }}
      />
    </div>
  );
}
/**
 * Main "Context" to be rendered in the 'context' tab of your page:
 * - If no context => shows "No context data"
 * - Otherwise => Switch in top-right corner, toggles between flat / JSON viewer
 */
export default function Context({ occurrence }: { occurrence: Occurrence }) {
  const [useJsonView, setUseJsonView] = useState(false);

  if (!isObjectWithKeys(occurrence.context)) {
    return <OccurrenceKeyValuePanel value={occurrence.context} />;
  }

  return (
    <div className="flex min-w-0 flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <Switch
          id="context-view-toggle"
          checked={useJsonView}
          onCheckedChange={setUseJsonView}
        />
        <Label htmlFor="context-view-toggle">Flat / JSON</Label>
      </div>

      {useJsonView ? (
        <JsonContextView occurrence={occurrence} />
      ) : (
        <FlatContextView occurrence={occurrence} />
      )}
    </div>
  );
}
