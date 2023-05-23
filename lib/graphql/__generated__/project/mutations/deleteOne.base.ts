import * as Inputs from '../../inputs';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const deleteOneprojectMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: 'project',
    nullable: true,
    args: { where: t.arg({ type: Inputs.projectWhereUniqueInput, required: true }) },
    resolve: async (query, _root, args, _context, _info) =>
      await prisma.project.delete({ where: args.where, ...query }),
  }),
);

export const deleteOneprojectMutation = defineMutation((t) => ({
  deleteOneproject: t.prismaField(deleteOneprojectMutationObject(t)),
}));
