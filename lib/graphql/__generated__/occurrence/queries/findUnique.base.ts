import * as Inputs from '../../inputs';
import { defineQuery, defineQueryFunction, defineQueryPrismaObject } from '../../utils';

export const findUniqueoccurrenceQueryObject = defineQueryFunction((t) =>
  defineQueryPrismaObject({
    type: 'occurrence',
    nullable: true,
    args: { where: t.arg({ type: Inputs.occurrenceWhereUniqueInput, required: true }) },
    resolve: async (query, _root, args, _context, _info) =>
      await prisma.occurrence.findUnique({ where: args.where, ...query }),
  }),
);

export const findUniqueoccurrenceQuery = defineQuery((t) => ({
  findUniqueoccurrence: t.prismaField(findUniqueoccurrenceQueryObject(t)),
}));
