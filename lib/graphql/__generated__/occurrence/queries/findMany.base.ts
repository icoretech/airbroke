import * as Inputs from '../../inputs';
import { defineQuery, defineQueryFunction, defineQueryPrismaObject } from '../../utils';

export const findManyoccurrenceQueryObject = defineQueryFunction((t) =>
  defineQueryPrismaObject({
    type: ['occurrence'],
    nullable: false,
    args: {
      where: t.arg({ type: Inputs.occurrenceWhereInput, required: false }),
      orderBy: t.arg({ type: [Inputs.occurrenceOrderByWithRelationInput], required: false }),
      cursor: t.arg({ type: Inputs.occurrenceWhereUniqueInput, required: false }),
      take: t.arg({ type: 'Int', required: false }),
      skip: t.arg({ type: 'Int', required: false }),
      distinct: t.arg({ type: [Inputs.OccurrenceScalarFieldEnum], required: false }),
    },
    resolve: async (query, _root, args, _context, _info) =>
      await prisma.occurrence.findMany({
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

export const findManyoccurrenceQuery = defineQuery((t) => ({
  findManyoccurrence: t.prismaField(findManyoccurrenceQueryObject(t)),
}));
