import type { Prisma, PrismaClient, hourly_occurrence, notice, occurrence, project } from '@prisma/client';
import Chance from 'chance';

const chance = new Chance();

export const createProject = async (prismaInstance: PrismaClient, overrides?: Partial<Prisma.projectUncheckedCreateInput>): Promise<project> => {
  const defaultProject: Prisma.projectCreateInput = {
    name: chance.company(),
    api_key: chance.guid(),
    organization: chance.company(),
  };

  const projectData = { ...defaultProject, ...overrides };
  return await prismaInstance.project.create({ data: projectData });
};

export const projectAttributes = (overrides?: Partial<Prisma.projectUncheckedCreateInput>): Prisma.projectUncheckedCreateInput => {
  const defaultProject: Prisma.projectUncheckedCreateInput = {
    name: chance.company(),
    api_key: chance.guid(),
    organization: chance.company(),
  };

  return { ...defaultProject, ...overrides };
};

export const createNotice = async (prismaInstance: PrismaClient, project_id: bigint, overrides?: Partial<Prisma.noticeUncheckedCreateInput>): Promise<notice> => {
  const defaultNotice: Prisma.noticeUncheckedCreateInput = {
    project_id: project_id,
    env: chance.word(),
    kind: chance.word(),
  };

  const noticeData = { ...defaultNotice, ...overrides };
  return await prismaInstance.notice.create({ data: noticeData });
};

export const createOccurrence = async (prismaInstance: PrismaClient, notice_id: bigint, overrides?: Partial<Prisma.occurrenceUncheckedCreateInput>): Promise<occurrence> => {
  const defaultOccurrence: Prisma.occurrenceUncheckedCreateInput = {
    notice_id: notice_id,
    message: chance.sentence({ words: 5 }),
  };

  const occurrenceData = { ...defaultOccurrence, ...overrides };
  return await prismaInstance.occurrence.create({ data: occurrenceData });
};

export const createOccurrenceSummary = async (prismaInstance: PrismaClient, occurrence_id: bigint, overrides?: Partial<Prisma.hourly_occurrenceUncheckedCreateInput>): Promise<hourly_occurrence> => {
  const defaultOccurrenceSummary: Prisma.hourly_occurrenceUncheckedCreateInput = {
    occurrence_id: occurrence_id,
    interval_start: chance.date({ year: parseInt(chance.year({ min: 2000, max: 2022 })) }),
    interval_end: chance.date({ year: parseInt(chance.year({ min: 2023, max: 2030 })) }),
  };

  const occurrenceSummaryData = { ...defaultOccurrenceSummary, ...overrides };
  return await prismaInstance.hourly_occurrence.create({ data: occurrenceSummaryData });
};
