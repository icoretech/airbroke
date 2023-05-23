import * as Inputs from '../../inputs';
import { defineQuery, defineQueryFunction, defineQueryObject } from '../../utils';

export const counthourly_occurrenceQueryObject = defineQueryFunction((t) =>
  defineQueryObject({
    type: 'Int',
    nullable: false,
    args: {
      where: t.arg({ type: Inputs.hourly_occurrenceWhereInput, required: false }),
      orderBy: t.arg({ type: [Inputs.hourly_occurrenceOrderByWithRelationInput], required: false }),
      cursor: t.arg({ type: Inputs.hourly_occurrenceWhereUniqueInput, required: false }),
      take: t.arg({ type: 'Int', required: false }),
      skip: t.arg({ type: 'Int', required: false }),
      distinct: t.arg({ type: [Inputs.Hourly_occurrenceScalarFieldEnum], required: false }),
    },
    resolve: async (_root, args, _context, _info) =>
      await prisma.hourly_occurrence.count({
        where: args.where || undefined,
        cursor: args.cursor || undefined,
        take: args.take || undefined,
        distinct: args.distinct || undefined,
        skip: args.skip || undefined,
        orderBy: args.orderBy || undefined,
      }),
  }),
);

export const counthourly_occurrenceQuery = defineQuery((t) => ({
  counthourly_occurrence: t.field(counthourly_occurrenceQueryObject(t)),
}));
