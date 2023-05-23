import * as Inputs from '../../inputs';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const createManynoticeMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: ['notice'],
    nullable: false,
    args: { data: t.arg({ type: [Inputs.noticeCreateInput], required: true }) },
    resolve: async (_query, _root, args, _context, _info) =>
      await prisma.$transaction(args.data.map((data) => prisma.notice.create({ data }))),
  }),
);

export const createManynoticeMutation = defineMutation((t) => ({
  createManynotice: t.prismaField(createManynoticeMutationObject(t)),
}));
