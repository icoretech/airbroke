import * as Inputs from '../inputs';
import {
  defineExposeObject,
  definePrismaObject,
  defineFieldObject,
  defineRelationFunction,
  defineRelationObject,
} from '../utils';

export const hourly_occurrenceObject = definePrismaObject('hourly_occurrence', {
  description: 'Hourly occurrences for an occurrence',
  findUnique: ({ id }) => ({ id }),
  fields: (t) => ({
    id: t.exposeID('id', hourly_occurrenceIdFieldObject),
    occurrence_id: t.field(hourly_occurrenceOccurrence_idFieldObject),
    interval_start: t.field(hourly_occurrenceInterval_startFieldObject),
    interval_end: t.field(hourly_occurrenceInterval_endFieldObject),
    count: t.field(hourly_occurrenceCountFieldObject),
    occurrence: t.relation('occurrence', hourly_occurrenceOccurrenceFieldObject),
  }),
});

export const hourly_occurrenceIdFieldObject = defineExposeObject('Bigint', {
  description: undefined,
  nullable: false,
});

export const hourly_occurrenceOccurrence_idFieldObject = defineFieldObject('hourly_occurrence', {
  type: Inputs.Bigint,
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.occurrence_id,
});

export const hourly_occurrenceInterval_startFieldObject = defineFieldObject('hourly_occurrence', {
  type: Inputs.DateTime,
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.interval_start,
});

export const hourly_occurrenceInterval_endFieldObject = defineFieldObject('hourly_occurrence', {
  type: Inputs.DateTime,
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.interval_end,
});

export const hourly_occurrenceCountFieldObject = defineFieldObject('hourly_occurrence', {
  type: Inputs.Bigint,
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.count,
});

export const hourly_occurrenceOccurrenceFieldObject = defineRelationObject('hourly_occurrence', 'occurrence', {
  description: 'Relation to the parent occurrence',
  nullable: false,
  args: undefined,
  query: undefined,
});
