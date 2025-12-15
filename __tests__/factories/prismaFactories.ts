// __tests__/factories/prismaFactories.ts

import { faker } from "@faker-js/faker";
import { db } from "@/lib/db";
import type { Prisma, Project } from "@/prisma/generated/client";

export const createProject = async (
  overrides?: Partial<Prisma.ProjectUncheckedCreateInput>,
): Promise<Project> => {
  const defaultProject: Prisma.ProjectCreateInput = {
    name: `${faker.company.name()} - ${faker.string.uuid()}`,
    organization: faker.company.name(),
  };
  const projectData = { ...defaultProject, ...overrides };
  return await db.project.create({ data: projectData });
};
