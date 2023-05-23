import * as Inputs from '../../inputs';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const updateOneoccurrenceMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: 'occurrence',
    nullable: true,
    args: {
      where: t.arg({ type: Inputs.occurrenceWhereUniqueInput, required: true }),
      data: t.arg({ type: Inputs.occurrenceUpdateInput, required: true }),
    },
    resolve: async (query, _root, args, _context, _info) =>
      await prisma.occurrence.update({ where: args.where, data: args.data, ...query }),
  }),
);

export const updateOneoccurrenceMutation = defineMutation((t) => ({
  updateOneoccurrence: t.prismaField(updateOneoccurrenceMutationObject(t)),
}));
