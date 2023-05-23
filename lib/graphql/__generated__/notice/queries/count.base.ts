import * as Inputs from '../../inputs';
import { defineQuery, defineQueryFunction, defineQueryObject } from '../../utils';

export const countnoticeQueryObject = defineQueryFunction((t) =>
  defineQueryObject({
    type: 'Int',
    nullable: false,
    args: {
      where: t.arg({ type: Inputs.noticeWhereInput, required: false }),
      orderBy: t.arg({ type: [Inputs.noticeOrderByWithRelationInput], required: false }),
      cursor: t.arg({ type: Inputs.noticeWhereUniqueInput, required: false }),
      take: t.arg({ type: 'Int', required: false }),
      skip: t.arg({ type: 'Int', required: false }),
      distinct: t.arg({ type: [Inputs.NoticeScalarFieldEnum], required: false }),
    },
    resolve: async (_root, args, _context, _info) =>
      await prisma.notice.count({
        where: args.where || undefined,
        cursor: args.cursor || undefined,
        take: args.take || undefined,
        distinct: args.distinct || undefined,
        skip: args.skip || undefined,
        orderBy: args.orderBy || undefined,
      }),
  }),
);

export const countnoticeQuery = defineQuery((t) => ({
  countnotice: t.field(countnoticeQueryObject(t)),
}));
