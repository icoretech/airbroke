import * as Inputs from '../../inputs';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const createOneprojectMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: 'project',
    nullable: false,
    args: { data: t.arg({ type: Inputs.projectCreateInput, required: true }) },
    resolve: async (query, _root, args, _context, _info) =>
      await prisma.project.create({ data: args.data, ...query }),
  }),
);

export const createOneprojectMutation = defineMutation((t) => ({
  createOneproject: t.prismaField(createOneprojectMutationObject(t)),
}));
