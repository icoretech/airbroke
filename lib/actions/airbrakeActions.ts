'use server';

import { getProjectById } from '@/lib/queries/projects';
import { Notifier as AirbrakeNodeNotifier } from '@airbrake/node';
import { revalidateTag } from 'next/cache';

export async function sendAirbrakeNodeException(projectId: string, host: string) {
  const project = await getProjectById(projectId);
  if (!project) {
    throw new Error('Project not found');
  }

  const airbrake = new AirbrakeNodeNotifier({
    projectId: 1,
    projectKey: project.api_key,
    environment: 'test',
    host: host,
    remoteConfig: false,
    performanceStats: false,
    queryStats: false,
  });

  try {
    throw new Error('[AirbrakeNode] This is a test exception from Airbroke');
  } catch (err) {
    await airbrake.notify(err);
  }

  try {
    revalidateTag('projects');
    revalidateTag(`project_${projectId}`);
  } catch (err) {
    console.warn(err);
  }
}
