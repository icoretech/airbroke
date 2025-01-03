// __tests__/factories/prismaFactories.ts

import { prisma } from '@/lib/db';
import { faker } from '@faker-js/faker';
import type { HourlyOccurrence, Notice, Occurrence, Prisma, Project } from '@prisma/client';

export const createProject = async (overrides?: Partial<Prisma.ProjectUncheckedCreateInput>): Promise<Project> => {
  const defaultProject: Prisma.ProjectCreateInput = {
    name: `${faker.company.name()} - ${faker.string.uuid()}`,
    organization: faker.company.name(),
  };
  const projectData = { ...defaultProject, ...overrides };
  return await prisma.project.create({ data: projectData });
};

export const createNotice = async (
  project_id: string,
  overrides?: Partial<Prisma.NoticeUncheckedCreateInput>
): Promise<Notice> => {
  const defaultNotice: Prisma.NoticeUncheckedCreateInput = {
    project_id: project_id,
    env: faker.lorem.word(),
    kind: faker.lorem.word(),
  };

  const noticeData = { ...defaultNotice, ...overrides };
  return await prisma.notice.create({ data: noticeData });
};

export const createOccurrence = async (
  notice_id: string,
  overrides?: Partial<Prisma.OccurrenceUncheckedCreateInput>
): Promise<Occurrence> => {
  const defaultOccurrence: Prisma.OccurrenceUncheckedCreateInput = {
    notice_id: notice_id,
    message: faker.lorem.sentence(5),
  };

  const occurrenceData = { ...defaultOccurrence, ...overrides };
  return await prisma.occurrence.create({ data: occurrenceData });
};

export const createOccurrenceSummary = async (
  occurrence_id: string,
  overrides?: Partial<Prisma.HourlyOccurrenceUncheckedCreateInput>
): Promise<HourlyOccurrence> => {
  const defaultOccurrenceSummary: Prisma.HourlyOccurrenceUncheckedCreateInput = {
    occurrence_id: occurrence_id,
    interval_start: faker.date.between({ from: '2000-01-01T00:00:00.000Z', to: '2022-12-31T23:59:59.999Z' }),
    interval_end: faker.date.between({ from: '2023-01-01T00:00:00.000Z', to: '2030-12-31T23:59:59.999Z' }),
  };

  const occurrenceSummaryData = { ...defaultOccurrenceSummary, ...overrides };
  return await prisma.hourlyOccurrence.create({ data: occurrenceSummaryData });
};
