import * as Inputs from '../../inputs';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const upsertOneoccurrenceMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: 'occurrence',
    nullable: false,
    args: {
      where: t.arg({ type: Inputs.occurrenceWhereUniqueInput, required: true }),
      create: t.arg({ type: Inputs.occurrenceCreateInput, required: true }),
      update: t.arg({ type: Inputs.occurrenceUpdateInput, required: true }),
    },
    resolve: async (query, _root, args, _context, _info) =>
      await prisma.occurrence.upsert({
        where: args.where,
        create: args.create,
        update: args.update,
        ...query,
      }),
  }),
);

export const upsertOneoccurrenceMutation = defineMutation((t) => ({
  upsertOneoccurrence: t.prismaField(upsertOneoccurrenceMutationObject(t)),
}));
