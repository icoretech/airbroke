import * as Inputs from '../../inputs';
import { defineQuery, defineQueryFunction, defineQueryPrismaObject } from '../../utils';

export const findManyprojectQueryObject = defineQueryFunction((t) =>
  defineQueryPrismaObject({
    type: ['project'],
    nullable: false,
    args: {
      where: t.arg({ type: Inputs.projectWhereInput, required: false }),
      orderBy: t.arg({ type: [Inputs.projectOrderByWithRelationInput], required: false }),
      cursor: t.arg({ type: Inputs.projectWhereUniqueInput, required: false }),
      take: t.arg({ type: 'Int', required: false }),
      skip: t.arg({ type: 'Int', required: false }),
      distinct: t.arg({ type: [Inputs.ProjectScalarFieldEnum], required: false }),
    },
    resolve: async (query, _root, args, _context, _info) =>
      await prisma.project.findMany({
        where: args.where || undefined,
        cursor: args.cursor || undefined,
        take: args.take || undefined,
        distinct: args.distinct || undefined,
        skip: args.skip || undefined,
        orderBy: args.orderBy || undefined,
        ...query,
      }),
  }),
);

export const findManyprojectQuery = defineQuery((t) => ({
  findManyproject: t.prismaField(findManyprojectQueryObject(t)),
}));
