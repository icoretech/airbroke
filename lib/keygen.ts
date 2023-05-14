import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

export default async function generateUniqueProjectKey(prisma: PrismaClient,
): Promise<string> {
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
