import * as Inputs from '../../inputs';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const createManyoccurrenceMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: ['occurrence'],
    nullable: false,
    args: { data: t.arg({ type: [Inputs.occurrenceCreateInput], required: true }) },
    resolve: async (_query, _root, args, _context, _info) =>
      await prisma.$transaction(args.data.map((data) => prisma.occurrence.create({ data }))),
  }),
);

export const createManyoccurrenceMutation = defineMutation((t) => ({
  createManyoccurrence: t.prismaField(createManyoccurrenceMutationObject(t)),
}));
