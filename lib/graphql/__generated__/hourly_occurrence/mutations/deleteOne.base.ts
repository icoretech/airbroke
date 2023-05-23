import * as Inputs from '../../inputs';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const deleteOnehourly_occurrenceMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: 'hourly_occurrence',
    nullable: true,
    args: { where: t.arg({ type: Inputs.hourly_occurrenceWhereUniqueInput, required: true }) },
    resolve: async (query, _root, args, _context, _info) =>
      await prisma.hourly_occurrence.delete({ where: args.where, ...query }),
  }),
);

export const deleteOnehourly_occurrenceMutation = defineMutation((t) => ({
  deleteOnehourly_occurrence: t.prismaField(deleteOnehourly_occurrenceMutationObject(t)),
}));
