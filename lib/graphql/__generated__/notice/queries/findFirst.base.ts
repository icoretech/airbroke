import * as Inputs from '../../inputs';
import { defineQuery, defineQueryFunction, defineQueryPrismaObject } from '../../utils';

export const findFirstnoticeQueryObject = defineQueryFunction((t) =>
  defineQueryPrismaObject({
    type: 'notice',
    nullable: true,
    args: {
      where: t.arg({ type: Inputs.noticeWhereInput, required: false }),
      orderBy: t.arg({ type: [Inputs.noticeOrderByWithRelationInput], required: false }),
      cursor: t.arg({ type: Inputs.noticeWhereUniqueInput, required: false }),
      take: t.arg({ type: 'Int', required: false }),
      skip: t.arg({ type: 'Int', required: false }),
      distinct: t.arg({ type: [Inputs.NoticeScalarFieldEnum], required: false }),
    },
    resolve: async (query, _root, args, _context, _info) =>
      await prisma.notice.findFirst({
        where: args.where || undefined,
        cursor: args.cursor || undefined,
        take: args.take || undefined,
        distinct: args.distinct || undefined,
        skip: args.skip || undefined,
        orderBy: args.orderBy || undefined,
        ...query,
      }),
  }),
);

export const findFirstnoticeQuery = defineQuery((t) => ({
  findFirstnotice: t.prismaField(findFirstnoticeQueryObject(t)),
}));
