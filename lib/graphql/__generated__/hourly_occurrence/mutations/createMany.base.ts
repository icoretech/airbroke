import * as Inputs from '../../inputs';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const createManyhourly_occurrenceMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: ['hourly_occurrence'],
    nullable: false,
    args: { data: t.arg({ type: [Inputs.hourly_occurrenceCreateInput], required: true }) },
    resolve: async (_query, _root, args, _context, _info) =>
      await prisma.$transaction(args.data.map((data) => prisma.hourly_occurrence.create({ data }))),
  }),
);

export const createManyhourly_occurrenceMutation = defineMutation((t) => ({
  createManyhourly_occurrence: t.prismaField(createManyhourly_occurrenceMutationObject(t)),
}));
