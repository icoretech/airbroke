// components/IntegrationsGrid.tsx

"use client";

import { useState } from "react";
import { CodeBlock } from "@/components/common/CodeBlock";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  airbrakeIntegrations,
  sentryIntegrations,
} from "@/lib/integrations/integrationsData";
import type { IntegrationItem } from "@/lib/integrations/integrationsData";

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
    <div className="flex min-w-0 flex-col gap-4">
      <ToggleGroup
        value={[provider]}
        onValueChange={(values) => {
          const next = values[0];
          if (next === "airbrake" || next === "sentry")
            handleProviderChange(next);
        }}
        variant="outline"
        size="sm"
        aria-label="SDK provider"
      >
        <ToggleGroupItem value="airbrake">Airbrake SDKs</ToggleGroupItem>
        <ToggleGroupItem value="sentry">Sentry SDKs</ToggleGroupItem>
      </ToggleGroup>

      {/* Info banner */}
      <Alert>
        <AlertTitle>SDK setup</AlertTitle>
        <AlertDescription>
          {provider === "airbrake" ? (
            <p className="leading-5">
              Airbroke is an Airbrake-compatible error collector. Simply install
              an official Airbrake SDK in your project and configure it to point
              to Airbroke. Below are example snippets showing how to configure
              Airbrake. Remember to disable extra performance stats or remote
              config options, so only error notifications are sent to Airbroke.
            </p>
          ) : (
            <p className="leading-5">
              Airbroke also supports a Sentry-compatible envelope intake. Use
              your project ID + API key with the{" "}
              <code className="break-all rounded bg-muted px-1 py-0.5">
                /api/sentry/&lt;PROJECT_ID&gt;/envelope
              </code>{" "}
              endpoint (shown as a <code>tunnel</code> in these snippets). Keep
              it errors-only by disabling tracing, sessions/outcomes, and
              default integrations.
            </p>
          )}
        </AlertDescription>
      </Alert>

      {/* Integration cards */}
      <Dialog onOpenChange={handleOpenChange}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const Icon = item.icon;

            return (
              <DialogTrigger
                key={item.name}
                render={
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleSelect(item)}
                    className="h-auto min-w-0 flex-col items-start gap-1 p-4 text-left whitespace-normal"
                  />
                }
              >
                <div className="flex items-center gap-2">
                  {Icon ? (
                    <Icon data-icon="inline-start" aria-hidden="true" />
                  ) : null}
                  <h3 className="font-semibold">{item.name}</h3>
                </div>
                <p className="text-xs text-muted-foreground">
                  Click to view code snippet
                </p>
              </DialogTrigger>
            );
          })}
        </div>

        <DialogContent className="max-h-[85dvh] overflow-y-auto sm:max-w-5xl">
          <DialogHeader>
            <DialogTitle>{selected?.name ?? "Snippet"}</DialogTitle>
            <DialogDescription>
              Configure this SDK to send errors to your project.
            </DialogDescription>
          </DialogHeader>

          <div className="min-w-0">
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
