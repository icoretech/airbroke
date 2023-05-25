import crypto from 'crypto';
import { prisma } from './db';

export default async function generateUniqueProjectKey(): Promise<string> {
  let unique = false
  let projectKey = ''

  while (!unique) {
    projectKey = crypto.randomBytes(16).toString('hex')
    const existingProject = await prisma.project.findUnique({
      where: { api_key: projectKey },
    })

    if (!existingProject) {
      unique = true
    }
  }

  return projectKey
}
