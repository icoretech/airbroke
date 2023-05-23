import * as Inputs from '../../inputs';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const createOneoccurrenceMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: 'occurrence',
    nullable: false,
    args: { data: t.arg({ type: Inputs.occurrenceCreateInput, required: true }) },
    resolve: async (query, _root, args, _context, _info) =>
      await prisma.occurrence.create({ data: args.data, ...query }),
  }),
);

export const createOneoccurrenceMutation = defineMutation((t) => ({
  createOneoccurrence: t.prismaField(createOneoccurrenceMutationObject(t)),
}));
