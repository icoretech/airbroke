import * as Inputs from '../../inputs';
import { BatchPayload } from '../../objects';
import { defineMutation, defineMutationFunction, defineMutationObject } from '../../utils';

export const updateManyprojectMutationObject = defineMutationFunction((t) =>
  defineMutationObject({
    type: BatchPayload,
    nullable: false,
    args: {
      where: t.arg({ type: Inputs.projectWhereInput, required: false }),
      data: t.arg({ type: Inputs.projectUpdateManyMutationInput, required: true }),
    },
    resolve: async (_root, args, _context, _info) =>
      await prisma.project.updateMany({ where: args.where || undefined, data: args.data }),
  }),
);

export const updateManyprojectMutation = defineMutation((t) => ({
  updateManyproject: t.field(updateManyprojectMutationObject(t)),
}));
