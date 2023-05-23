import * as Inputs from '../../inputs';
import { defineQuery, defineQueryFunction, defineQueryPrismaObject } from '../../utils';

export const findManynoticeQueryObject = defineQueryFunction((t) =>
  defineQueryPrismaObject({
    type: ['notice'],
    nullable: false,
    args: {
      where: t.arg({ type: Inputs.noticeWhereInput, required: false }),
      orderBy: t.arg({ type: [Inputs.noticeOrderByWithRelationInput], required: false }),
      cursor: t.arg({ type: Inputs.noticeWhereUniqueInput, required: false }),
      take: t.arg({ type: 'Int', required: false }),
      skip: t.arg({ type: 'Int', required: false }),
      distinct: t.arg({ type: [Inputs.NoticeScalarFieldEnum], required: false }),
    },
    resolve: async (query, _root, args, _context, _info) =>
      await prisma.notice.findMany({
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

export const findManynoticeQuery = defineQuery((t) => ({
  findManynotice: t.prismaField(findManynoticeQueryObject(t)),
}));
