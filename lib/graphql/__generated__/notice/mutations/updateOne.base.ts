import * as Inputs from '../../inputs';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const updateOnenoticeMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: 'notice',
    nullable: true,
    args: {
      where: t.arg({ type: Inputs.noticeWhereUniqueInput, required: true }),
      data: t.arg({ type: Inputs.noticeUpdateInput, required: true }),
    },
    resolve: async (query, _root, args, _context, _info) =>
      await prisma.notice.update({ where: args.where, data: args.data, ...query }),
  }),
);

export const updateOnenoticeMutation = defineMutation((t) => ({
  updateOnenotice: t.prismaField(updateOnenoticeMutationObject(t)),
}));
