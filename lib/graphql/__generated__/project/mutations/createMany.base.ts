import * as Inputs from '../../inputs';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const createManyprojectMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: ['project'],
    nullable: false,
    args: { data: t.arg({ type: [Inputs.projectCreateInput], required: true }) },
    resolve: async (_query, _root, args, _context, _info) =>
      await prisma.$transaction(args.data.map((data) => prisma.project.create({ data }))),
  }),
);

export const createManyprojectMutation = defineMutation((t) => ({
  createManyproject: t.prismaField(createManyprojectMutationObject(t)),
}));
