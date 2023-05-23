import * as Inputs from '../../inputs';
import { BatchPayload } from '../../objects';
import { defineMutation, defineMutationFunction, defineMutationObject } from '../../utils';

export const updateManyhourly_occurrenceMutationObject = defineMutationFunction((t) =>
  defineMutationObject({
    type: BatchPayload,
    nullable: false,
    args: {
      where: t.arg({ type: Inputs.hourly_occurrenceWhereInput, required: false }),
      data: t.arg({ type: Inputs.hourly_occurrenceUpdateManyMutationInput, required: true }),
    },
    resolve: async (_root, args, _context, _info) =>
      await prisma.hourly_occurrence.updateMany({ where: args.where || undefined, data: args.data }),
  }),
);

export const updateManyhourly_occurrenceMutation = defineMutation((t) => ({
  updateManyhourly_occurrence: t.field(updateManyhourly_occurrenceMutationObject(t)),
}));
