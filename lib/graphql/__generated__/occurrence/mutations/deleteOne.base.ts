import * as Inputs from '../../inputs';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const deleteOneoccurrenceMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: 'occurrence',
    nullable: true,
    args: { where: t.arg({ type: Inputs.occurrenceWhereUniqueInput, required: true }) },
    resolve: async (query, _root, args, _context, _info) =>
      await prisma.occurrence.delete({ where: args.where, ...query }),
  }),
);

export const deleteOneoccurrenceMutation = defineMutation((t) => ({
  deleteOneoccurrence: t.prismaField(deleteOneoccurrenceMutationObject(t)),
}));
