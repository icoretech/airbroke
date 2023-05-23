import * as Inputs from '../../inputs';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const createOnenoticeMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: 'notice',
    nullable: false,
    args: { data: t.arg({ type: Inputs.noticeCreateInput, required: true }) },
    resolve: async (query, _root, args, _context, _info) =>
      await prisma.notice.create({ data: args.data, ...query }),
  }),
);

export const createOnenoticeMutation = defineMutation((t) => ({
  createOnenotice: t.prismaField(createOnenoticeMutationObject(t)),
}));
