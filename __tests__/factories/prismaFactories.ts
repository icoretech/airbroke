import type { HourlyOccurrence, Notice, Occurrence, Prisma, Project } from '@prisma/client';
import Chance from 'chance';
import prisma from '../testSetup';

const chance = new Chance();

export const createProject = async (overrides?: Partial<Prisma.ProjectUncheckedCreateInput>): Promise<Project> => {
  const defaultProject: Prisma.ProjectCreateInput = {
    name: chance.company(),
    organization: chance.company(),
  };

  const projectData = { ...defaultProject, ...overrides };
  return await prisma.project.create({ data: projectData });
};

export const createNotice = async (project_id: string, overrides?: Partial<Prisma.NoticeUncheckedCreateInput>): Promise<Notice> => {
  const defaultNotice: Prisma.NoticeUncheckedCreateInput = {
    project_id: project_id,
    env: chance.word(),
    kind: chance.word(),
  };

  const noticeData = { ...defaultNotice, ...overrides };
  return await prisma.notice.create({ data: noticeData });
};

export const createOccurrence = async (notice_id: string, overrides?: Partial<Prisma.OccurrenceUncheckedCreateInput>): Promise<Occurrence> => {
  const defaultOccurrence: Prisma.OccurrenceUncheckedCreateInput = {
    notice_id: notice_id,
    message: chance.sentence({ words: 5 }),
  };

  const occurrenceData = { ...defaultOccurrence, ...overrides };
  return await prisma.occurrence.create({ data: occurrenceData });
};

export const createOccurrenceSummary = async (occurrence_id: string, overrides?: Partial<Prisma.HourlyOccurrenceUncheckedCreateInput>): Promise<HourlyOccurrence> => {
  const defaultOccurrenceSummary: Prisma.HourlyOccurrenceUncheckedCreateInput = {
    occurrence_id: occurrence_id,
    interval_start: chance.date({ year: parseInt(chance.year({ min: 2000, max: 2022 })) }),
    interval_end: chance.date({ year: parseInt(chance.year({ min: 2023, max: 2030 })) }),
  };

  const occurrenceSummaryData = { ...defaultOccurrenceSummary, ...overrides };
  return await prisma.hourlyOccurrence.create({ data: occurrenceSummaryData });
};
