import * as Inputs from '../../inputs';
import { BatchPayload } from '../../objects';
import { defineMutation, defineMutationFunction, defineMutationObject } from '../../utils';

export const updateManynoticeMutationObject = defineMutationFunction((t) =>
  defineMutationObject({
    type: BatchPayload,
    nullable: false,
    args: {
      where: t.arg({ type: Inputs.noticeWhereInput, required: false }),
      data: t.arg({ type: Inputs.noticeUpdateManyMutationInput, required: true }),
    },
    resolve: async (_root, args, _context, _info) =>
      await prisma.notice.updateMany({ where: args.where || undefined, data: args.data }),
  }),
);

export const updateManynoticeMutation = defineMutation((t) => ({
  updateManynotice: t.field(updateManynoticeMutationObject(t)),
}));
