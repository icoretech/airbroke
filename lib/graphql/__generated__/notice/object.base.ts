import * as Inputs from '../inputs';
import {
  defineExposeObject,
  definePrismaObject,
  defineFieldObject,
  defineRelationFunction,
  defineRelationObject,
} from '../utils';

export const noticeObject = definePrismaObject('notice', {
  description: 'Specific notices for projects',
  findUnique: ({ id }) => ({ id }),
  fields: (t) => ({
    id: t.exposeID('id', noticeIdFieldObject),
    project_id: t.field(noticeProject_idFieldObject),
    env: t.exposeString('env', noticeEnvFieldObject),
    kind: t.exposeString('kind', noticeKindFieldObject),
    seen_count: t.field(noticeSeen_countFieldObject),
    created_at: t.field(noticeCreated_atFieldObject),
    updated_at: t.field(noticeUpdated_atFieldObject),
    project: t.relation('project', noticeProjectFieldObject),
    occurrences: t.relation('occurrences', noticeOccurrencesFieldObject(t)),
  }),
});

export const noticeIdFieldObject = defineExposeObject('Bigint', {
  description: undefined,
  nullable: false,
});

export const noticeProject_idFieldObject = defineFieldObject('notice', {
  type: Inputs.Bigint,
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.project_id,
});

export const noticeEnvFieldObject = defineExposeObject('String', {
  description: undefined,
  nullable: false,
});

export const noticeKindFieldObject = defineExposeObject('String', {
  description: undefined,
  nullable: false,
});

export const noticeSeen_countFieldObject = defineFieldObject('notice', {
  type: Inputs.Bigint,
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.seen_count,
});

export const noticeCreated_atFieldObject = defineFieldObject('notice', {
  type: Inputs.DateTime,
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.created_at,
});

export const noticeUpdated_atFieldObject = defineFieldObject('notice', {
  type: Inputs.DateTime,
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.updated_at,
});

export const noticeProjectFieldObject = defineRelationObject('notice', 'project', {
  description: 'Relation to the parent project',
  nullable: false,
  args: undefined,
  query: undefined,
});

export const noticeOccurrencesFieldObject = defineRelationFunction('notice', (t) =>
  defineRelationObject('notice', 'occurrences', {
    description: 'Relation to associated occurrences',
    nullable: false,
    args: {
      where: t.arg({ type: Inputs.occurrenceWhereInput, required: false }),
      orderBy: t.arg({ type: [Inputs.occurrenceOrderByWithRelationInput], required: false }),
      cursor: t.arg({ type: Inputs.occurrenceWhereUniqueInput, required: false }),
      take: t.arg({ type: 'Int', required: false }),
      skip: t.arg({ type: 'Int', required: false }),
      distinct: t.arg({ type: [Inputs.OccurrenceScalarFieldEnum], required: false }),
    },
    query: (args) => ({
      where: args.where || undefined,
      cursor: args.cursor || undefined,
      take: args.take || undefined,
      distinct: args.distinct || undefined,
      skip: args.skip || undefined,
      orderBy: args.orderBy || undefined,
    }),
  }),
);
