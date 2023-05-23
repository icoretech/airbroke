import * as Inputs from '../../inputs';
import { defineQuery, defineQueryFunction, defineQueryPrismaObject } from '../../utils';

export const findUniquehourly_occurrenceQueryObject = defineQueryFunction((t) =>
  defineQueryPrismaObject({
    type: 'hourly_occurrence',
    nullable: true,
    args: { where: t.arg({ type: Inputs.hourly_occurrenceWhereUniqueInput, required: true }) },
    resolve: async (query, _root, args, _context, _info) =>
      await prisma.hourly_occurrence.findUnique({ where: args.where, ...query }),
  }),
);

export const findUniquehourly_occurrenceQuery = defineQuery((t) => ({
  findUniquehourly_occurrence: t.prismaField(findUniquehourly_occurrenceQueryObject(t)),
}));
