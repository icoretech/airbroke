import * as Inputs from '../../inputs';
import { defineQuery, defineQueryFunction, defineQueryPrismaObject } from '../../utils';

export const findFirsthourly_occurrenceQueryObject = defineQueryFunction((t) =>
  defineQueryPrismaObject({
    type: 'hourly_occurrence',
    nullable: true,
    args: {
      where: t.arg({ type: Inputs.hourly_occurrenceWhereInput, required: false }),
      orderBy: t.arg({ type: [Inputs.hourly_occurrenceOrderByWithRelationInput], required: false }),
      cursor: t.arg({ type: Inputs.hourly_occurrenceWhereUniqueInput, required: false }),
      take: t.arg({ type: 'Int', required: false }),
      skip: t.arg({ type: 'Int', required: false }),
      distinct: t.arg({ type: [Inputs.Hourly_occurrenceScalarFieldEnum], required: false }),
    },
    resolve: async (query, _root, args, _context, _info) =>
      await prisma.hourly_occurrence.findFirst({
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

export const findFirsthourly_occurrenceQuery = defineQuery((t) => ({
  findFirsthourly_occurrence: t.prismaField(findFirsthourly_occurrenceQueryObject(t)),
}));
