import * as Inputs from '../../inputs';
import { BatchPayload } from '../../objects';
import { defineMutation, defineMutationFunction, defineMutationObject } from '../../utils';

export const deleteManyoccurrenceMutationObject = defineMutationFunction((t) =>
  defineMutationObject({
    type: BatchPayload,
    nullable: true,
    args: { where: t.arg({ type: Inputs.occurrenceWhereInput, required: true }) },
    resolve: async (_root, args, _context, _info) =>
      await prisma.occurrence.deleteMany({ where: args.where }),
  }),
);

export const deleteManyoccurrenceMutation = defineMutation((t) => ({
  deleteManyoccurrence: t.field(deleteManyoccurrenceMutationObject(t)),
}));
