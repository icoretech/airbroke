// __tests__/factories/prismaFactories.ts

import { faker } from "@faker-js/faker";
import { db } from "@/lib/db";
import type {
  Notice,
  Occurrence,
  Prisma,
  Project,
  Remark,
  User,
} from "@/prisma/generated/client";

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

export const createNotice = async (
  projectId: string,
  overrides?: Partial<Prisma.NoticeUncheckedCreateInput>,
): Promise<Notice> => {
  const defaultNotice: Prisma.NoticeUncheckedCreateInput = {
    project_id: projectId,
    env: "test",
    kind: `Error::${faker.string.uuid()}`,
    seen_count: BigInt(1),
  };

  return await db.notice.create({
    data: { ...defaultNotice, ...overrides },
  });
};

export const createOccurrence = async (
  noticeId: string,
  overrides?: Partial<Prisma.OccurrenceUncheckedCreateInput>,
): Promise<Occurrence> => {
  const defaultOccurrence: Prisma.OccurrenceUncheckedCreateInput = {
    notice_id: noticeId,
    message: `Example failure ${faker.string.uuid()}`,
    message_hash: faker.string.uuid(),
    seen_count: BigInt(1),
    backtrace: {},
    context: {},
    environment: {},
    session: {},
    params: {},
  };

  return await db.occurrence.create({
    data: { ...defaultOccurrence, ...overrides },
  });
};

export const createUser = async (
  overrides?: Partial<Prisma.UserUncheckedCreateInput>,
): Promise<User> => {
  const defaultUser: Prisma.UserUncheckedCreateInput = {
    name: "Example User",
    email: `user-${faker.string.uuid()}@example.com`,
  };

  return await db.user.create({
    data: { ...defaultUser, ...overrides },
  });
};

export const createRemark = async (
  noticeId: string,
  userId: string,
  overrides?: Partial<Prisma.RemarkUncheckedCreateInput>,
): Promise<Remark> => {
  const defaultRemark: Prisma.RemarkUncheckedCreateInput = {
    notice_id: noticeId,
    user_id: userId,
    occurrence_id: null,
    body: `Example remark ${faker.string.uuid()}`,
  };

  return await db.remark.create({
    data: { ...defaultRemark, ...overrides },
  });
};
