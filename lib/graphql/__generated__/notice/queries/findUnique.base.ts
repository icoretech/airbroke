import * as Inputs from '../../inputs';
import { defineQuery, defineQueryFunction, defineQueryPrismaObject } from '../../utils';

export const findUniquenoticeQueryObject = defineQueryFunction((t) =>
  defineQueryPrismaObject({
    type: 'notice',
    nullable: true,
    args: { where: t.arg({ type: Inputs.noticeWhereUniqueInput, required: true }) },
    resolve: async (query, _root, args, _context, _info) =>
      await prisma.notice.findUnique({ where: args.where, ...query }),
  }),
);

export const findUniquenoticeQuery = defineQuery((t) => ({
  findUniquenotice: t.prismaField(findUniquenoticeQueryObject(t)),
}));
