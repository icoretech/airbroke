import * as Inputs from '../../inputs';
import { BatchPayload } from '../../objects';
import { defineMutation, defineMutationFunction, defineMutationObject } from '../../utils';

export const updateManyoccurrenceMutationObject = defineMutationFunction((t) =>
  defineMutationObject({
    type: BatchPayload,
    nullable: false,
    args: {
      where: t.arg({ type: Inputs.occurrenceWhereInput, required: false }),
      data: t.arg({ type: Inputs.occurrenceUpdateManyMutationInput, required: true }),
    },
    resolve: async (_root, args, _context, _info) =>
      await prisma.occurrence.updateMany({ where: args.where || undefined, data: args.data }),
  }),
);

export const updateManyoccurrenceMutation = defineMutation((t) => ({
  updateManyoccurrence: t.field(updateManyoccurrenceMutationObject(t)),
}));
