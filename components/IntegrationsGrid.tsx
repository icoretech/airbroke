// components/IntegrationsGrid.tsx

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  airbrakeIntegrations,
  sentryIntegrations,
} from "@/lib/integrationsData";
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
  const [provider, setProvider] = useState<"airbrake" | "sentry">("airbrake");

  const handleSelect = (item: IntegrationItem) => {
    setSelected(item);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) setSelected(null);
  };

  const handleProviderChange = (next: "airbrake" | "sentry") => {
    setProvider(next);
    setSelected(null);
  };

  const items =
    provider === "airbrake" ? airbrakeIntegrations : sentryIntegrations;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          size="sm"
          variant={provider === "airbrake" ? "secondary" : "outline"}
          onClick={() => handleProviderChange("airbrake")}
        >
          Airbrake SDKs
        </Button>
        <Button
          type="button"
          size="sm"
          variant={provider === "sentry" ? "secondary" : "outline"}
          onClick={() => handleProviderChange("sentry")}
        >
          Sentry SDKs
        </Button>
      </div>

      {/* Info banner */}
      <div className="relative rounded-lg bg-gray-900 px-4 py-3 text-sm text-gray-100 shadow-md sm:px-6">
        {provider === "airbrake" ? (
          <p className="leading-5">
            <strong className="font-semibold text-indigo-300">Heads up!</strong>{" "}
            Airbroke is an Airbrake-compatible error collector. Simply install
            an official Airbrake SDK in your project and configure it to point
            to Airbroke. Below are example snippets showing how to configure
            Airbrake. Remember to disable extra performance stats or remote
            config options, so only error notifications are sent to Airbroke.
          </p>
        ) : (
          <p className="leading-5">
            <strong className="font-semibold text-indigo-300">Heads up!</strong>{" "}
            Airbroke also supports a Sentry-compatible envelope intake. Use your
            project ID + API key with the{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-gray-100">
              /api/sentry/&lt;PROJECT_ID&gt;/envelope
            </code>{" "}
            endpoint (shown as a <code>tunnel</code> in these snippets). Keep it
            errors-only by disabling tracing, sessions/outcomes, and default
            integrations.
          </p>
        )}
      </div>

      {/* Integration cards */}
      <Dialog onOpenChange={handleOpenChange}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
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
