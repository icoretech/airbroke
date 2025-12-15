// lib/actions/airbrakeActions.ts

"use server";

import { Notifier as AirbrakeNodeNotifier } from "@airbrake/node";
import { revalidatePath } from "next/cache";

export async function sendAirbrakeNodeException(
  projectId: string,
  apiKey: string,
  host: string,
) {
  const airbrake = new AirbrakeNodeNotifier({
    projectId: 1,
    projectKey: apiKey,
    environment: "test",
    host: host,
    remoteConfig: false,
    performanceStats: false,
    queryStats: false,
    queueStats: false,
  });

  try {
    throw new Error("[AirbrakeNode] This is a test exception from Airbroke");
  } catch (err) {
    await airbrake.notify(err);
  }

  revalidatePath(`/projects/${projectId}`);
}
