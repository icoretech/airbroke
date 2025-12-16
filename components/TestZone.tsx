// components/TestZone.tsx

"use client";

import { Notifier as AirbrakeJsNotifier } from "@airbrake/browser";
import {
  captureException as captureSentryException,
  flush as flushSentry,
  init as initSentry,
} from "@sentry/browser";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { SlEnergy } from "react-icons/sl";
import {
  sendAirbrakeNodeException as sendAirbrakeNodeExceptionAction,
  sendSentryNodeException as sendSentryNodeExceptionAction,
} from "@/app/_actions";
import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Spinner } from "@/components/ui/spinner";
import type { Project } from "@/prisma/generated/client";

export default function TestZone({ project }: { project: Project }) {
  const [, startTransition] = useTransition();
  const [isAirbrakeBrowserPending, setAirbrakeBrowserPending] = useState(false);
  const [isAirbrakeNodePending, setAirbrakeNodePending] = useState(false);
  const [isSentryBrowserPending, setSentryBrowserPending] = useState(false);
  const [isSentryNodePending, setSentryNodePending] = useState(false);
  const { refresh } = useRouter();
  const hasInitializedSentryBrowser = useRef(false);

  const runWithPending = (
    setPending: (next: boolean) => void,
    action: () => Promise<void>,
    label: string,
  ) => {
    setPending(true);
    action()
      .catch((e: unknown) => {
        console.error(`${label} failed`, e);
      })
      .finally(() => {
        startTransition(() => refresh());
        setPending(false);
      });
  };

  const sendAirbrakeBrowserException = () => {
    runWithPending(
      setAirbrakeBrowserPending,
      async () => {
        const airbrake = new AirbrakeJsNotifier({
          projectId: 1,
          projectKey: project.api_key,
          environment: "test",
          host: window.location.origin,
          remoteConfig: false,
          performanceStats: false,
          queryStats: false,
        });

        await airbrake.notify(
          new Error("[AirbrakeJs] This is a test exception from Airbroke"),
        );
      },
      "Airbrake browser test",
    );
  };

  const sendAirbrakeNodeException = () => {
    runWithPending(
      setAirbrakeNodePending,
      async () => {
        await sendAirbrakeNodeExceptionAction(
          project.id,
          project.api_key,
          window.location.origin,
        );
      },
      "Airbrake Node.js test",
    );
  };

  const sendSentryBrowserException = () => {
    runWithPending(
      setSentryBrowserPending,
      async () => {
        if (!hasInitializedSentryBrowser.current) {
          const hostUrl = new URL(window.location.origin);
          initSentry({
            // Sentry's DSN validation requires a numeric projectId in debug builds.
            // We use a placeholder DSN and route real ingestion via `tunnel`.
            dsn: `https://${project.api_key}@${hostUrl.host}/1`,
            environment: "test",
            release: "airbroke-test@1.0.0",
            tunnel: `${window.location.origin}/api/sentry/${project.id}/envelope?sentry_key=${project.api_key}`,
            tracesSampleRate: 0,
            sampleRate: 1,
            sendClientReports: false,
            sendDefaultPii: false,
            maxBreadcrumbs: 0,
            defaultIntegrations: false,
            integrations: [],
            beforeSend(event) {
              event.user = undefined;
              event.request = undefined;
              event.tags = undefined;
              event.extra = undefined;
              event.contexts = undefined;
              event.breadcrumbs = undefined;
              return event;
            },
          });
          hasInitializedSentryBrowser.current = true;
        }

        captureSentryException(
          new Error("[Sentry] This is a test exception from Airbroke"),
        );

        await flushSentry(5000);
      },
      "Sentry browser test",
    );
  };

  const sendSentryNodeException = () => {
    runWithPending(
      setSentryNodePending,
      async () => {
        await sendSentryNodeExceptionAction(
          project.id,
          project.api_key,
          window.location.origin,
        );
      },
      "Sentry Node.js test",
    );
  };

  return (
    <div className="space-y-5">
      <h2 className="text-base font-bold text-indigo-200">Test Zone</h2>
      <p className="text-sm text-gray-400">
        Send sample errors to confirm your project is receiving exceptions
        properly.
      </p>

      {/* Airbrake JavaScript Test (shadcn Item 1:1) */}
      <Item variant="outline">
        <ItemMedia variant="icon">
          <SlEnergy aria-hidden="true" />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Airbrake: JavaScript</ItemTitle>
          <ItemDescription>
            Simulate a client-side error in the “test” environment.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button
            variant="outline"
            size="sm"
            onClick={sendAirbrakeBrowserException}
            disabled={isAirbrakeBrowserPending}
          >
            {isAirbrakeBrowserPending ? (
              <Spinner />
            ) : (
              <SlEnergy aria-hidden="true" />
            )}
            {isAirbrakeBrowserPending ? "Sending…" : "Test"}
          </Button>
        </ItemActions>
      </Item>

      {/* Airbrake Node.js Test (shadcn Item 1:1) */}
      <Item variant="outline">
        <ItemMedia variant="icon">
          <SlEnergy aria-hidden="true" />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Airbrake: Node.js</ItemTitle>
          <ItemDescription>
            Send a Node.js error to confirm server-side exception tracking.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button
            variant="outline"
            size="sm"
            onClick={sendAirbrakeNodeException}
            disabled={isAirbrakeNodePending}
          >
            {isAirbrakeNodePending ? (
              <Spinner />
            ) : (
              <SlEnergy aria-hidden="true" />
            )}
            {isAirbrakeNodePending ? "Sending…" : "Test"}
          </Button>
        </ItemActions>
      </Item>
      {/* Sentry Browser Test */}
      <Item variant="outline">
        <ItemMedia variant="icon">
          <SlEnergy aria-hidden="true" />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Sentry: Browser</ItemTitle>
          <ItemDescription>
            Send a client-side error through the Sentry-compatible intake.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button
            variant="outline"
            size="sm"
            onClick={sendSentryBrowserException}
            disabled={isSentryBrowserPending}
          >
            {isSentryBrowserPending ? (
              <Spinner />
            ) : (
              <SlEnergy aria-hidden="true" />
            )}
            {isSentryBrowserPending ? "Sending…" : "Test"}
          </Button>
        </ItemActions>
      </Item>

      {/* Sentry Node.js Test */}
      <Item variant="outline">
        <ItemMedia variant="icon">
          <SlEnergy aria-hidden="true" />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Sentry: Node.js</ItemTitle>
          <ItemDescription>
            Send a server-side error through the Sentry-compatible intake.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button
            variant="outline"
            size="sm"
            onClick={sendSentryNodeException}
            disabled={isSentryNodePending}
          >
            {isSentryNodePending ? (
              <Spinner />
            ) : (
              <SlEnergy aria-hidden="true" />
            )}
            {isSentryNodePending ? "Sending…" : "Test"}
          </Button>
        </ItemActions>
      </Item>
    </div>
  );
}
