import * as Inputs from '../../inputs';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const upsertOnehourly_occurrenceMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: 'hourly_occurrence',
    nullable: false,
    args: {
      where: t.arg({ type: Inputs.hourly_occurrenceWhereUniqueInput, required: true }),
      create: t.arg({ type: Inputs.hourly_occurrenceCreateInput, required: true }),
      update: t.arg({ type: Inputs.hourly_occurrenceUpdateInput, required: true }),
    },
    resolve: async (query, _root, args, _context, _info) =>
      await prisma.hourly_occurrence.upsert({
        where: args.where,
        create: args.create,
        update: args.update,
        ...query,
      }),
  }),
);

export const upsertOnehourly_occurrenceMutation = defineMutation((t) => ({
  upsertOnehourly_occurrence: t.prismaField(upsertOnehourly_occurrenceMutationObject(t)),
}));
