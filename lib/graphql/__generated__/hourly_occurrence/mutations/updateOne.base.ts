import * as Inputs from '../../inputs';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const updateOnehourly_occurrenceMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: 'hourly_occurrence',
    nullable: true,
    args: {
      where: t.arg({ type: Inputs.hourly_occurrenceWhereUniqueInput, required: true }),
      data: t.arg({ type: Inputs.hourly_occurrenceUpdateInput, required: true }),
    },
    resolve: async (query, _root, args, _context, _info) =>
      await prisma.hourly_occurrence.update({ where: args.where, data: args.data, ...query }),
  }),
);

export const updateOnehourly_occurrenceMutation = defineMutation((t) => ({
  updateOnehourly_occurrence: t.prismaField(updateOnehourly_occurrenceMutationObject(t)),
}));
