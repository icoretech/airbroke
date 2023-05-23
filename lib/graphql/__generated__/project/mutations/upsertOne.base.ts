import * as Inputs from '../../inputs';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const upsertOneprojectMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: 'project',
    nullable: false,
    args: {
      where: t.arg({ type: Inputs.projectWhereUniqueInput, required: true }),
      create: t.arg({ type: Inputs.projectCreateInput, required: true }),
      update: t.arg({ type: Inputs.projectUpdateInput, required: true }),
    },
    resolve: async (query, _root, args, _context, _info) =>
      await prisma.project.upsert({
        where: args.where,
        create: args.create,
        update: args.update,
        ...query,
      }),
  }),
);

export const upsertOneprojectMutation = defineMutation((t) => ({
  upsertOneproject: t.prismaField(upsertOneprojectMutationObject(t)),
}));
