import * as Inputs from '../../inputs';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const upsertOnenoticeMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: 'notice',
    nullable: false,
    args: {
      where: t.arg({ type: Inputs.noticeWhereUniqueInput, required: true }),
      create: t.arg({ type: Inputs.noticeCreateInput, required: true }),
      update: t.arg({ type: Inputs.noticeUpdateInput, required: true }),
    },
    resolve: async (query, _root, args, _context, _info) =>
      await prisma.notice.upsert({
        where: args.where,
        create: args.create,
        update: args.update,
        ...query,
      }),
  }),
);

export const upsertOnenoticeMutation = defineMutation((t) => ({
  upsertOnenotice: t.prismaField(upsertOnenoticeMutationObject(t)),
}));
