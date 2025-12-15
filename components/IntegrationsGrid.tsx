// components/IntegrationsGrid.tsx

"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { integrations } from "@/lib/integrationsData";
import { CodeBlock } from "./CodeBlock";
import type { IntegrationItem } from "@/lib/integrationsData";

interface IntegrationsGridProps {
  replacements: Record<string, string>;
}

function replacePlaceholders(
  template: string,
  replacements: Record<string, string>,
) {
  let result = template;
  for (const key in replacements) {
    const find = `{${key}}`;
    result = result.split(find).join(replacements[key]);
  }
  return result;
}

export default function IntegrationsGrid({
  replacements,
}: IntegrationsGridProps) {
  const [selected, setSelected] = useState<IntegrationItem | null>(null);

  const handleSelect = (item: IntegrationItem) => {
    setSelected(item);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) setSelected(null);
  };

  return (
    <div className="space-y-4">
      {/* Info banner */}
      <div className="relative rounded-lg bg-gray-900 px-4 py-3 text-sm text-gray-100 shadow-md sm:px-6">
        <p className="leading-5">
          <strong className="font-semibold text-indigo-300">Heads up!</strong>{" "}
          Airbroke is an Airbrake-compatible error collector. Simply install an
          official Airbrake SDK in your project and configure it to point to
          Airbroke. Below are example snippets showing how to configure
          Airbrake. Remember to disable extra performance stats or remote config
          options, so only error notifications are sent to Airbroke.
        </p>
      </div>

      {/* Integration cards */}
      <Dialog onOpenChange={handleOpenChange}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {integrations.map((item) => {
            const Icon = item.icon;

            return (
              <DialogTrigger asChild key={item.name}>
                <button
                  type="button"
                  onClick={() => handleSelect(item)}
                  className="cursor-pointer rounded-lg border border-white/10 bg-gray-900 p-4 text-left shadow-md transition-colors hover:border-indigo-500 hover:bg-airbroke-600"
                >
                  <div className="mb-1 flex items-center gap-2">
                    {Icon ? (
                      <span className="text-indigo-300 text-lg leading-none">
                        <Icon />
                      </span>
                    ) : null}
                    <h3 className="text-sm font-semibold text-white">
                      {item.name}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-300">
                    Click to view code snippet
                  </p>
                </button>
              </DialogTrigger>
            );
          })}
        </div>

        <DialogContent className="grid max-h-[85vh] w-[calc(100vw-2rem)] max-w-5xl grid-rows-[auto,minmax(0,1fr)] overflow-hidden border-white/10 bg-slate-900 p-0 text-white">
          <DialogHeader className="border-b border-white/10 px-4 py-2.5">
            <DialogTitle className="text-base font-semibold text-gray-100">
              {selected?.name ?? "Snippet"}
            </DialogTitle>
          </DialogHeader>

          <div className="min-h-0 min-w-0 overflow-y-auto px-4 pb-4 pt-2">
            {selected ? (
              <CodeBlock
                language={selected.language}
                filename={selected.filename}
                code={replacePlaceholders(selected.code, replacements)}
              />
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
