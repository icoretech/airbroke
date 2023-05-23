import * as Inputs from '../../inputs';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const createOnehourly_occurrenceMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: 'hourly_occurrence',
    nullable: false,
    args: { data: t.arg({ type: Inputs.hourly_occurrenceCreateInput, required: true }) },
    resolve: async (query, _root, args, _context, _info) =>
      await prisma.hourly_occurrence.create({ data: args.data, ...query }),
  }),
);

export const createOnehourly_occurrenceMutation = defineMutation((t) => ({
  createOnehourly_occurrence: t.prismaField(createOnehourly_occurrenceMutationObject(t)),
}));
