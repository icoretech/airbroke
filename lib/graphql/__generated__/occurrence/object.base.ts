import * as Inputs from '../inputs';
import {
  defineExposeObject,
  definePrismaObject,
  defineFieldObject,
  defineRelationFunction,
  defineRelationObject,
} from '../utils';

export const occurrenceObject = definePrismaObject('occurrence', {
  description: 'Specific occurrences for a notice',
  findUnique: ({ id }) => ({ id }),
  fields: (t) => ({
    id: t.exposeID('id', occurrenceIdFieldObject),
    notice_id: t.field(occurrenceNotice_idFieldObject),
    message: t.exposeString('message', occurrenceMessageFieldObject),
    seen_count: t.field(occurrenceSeen_countFieldObject),
    backtrace: t.field(occurrenceBacktraceFieldObject),
    context: t.field(occurrenceContextFieldObject),
    environment: t.field(occurrenceEnvironmentFieldObject),
    session: t.field(occurrenceSessionFieldObject),
    params: t.field(occurrenceParamsFieldObject),
    created_at: t.field(occurrenceCreated_atFieldObject),
    updated_at: t.field(occurrenceUpdated_atFieldObject),
    notice: t.relation('notice', occurrenceNoticeFieldObject),
    hourly_occurrences: t.relation('hourly_occurrences', occurrenceHourly_occurrencesFieldObject(t)),
  }),
});

export const occurrenceIdFieldObject = defineExposeObject('Bigint', {
  description: undefined,
  nullable: false,
});

export const occurrenceNotice_idFieldObject = defineFieldObject('occurrence', {
  type: Inputs.Bigint,
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.notice_id,
});

export const occurrenceMessageFieldObject = defineExposeObject('String', {
  description: undefined,
  nullable: false,
});

export const occurrenceSeen_countFieldObject = defineFieldObject('occurrence', {
  type: Inputs.Bigint,
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.seen_count,
});

export const occurrenceBacktraceFieldObject = defineFieldObject('occurrence', {
  type: Inputs.Json,
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.backtrace,
});

export const occurrenceContextFieldObject = defineFieldObject('occurrence', {
  type: Inputs.Json,
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.context,
});

export const occurrenceEnvironmentFieldObject = defineFieldObject('occurrence', {
  type: Inputs.Json,
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.environment,
});

export const occurrenceSessionFieldObject = defineFieldObject('occurrence', {
  type: Inputs.Json,
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.session,
});

export const occurrenceParamsFieldObject = defineFieldObject('occurrence', {
  type: Inputs.Json,
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.params,
});

export const occurrenceCreated_atFieldObject = defineFieldObject('occurrence', {
  type: Inputs.DateTime,
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.created_at,
});

export const occurrenceUpdated_atFieldObject = defineFieldObject('occurrence', {
  type: Inputs.DateTime,
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.updated_at,
});

export const occurrenceNoticeFieldObject = defineRelationObject('occurrence', 'notice', {
  description: 'Relation to the parent notice',
  nullable: false,
  args: undefined,
  query: undefined,
});

export const occurrenceHourly_occurrencesFieldObject = defineRelationFunction('occurrence', (t) =>
  defineRelationObject('occurrence', 'hourly_occurrences', {
    description: 'Relation to associated hourly occurrences',
    nullable: false,
    args: {
      where: t.arg({ type: Inputs.hourly_occurrenceWhereInput, required: false }),
      orderBy: t.arg({ type: [Inputs.hourly_occurrenceOrderByWithRelationInput], required: false }),
      cursor: t.arg({ type: Inputs.hourly_occurrenceWhereUniqueInput, required: false }),
      take: t.arg({ type: 'Int', required: false }),
      skip: t.arg({ type: 'Int', required: false }),
      distinct: t.arg({ type: [Inputs.Hourly_occurrenceScalarFieldEnum], required: false }),
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
