import * as Inputs from '../../inputs';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const deleteOnenoticeMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: 'notice',
    nullable: true,
    args: { where: t.arg({ type: Inputs.noticeWhereUniqueInput, required: true }) },
    resolve: async (query, _root, args, _context, _info) =>
      await prisma.notice.delete({ where: args.where, ...query }),
  }),
);

export const deleteOnenoticeMutation = defineMutation((t) => ({
  deleteOnenotice: t.prismaField(deleteOnenoticeMutationObject(t)),
}));
