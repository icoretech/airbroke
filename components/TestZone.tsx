// components/TestZone.tsx

"use client";

import { Notifier as AirbrakeJsNotifier } from "@airbrake/browser";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { SlEnergy } from "react-icons/sl";
import { sendAirbrakeNodeException } from "@/app/_actions";
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
    </div>
  );
}
