import * as Inputs from '../../inputs';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const updateOneprojectMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: 'project',
    nullable: true,
    args: {
      where: t.arg({ type: Inputs.projectWhereUniqueInput, required: true }),
      data: t.arg({ type: Inputs.projectUpdateInput, required: true }),
    },
    resolve: async (query, _root, args, _context, _info) =>
      await prisma.project.update({ where: args.where, data: args.data, ...query }),
  }),
);

export const updateOneprojectMutation = defineMutation((t) => ({
  updateOneproject: t.prismaField(updateOneprojectMutationObject(t)),
}));
