import * as Inputs from '../../inputs';
import { BatchPayload } from '../../objects';
import { defineMutation, defineMutationFunction, defineMutationObject } from '../../utils';

export const deleteManyhourly_occurrenceMutationObject = defineMutationFunction((t) =>
  defineMutationObject({
    type: BatchPayload,
    nullable: true,
    args: { where: t.arg({ type: Inputs.hourly_occurrenceWhereInput, required: true }) },
    resolve: async (_root, args, _context, _info) =>
      await prisma.hourly_occurrence.deleteMany({ where: args.where }),
  }),
);

export const deleteManyhourly_occurrenceMutation = defineMutation((t) => ({
  deleteManyhourly_occurrence: t.field(deleteManyhourly_occurrenceMutationObject(t)),
}));
