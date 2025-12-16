// components/TestZone.tsx

"use client";

import { Notifier as AirbrakeJsNotifier } from "@airbrake/browser";
import {
  captureException as captureSentryException,
  flush as flushSentry,
  init as initSentry,
} from "@sentry/browser";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { SlEnergy } from "react-icons/sl";
import {
  sendAirbrakeNodeException,
  sendSentryNodeException,
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
  const [isPending, startTransition] = useTransition();
  const [isSentryPending, setSentryPending] = useState(false);
  const { refresh } = useRouter();

  const sendAirbrakeJsException = async () => {
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
    startTransition(() => refresh());
  };

  const sendAirbrakeNode = () => {
    startTransition(() => {
      sendAirbrakeNodeException(
        project.id,
        project.api_key,
        window.location.origin,
      );
    });
  };

  const sendSentryBrowser = async () => {
    setSentryPending(true);
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
      defaultIntegrations: false,
      integrations: [],
      beforeSend(event) {
        event.user = undefined;
        return event;
      },
    });

    const err = new Error("[Sentry] This is a test exception from Airbroke");
    captureSentryException(err);

    await flushSentry(5000).catch((e) => {
      console.error("Sentry browser test flush failed", e);
    });

    startTransition(() => refresh());
    setSentryPending(false);
  };

  const sendSentryNode = async () => {
    setSentryPending(true);
    await sendSentryNodeException(
      project.id,
      project.api_key,
      window.location.origin,
    ).catch((e) => {
      console.error("Sentry node test failed", e);
    });

    startTransition(() => refresh());
    setSentryPending(false);
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
            onClick={sendAirbrakeJsException}
            disabled={isPending}
          >
            {isPending ? <Spinner /> : <SlEnergy aria-hidden="true" />}
            {isPending ? "Sending…" : "Test"}
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
            onClick={sendAirbrakeNode}
            disabled={isPending}
          >
            {isPending ? <Spinner /> : <SlEnergy aria-hidden="true" />}
            {isPending ? "Sending…" : "Test"}
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
            onClick={sendSentryBrowser}
            disabled={isPending || isSentryPending}
          >
            {isPending || isSentryPending ? (
              <Spinner />
            ) : (
              <SlEnergy aria-hidden="true" />
            )}
            {isPending || isSentryPending ? "Sending…" : "Test"}
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
            onClick={sendSentryNode}
            disabled={isPending || isSentryPending}
          >
            {isPending || isSentryPending ? (
              <Spinner />
            ) : (
              <SlEnergy aria-hidden="true" />
            )}
            {isPending || isSentryPending ? "Sending…" : "Test"}
          </Button>
        </ItemActions>
      </Item>
    </div>
  );
}
