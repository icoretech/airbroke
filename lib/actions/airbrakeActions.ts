'use server';

import { prisma } from '@/lib/db';
import { Notifier as AirbrakeNodeNotifier } from '@airbrake/node';
import { revalidatePath } from 'next/cache';

export async function sendAirbrakeNodeException(projectId: string, host: string) {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
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
    throw new Error('This is a test exception from Airbroke');
  } catch (err) {
    await airbrake.notify(err);
  }

  try {
    revalidatePath(`/projects`)
    revalidatePath(`/projects/${project.id}/notices`)
  } catch (err) {
    console.warn(err);
  }
}
