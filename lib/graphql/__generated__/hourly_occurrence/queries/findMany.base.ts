import * as Inputs from '../../inputs';
import { defineQuery, defineQueryFunction, defineQueryPrismaObject } from '../../utils';

export const findManyhourly_occurrenceQueryObject = defineQueryFunction((t) =>
  defineQueryPrismaObject({
    type: ['hourly_occurrence'],
    nullable: false,
    args: {
      where: t.arg({ type: Inputs.hourly_occurrenceWhereInput, required: false }),
      orderBy: t.arg({ type: [Inputs.hourly_occurrenceOrderByWithRelationInput], required: false }),
      cursor: t.arg({ type: Inputs.hourly_occurrenceWhereUniqueInput, required: false }),
      take: t.arg({ type: 'Int', required: false }),
      skip: t.arg({ type: 'Int', required: false }),
      distinct: t.arg({ type: [Inputs.Hourly_occurrenceScalarFieldEnum], required: false }),
    },
    resolve: async (query, _root, args, _context, _info) =>
      await prisma.hourly_occurrence.findMany({
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

export const findManyhourly_occurrenceQuery = defineQuery((t) => ({
  findManyhourly_occurrence: t.prismaField(findManyhourly_occurrenceQueryObject(t)),
}));
