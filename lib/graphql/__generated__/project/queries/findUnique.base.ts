import * as Inputs from '../../inputs';
import { defineQuery, defineQueryFunction, defineQueryPrismaObject } from '../../utils';

export const findUniqueprojectQueryObject = defineQueryFunction((t) =>
  defineQueryPrismaObject({
    type: 'project',
    nullable: true,
    args: { where: t.arg({ type: Inputs.projectWhereUniqueInput, required: true }) },
    resolve: async (query, _root, args, _context, _info) =>
      await prisma.project.findUnique({ where: args.where, ...query }),
  }),
);

export const findUniqueprojectQuery = defineQuery((t) => ({
  findUniqueproject: t.prismaField(findUniqueprojectQueryObject(t)),
}));
