import * as Inputs from '../../inputs';
import { BatchPayload } from '../../objects';
import { defineMutation, defineMutationFunction, defineMutationObject } from '../../utils';

export const deleteManynoticeMutationObject = defineMutationFunction((t) =>
  defineMutationObject({
    type: BatchPayload,
    nullable: true,
    args: { where: t.arg({ type: Inputs.noticeWhereInput, required: true }) },
    resolve: async (_root, args, _context, _info) =>
      await prisma.notice.deleteMany({ where: args.where }),
  }),
);

export const deleteManynoticeMutation = defineMutation((t) => ({
  deleteManynotice: t.field(deleteManynoticeMutationObject(t)),
}));
