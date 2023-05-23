import * as Inputs from '../../inputs';
import { defineQuery, defineQueryFunction, defineQueryPrismaObject } from '../../utils';

export const findFirstoccurrenceQueryObject = defineQueryFunction((t) =>
  defineQueryPrismaObject({
    type: 'occurrence',
    nullable: true,
    args: {
      where: t.arg({ type: Inputs.occurrenceWhereInput, required: false }),
      orderBy: t.arg({ type: [Inputs.occurrenceOrderByWithRelationInput], required: false }),
      cursor: t.arg({ type: Inputs.occurrenceWhereUniqueInput, required: false }),
      take: t.arg({ type: 'Int', required: false }),
      skip: t.arg({ type: 'Int', required: false }),
      distinct: t.arg({ type: [Inputs.OccurrenceScalarFieldEnum], required: false }),
    },
    resolve: async (query, _root, args, _context, _info) =>
      await prisma.occurrence.findFirst({
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

export const findFirstoccurrenceQuery = defineQuery((t) => ({
  findFirstoccurrence: t.prismaField(findFirstoccurrenceQueryObject(t)),
}));
