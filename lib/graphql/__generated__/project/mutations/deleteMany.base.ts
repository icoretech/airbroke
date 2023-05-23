import * as Inputs from '../../inputs';
import { BatchPayload } from '../../objects';
import { defineMutation, defineMutationFunction, defineMutationObject } from '../../utils';

export const deleteManyprojectMutationObject = defineMutationFunction((t) =>
  defineMutationObject({
    type: BatchPayload,
    nullable: true,
    args: { where: t.arg({ type: Inputs.projectWhereInput, required: true }) },
    resolve: async (_root, args, _context, _info) =>
      await prisma.project.deleteMany({ where: args.where }),
  }),
);

export const deleteManyprojectMutation = defineMutation((t) => ({
  deleteManyproject: t.field(deleteManyprojectMutationObject(t)),
}));
