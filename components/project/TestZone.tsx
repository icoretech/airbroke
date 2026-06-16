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
import ClientMutationError from "@/components/common/ClientMutationError";
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
import { sendAirbrakeNodeException as sendAirbrakeNodeExceptionAction } from "@/lib/actions/airbrakeActions";
import { sendSentryNodeException as sendSentryNodeExceptionAction } from "@/lib/actions/sentryActions";
import type { Project } from "@/prisma/generated/client";

type TestActionKey =
  | "airbrake-browser"
  | "airbrake-node"
  | "sentry-browser"
  | "sentry-node";

type TestAction = {
  key: TestActionKey;
  title: string;
  description: string;
  errorLabel: string;
};

const testActions: TestAction[] = [
  {
    key: "airbrake-browser",
    title: "Airbrake: JavaScript",
    description: "Simulate a client-side error in the “test” environment.",
    errorLabel: "Airbrake browser test",
  },
  {
    key: "airbrake-node",
    title: "Airbrake: Node.js",
    description:
      "Send a Node.js error to confirm server-side exception tracking.",
    errorLabel: "Airbrake Node.js test",
  },
  {
    key: "sentry-browser",
    title: "Sentry: Browser",
    description:
      "Send a client-side error through the Sentry-compatible intake.",
    errorLabel: "Sentry browser test",
  },
  {
    key: "sentry-node",
    title: "Sentry: Node.js",
    description:
      "Send a server-side error through the Sentry-compatible intake.",
    errorLabel: "Sentry Node.js test",
  },
];

function formatTestActionError(testAction: TestAction, error: unknown): string {
  if (error instanceof Error && error.message.trim()) {
    return `${testAction.errorLabel} failed: ${error.message}`;
  }

  return `${testAction.errorLabel} failed`;
}

export default function TestZone({ project }: { project: Project }) {
  const [, startTransition] = useTransition();
  const [pendingAction, setPendingAction] = useState<TestActionKey | null>(
    null,
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { refresh } = useRouter();
  const hasInitializedSentryBrowser = useRef(false);

  const runWithPending = (testAction: TestAction) => {
    setPendingAction(testAction.key);
    setErrorMessage(null);
    runTestAction(testAction.key)
      .then(() => {
        startTransition(() => refresh());
      })
      .catch((error: unknown) => {
        setErrorMessage(formatTestActionError(testAction, error));
      })
      .finally(() => {
        setPendingAction(null);
      });
  };

  const runTestAction = async (key: TestActionKey) => {
    switch (key) {
      case "airbrake-browser":
        await sendAirbrakeBrowserException();
        return;
      case "airbrake-node":
        await sendAirbrakeNodeException();
        return;
      case "sentry-browser":
        await sendSentryBrowserException();
        return;
      case "sentry-node":
        await sendSentryNodeException();
        return;
    }
  };

  const sendAirbrakeBrowserException = async () => {
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
  };

  const sendAirbrakeNodeException = async () => {
    await sendAirbrakeNodeExceptionAction(
      project.id,
      project.api_key,
      window.location.origin,
    );
  };

  const ensureSentryBrowserInitialized = () => {
    if (hasInitializedSentryBrowser.current) {
      return;
    }

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
  };

  const sendSentryBrowserException = async () => {
    ensureSentryBrowserInitialized();
    captureSentryException(
      new Error("[Sentry] This is a test exception from Airbroke"),
    );

    await flushSentry(5000);
  };

  const sendSentryNodeException = async () => {
    await sendSentryNodeExceptionAction(
      project.id,
      project.api_key,
      window.location.origin,
    );
  };

  return (
    <div className="space-y-5">
      <h2 className="text-base font-bold text-indigo-200">Test Zone</h2>
      <p className="text-sm text-gray-400">
        Send sample errors to confirm your project is receiving exceptions
        properly.
      </p>

      {testActions.map((testAction) => {
        const isPending = pendingAction === testAction.key;
        return (
          <Item key={testAction.key} variant="outline">
            <ItemMedia variant="icon">
              <SlEnergy aria-hidden="true" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{testAction.title}</ItemTitle>
              <ItemDescription>{testAction.description}</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button
                variant="outline"
                size="sm"
                onClick={() => runWithPending(testAction)}
                disabled={pendingAction !== null}
              >
                {isPending ? <Spinner /> : <SlEnergy aria-hidden="true" />}
                {isPending ? "Sending…" : "Test"}
              </Button>
            </ItemActions>
          </Item>
        );
      })}
      <ClientMutationError message={errorMessage} />
    </div>
  );
}
