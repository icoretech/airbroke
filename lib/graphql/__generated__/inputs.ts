// @ts-nocheck
import { Prisma } from '.prisma/client';
import builder from '@/lib/graphql/builder';

type Filters = {
  string: Prisma.StringFieldUpdateOperationsInput;
  nullableString: Prisma.NullableStringFieldUpdateOperationsInput;
  dateTime: Prisma.DateTimeFieldUpdateOperationsInput;
  nullableDateTime: Prisma.NullableDateTimeFieldUpdateOperationsInput;
  int: Prisma.IntFieldUpdateOperationsInput;
  nullableInt: Prisma.NullableIntFieldUpdateOperationsInput;
  bool: Prisma.BoolFieldUpdateOperationsInput;
  nullableBool: Prisma.NullableBoolFieldUpdateOperationsInput;
  bigInt: Prisma.BigIntFieldUpdateOperationsInput;
  nullableBigInt: Prisma.NullableBigIntFieldUpdateOperationsInput;
  bytes: Prisma.BytesFieldUpdateOperationsInput;
  nullableBytes: Prisma.NullableBytesFieldUpdateOperationsInput;
  float: Prisma.FloatFieldUpdateOperationsInput;
  nullableFloat: Prisma.NullableFloatFieldUpdateOperationsInput;
  decimal: Prisma.DecimalFieldUpdateOperationsInput;
  nullableDecimal: Prisma.NullableDecimalFieldUpdateOperationsInput;
};

type ApplyFilters<InputField> = {
  [F in keyof Filters]: 0 extends 1 & Filters[F]
    ? never
    : Filters[F] extends InputField
    ? Filters[F]
    : never;
}[keyof Filters];

type PrismaUpdateOperationsInputFilter<T extends object> = {
  [K in keyof T]: [ApplyFilters<T[K]>] extends [never] ? T[K] : ApplyFilters<T[K]>
};

export const DateTime = builder.scalarType('DateTime', {
  parseValue: (value) => {
    const isDateParsable = typeof value === 'string' || typeof value === 'number';
    if (!isDateParsable) throw new Error('Invalid Date type');
    const date = new Date(value);
    const isInvalidDate = date.toString() === 'Invalid Date';
    if (isInvalidDate) throw new Error('Invalid Date');
    return new Date(value);
  },
  serialize: (value) => value ? new Date(value) : null,
});

export const Json = builder.scalarType('Json', {
  serialize: (value) => value,
});

export const Bigint = builder.scalarType('BigInt', {
  serialize: (value) => value.toString(),
  parseValue: (value) => {
    if (typeof value !== 'string' && typeof value !== 'number') throw new Error('Invalid Bigint');
    return BigInt(value);
  },
});

export const Hourly_occurrenceScalarFieldEnum = builder.enumType('Hourly_occurrenceScalarFieldEnum', {
  values: ["id","occurrence_id","interval_start","interval_end","count"] as const,
});

export const JsonNullValueFilter = builder.enumType('JsonNullValueFilter', {
  values: ["DbNull","JsonNull","AnyNull"] as const,
});

export const JsonNullValueInput = builder.enumType('JsonNullValueInput', {
  values: ["JsonNull"] as const,
});

export const NoticeScalarFieldEnum = builder.enumType('NoticeScalarFieldEnum', {
  values: ["id","project_id","env","kind","seen_count","created_at","updated_at"] as const,
});

export const OccurrenceScalarFieldEnum = builder.enumType('OccurrenceScalarFieldEnum', {
  values: ["id","notice_id","message","seen_count","backtrace","context","environment","session","params","created_at","updated_at"] as const,
});

export const ProjectScalarFieldEnum = builder.enumType('ProjectScalarFieldEnum', {
  values: ["id","name","api_key","organization","repo_provider","repo_provider_api_key","repo_provider_api_secret","repo_branch","repo_issue_tracker","repo_url","notices_count","created_at","updated_at"] as const,
});

export const QueryMode = builder.enumType('QueryMode', {
  values: ["default","insensitive"] as const,
});

export const SortOrder = builder.enumType('SortOrder', {
  values: ["asc","desc"] as const,
});

export const TransactionIsolationLevel = builder.enumType('TransactionIsolationLevel', {
  values: ["ReadUncommitted","ReadCommitted","RepeatableRead","Serializable"] as const,
});

export const projectWhereInputFields = (t: any) => ({
  AND: t.field({"required":false,"type":[projectWhereInput]}),
  OR: t.field({"required":false,"type":[projectWhereInput]}),
  NOT: t.field({"required":false,"type":[projectWhereInput]}),
  id: t.field({"required":false,"type":BigIntFilter}),
  name: t.field({"required":false,"type":StringFilter}),
  api_key: t.field({"required":false,"type":StringFilter}),
  organization: t.field({"required":false,"type":StringFilter}),
  repo_provider: t.field({"required":false,"type":StringFilter}),
  repo_provider_api_key: t.field({"required":false,"type":StringNullableFilter}),
  repo_provider_api_secret: t.field({"required":false,"type":StringNullableFilter}),
  repo_branch: t.field({"required":false,"type":StringFilter}),
  repo_issue_tracker: t.field({"required":false,"type":StringNullableFilter}),
  repo_url: t.field({"required":false,"type":StringNullableFilter}),
  notices_count: t.field({"required":false,"type":BigIntFilter}),
  created_at: t.field({"required":false,"type":DateTimeFilter}),
  updated_at: t.field({"required":false,"type":DateTimeFilter}),
  notices: t.field({"required":false,"type":NoticeListRelationFilter}),
});
export const projectWhereInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.projectWhereInput>>('projectWhereInput').implement({
  fields: projectWhereInputFields,
});

export const projectOrderByWithRelationInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  name: t.field({"required":false,"type":SortOrder}),
  api_key: t.field({"required":false,"type":SortOrder}),
  organization: t.field({"required":false,"type":SortOrder}),
  repo_provider: t.field({"required":false,"type":SortOrder}),
  repo_provider_api_key: t.field({"required":false,"type":SortOrder}),
  repo_provider_api_secret: t.field({"required":false,"type":SortOrder}),
  repo_branch: t.field({"required":false,"type":SortOrder}),
  repo_issue_tracker: t.field({"required":false,"type":SortOrder}),
  repo_url: t.field({"required":false,"type":SortOrder}),
  notices_count: t.field({"required":false,"type":SortOrder}),
  created_at: t.field({"required":false,"type":SortOrder}),
  updated_at: t.field({"required":false,"type":SortOrder}),
  notices: t.field({"required":false,"type":noticeOrderByRelationAggregateInput}),
});
export const projectOrderByWithRelationInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.projectOrderByWithRelationInput>>('projectOrderByWithRelationInput').implement({
  fields: projectOrderByWithRelationInputFields,
});

export const projectWhereUniqueInputFields = (t: any) => ({
  id: t.field({"required":false,"type":Bigint}),
  name: t.string({"required":false}),
  api_key: t.string({"required":false}),
});
export const projectWhereUniqueInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.projectWhereUniqueInput>>('projectWhereUniqueInput').implement({
  fields: projectWhereUniqueInputFields,
});

export const projectOrderByWithAggregationInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  name: t.field({"required":false,"type":SortOrder}),
  api_key: t.field({"required":false,"type":SortOrder}),
  organization: t.field({"required":false,"type":SortOrder}),
  repo_provider: t.field({"required":false,"type":SortOrder}),
  repo_provider_api_key: t.field({"required":false,"type":SortOrder}),
  repo_provider_api_secret: t.field({"required":false,"type":SortOrder}),
  repo_branch: t.field({"required":false,"type":SortOrder}),
  repo_issue_tracker: t.field({"required":false,"type":SortOrder}),
  repo_url: t.field({"required":false,"type":SortOrder}),
  notices_count: t.field({"required":false,"type":SortOrder}),
  created_at: t.field({"required":false,"type":SortOrder}),
  updated_at: t.field({"required":false,"type":SortOrder}),
  _count: t.field({"required":false,"type":projectCountOrderByAggregateInput}),
  _avg: t.field({"required":false,"type":projectAvgOrderByAggregateInput}),
  _max: t.field({"required":false,"type":projectMaxOrderByAggregateInput}),
  _min: t.field({"required":false,"type":projectMinOrderByAggregateInput}),
  _sum: t.field({"required":false,"type":projectSumOrderByAggregateInput}),
});
export const projectOrderByWithAggregationInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.projectOrderByWithAggregationInput>>('projectOrderByWithAggregationInput').implement({
  fields: projectOrderByWithAggregationInputFields,
});

export const projectScalarWhereWithAggregatesInputFields = (t: any) => ({
  AND: t.field({"required":false,"type":[projectScalarWhereWithAggregatesInput]}),
  OR: t.field({"required":false,"type":[projectScalarWhereWithAggregatesInput]}),
  NOT: t.field({"required":false,"type":[projectScalarWhereWithAggregatesInput]}),
  id: t.field({"required":false,"type":BigIntWithAggregatesFilter}),
  name: t.field({"required":false,"type":StringWithAggregatesFilter}),
  api_key: t.field({"required":false,"type":StringWithAggregatesFilter}),
  organization: t.field({"required":false,"type":StringWithAggregatesFilter}),
  repo_provider: t.field({"required":false,"type":StringWithAggregatesFilter}),
  repo_provider_api_key: t.field({"required":false,"type":StringNullableWithAggregatesFilter}),
  repo_provider_api_secret: t.field({"required":false,"type":StringNullableWithAggregatesFilter}),
  repo_branch: t.field({"required":false,"type":StringWithAggregatesFilter}),
  repo_issue_tracker: t.field({"required":false,"type":StringNullableWithAggregatesFilter}),
  repo_url: t.field({"required":false,"type":StringNullableWithAggregatesFilter}),
  notices_count: t.field({"required":false,"type":BigIntWithAggregatesFilter}),
  created_at: t.field({"required":false,"type":DateTimeWithAggregatesFilter}),
  updated_at: t.field({"required":false,"type":DateTimeWithAggregatesFilter}),
});
export const projectScalarWhereWithAggregatesInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.projectScalarWhereWithAggregatesInput>>('projectScalarWhereWithAggregatesInput').implement({
  fields: projectScalarWhereWithAggregatesInputFields,
});

export const noticeWhereInputFields = (t: any) => ({
  AND: t.field({"required":false,"type":[noticeWhereInput]}),
  OR: t.field({"required":false,"type":[noticeWhereInput]}),
  NOT: t.field({"required":false,"type":[noticeWhereInput]}),
  id: t.field({"required":false,"type":BigIntFilter}),
  project_id: t.field({"required":false,"type":BigIntFilter}),
  env: t.field({"required":false,"type":StringFilter}),
  kind: t.field({"required":false,"type":StringFilter}),
  seen_count: t.field({"required":false,"type":BigIntFilter}),
  created_at: t.field({"required":false,"type":DateTimeFilter}),
  updated_at: t.field({"required":false,"type":DateTimeFilter}),
  project: t.field({"required":false,"type":projectWhereInput}),
  occurrences: t.field({"required":false,"type":OccurrenceListRelationFilter}),
});
export const noticeWhereInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.noticeWhereInput>>('noticeWhereInput').implement({
  fields: noticeWhereInputFields,
});

export const noticeOrderByWithRelationInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  project_id: t.field({"required":false,"type":SortOrder}),
  env: t.field({"required":false,"type":SortOrder}),
  kind: t.field({"required":false,"type":SortOrder}),
  seen_count: t.field({"required":false,"type":SortOrder}),
  created_at: t.field({"required":false,"type":SortOrder}),
  updated_at: t.field({"required":false,"type":SortOrder}),
  project: t.field({"required":false,"type":projectOrderByWithRelationInput}),
  occurrences: t.field({"required":false,"type":occurrenceOrderByRelationAggregateInput}),
});
export const noticeOrderByWithRelationInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.noticeOrderByWithRelationInput>>('noticeOrderByWithRelationInput').implement({
  fields: noticeOrderByWithRelationInputFields,
});

export const noticeWhereUniqueInputFields = (t: any) => ({
  id: t.field({"required":false,"type":Bigint}),
  project_id_env_kind: t.field({"required":false,"type":noticeProject_idEnvKindCompoundUniqueInput}),
});
export const noticeWhereUniqueInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.noticeWhereUniqueInput>>('noticeWhereUniqueInput').implement({
  fields: noticeWhereUniqueInputFields,
});

export const noticeOrderByWithAggregationInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  project_id: t.field({"required":false,"type":SortOrder}),
  env: t.field({"required":false,"type":SortOrder}),
  kind: t.field({"required":false,"type":SortOrder}),
  seen_count: t.field({"required":false,"type":SortOrder}),
  created_at: t.field({"required":false,"type":SortOrder}),
  updated_at: t.field({"required":false,"type":SortOrder}),
  _count: t.field({"required":false,"type":noticeCountOrderByAggregateInput}),
  _avg: t.field({"required":false,"type":noticeAvgOrderByAggregateInput}),
  _max: t.field({"required":false,"type":noticeMaxOrderByAggregateInput}),
  _min: t.field({"required":false,"type":noticeMinOrderByAggregateInput}),
  _sum: t.field({"required":false,"type":noticeSumOrderByAggregateInput}),
});
export const noticeOrderByWithAggregationInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.noticeOrderByWithAggregationInput>>('noticeOrderByWithAggregationInput').implement({
  fields: noticeOrderByWithAggregationInputFields,
});

export const noticeScalarWhereWithAggregatesInputFields = (t: any) => ({
  AND: t.field({"required":false,"type":[noticeScalarWhereWithAggregatesInput]}),
  OR: t.field({"required":false,"type":[noticeScalarWhereWithAggregatesInput]}),
  NOT: t.field({"required":false,"type":[noticeScalarWhereWithAggregatesInput]}),
  id: t.field({"required":false,"type":BigIntWithAggregatesFilter}),
  project_id: t.field({"required":false,"type":BigIntWithAggregatesFilter}),
  env: t.field({"required":false,"type":StringWithAggregatesFilter}),
  kind: t.field({"required":false,"type":StringWithAggregatesFilter}),
  seen_count: t.field({"required":false,"type":BigIntWithAggregatesFilter}),
  created_at: t.field({"required":false,"type":DateTimeWithAggregatesFilter}),
  updated_at: t.field({"required":false,"type":DateTimeWithAggregatesFilter}),
});
export const noticeScalarWhereWithAggregatesInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.noticeScalarWhereWithAggregatesInput>>('noticeScalarWhereWithAggregatesInput').implement({
  fields: noticeScalarWhereWithAggregatesInputFields,
});

export const occurrenceWhereInputFields = (t: any) => ({
  AND: t.field({"required":false,"type":[occurrenceWhereInput]}),
  OR: t.field({"required":false,"type":[occurrenceWhereInput]}),
  NOT: t.field({"required":false,"type":[occurrenceWhereInput]}),
  id: t.field({"required":false,"type":BigIntFilter}),
  notice_id: t.field({"required":false,"type":BigIntFilter}),
  message: t.field({"required":false,"type":StringFilter}),
  seen_count: t.field({"required":false,"type":BigIntFilter}),
  backtrace: t.field({"required":false,"type":JsonFilter}),
  context: t.field({"required":false,"type":JsonFilter}),
  environment: t.field({"required":false,"type":JsonFilter}),
  session: t.field({"required":false,"type":JsonFilter}),
  params: t.field({"required":false,"type":JsonFilter}),
  created_at: t.field({"required":false,"type":DateTimeFilter}),
  updated_at: t.field({"required":false,"type":DateTimeFilter}),
  notice: t.field({"required":false,"type":noticeWhereInput}),
  hourly_occurrences: t.field({"required":false,"type":Hourly_occurrenceListRelationFilter}),
});
export const occurrenceWhereInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.occurrenceWhereInput>>('occurrenceWhereInput').implement({
  fields: occurrenceWhereInputFields,
});

export const occurrenceOrderByWithRelationInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  notice_id: t.field({"required":false,"type":SortOrder}),
  message: t.field({"required":false,"type":SortOrder}),
  seen_count: t.field({"required":false,"type":SortOrder}),
  backtrace: t.field({"required":false,"type":SortOrder}),
  context: t.field({"required":false,"type":SortOrder}),
  environment: t.field({"required":false,"type":SortOrder}),
  session: t.field({"required":false,"type":SortOrder}),
  params: t.field({"required":false,"type":SortOrder}),
  created_at: t.field({"required":false,"type":SortOrder}),
  updated_at: t.field({"required":false,"type":SortOrder}),
  notice: t.field({"required":false,"type":noticeOrderByWithRelationInput}),
  hourly_occurrences: t.field({"required":false,"type":hourly_occurrenceOrderByRelationAggregateInput}),
});
export const occurrenceOrderByWithRelationInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.occurrenceOrderByWithRelationInput>>('occurrenceOrderByWithRelationInput').implement({
  fields: occurrenceOrderByWithRelationInputFields,
});

export const occurrenceWhereUniqueInputFields = (t: any) => ({
  id: t.field({"required":false,"type":Bigint}),
  notice_id_message: t.field({"required":false,"type":occurrenceNotice_idMessageCompoundUniqueInput}),
});
export const occurrenceWhereUniqueInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.occurrenceWhereUniqueInput>>('occurrenceWhereUniqueInput').implement({
  fields: occurrenceWhereUniqueInputFields,
});

export const occurrenceOrderByWithAggregationInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  notice_id: t.field({"required":false,"type":SortOrder}),
  message: t.field({"required":false,"type":SortOrder}),
  seen_count: t.field({"required":false,"type":SortOrder}),
  backtrace: t.field({"required":false,"type":SortOrder}),
  context: t.field({"required":false,"type":SortOrder}),
  environment: t.field({"required":false,"type":SortOrder}),
  session: t.field({"required":false,"type":SortOrder}),
  params: t.field({"required":false,"type":SortOrder}),
  created_at: t.field({"required":false,"type":SortOrder}),
  updated_at: t.field({"required":false,"type":SortOrder}),
  _count: t.field({"required":false,"type":occurrenceCountOrderByAggregateInput}),
  _avg: t.field({"required":false,"type":occurrenceAvgOrderByAggregateInput}),
  _max: t.field({"required":false,"type":occurrenceMaxOrderByAggregateInput}),
  _min: t.field({"required":false,"type":occurrenceMinOrderByAggregateInput}),
  _sum: t.field({"required":false,"type":occurrenceSumOrderByAggregateInput}),
});
export const occurrenceOrderByWithAggregationInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.occurrenceOrderByWithAggregationInput>>('occurrenceOrderByWithAggregationInput').implement({
  fields: occurrenceOrderByWithAggregationInputFields,
});

export const occurrenceScalarWhereWithAggregatesInputFields = (t: any) => ({
  AND: t.field({"required":false,"type":[occurrenceScalarWhereWithAggregatesInput]}),
  OR: t.field({"required":false,"type":[occurrenceScalarWhereWithAggregatesInput]}),
  NOT: t.field({"required":false,"type":[occurrenceScalarWhereWithAggregatesInput]}),
  id: t.field({"required":false,"type":BigIntWithAggregatesFilter}),
  notice_id: t.field({"required":false,"type":BigIntWithAggregatesFilter}),
  message: t.field({"required":false,"type":StringWithAggregatesFilter}),
  seen_count: t.field({"required":false,"type":BigIntWithAggregatesFilter}),
  backtrace: t.field({"required":false,"type":JsonWithAggregatesFilter}),
  context: t.field({"required":false,"type":JsonWithAggregatesFilter}),
  environment: t.field({"required":false,"type":JsonWithAggregatesFilter}),
  session: t.field({"required":false,"type":JsonWithAggregatesFilter}),
  params: t.field({"required":false,"type":JsonWithAggregatesFilter}),
  created_at: t.field({"required":false,"type":DateTimeWithAggregatesFilter}),
  updated_at: t.field({"required":false,"type":DateTimeWithAggregatesFilter}),
});
export const occurrenceScalarWhereWithAggregatesInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.occurrenceScalarWhereWithAggregatesInput>>('occurrenceScalarWhereWithAggregatesInput').implement({
  fields: occurrenceScalarWhereWithAggregatesInputFields,
});

export const hourly_occurrenceWhereInputFields = (t: any) => ({
  AND: t.field({"required":false,"type":[hourly_occurrenceWhereInput]}),
  OR: t.field({"required":false,"type":[hourly_occurrenceWhereInput]}),
  NOT: t.field({"required":false,"type":[hourly_occurrenceWhereInput]}),
  id: t.field({"required":false,"type":BigIntFilter}),
  occurrence_id: t.field({"required":false,"type":BigIntFilter}),
  interval_start: t.field({"required":false,"type":DateTimeFilter}),
  interval_end: t.field({"required":false,"type":DateTimeFilter}),
  count: t.field({"required":false,"type":BigIntFilter}),
  occurrence: t.field({"required":false,"type":occurrenceWhereInput}),
});
export const hourly_occurrenceWhereInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.hourly_occurrenceWhereInput>>('hourly_occurrenceWhereInput').implement({
  fields: hourly_occurrenceWhereInputFields,
});

export const hourly_occurrenceOrderByWithRelationInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  occurrence_id: t.field({"required":false,"type":SortOrder}),
  interval_start: t.field({"required":false,"type":SortOrder}),
  interval_end: t.field({"required":false,"type":SortOrder}),
  count: t.field({"required":false,"type":SortOrder}),
  occurrence: t.field({"required":false,"type":occurrenceOrderByWithRelationInput}),
});
export const hourly_occurrenceOrderByWithRelationInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.hourly_occurrenceOrderByWithRelationInput>>('hourly_occurrenceOrderByWithRelationInput').implement({
  fields: hourly_occurrenceOrderByWithRelationInputFields,
});

export const hourly_occurrenceWhereUniqueInputFields = (t: any) => ({
  id: t.field({"required":false,"type":Bigint}),
});
export const hourly_occurrenceWhereUniqueInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.hourly_occurrenceWhereUniqueInput>>('hourly_occurrenceWhereUniqueInput').implement({
  fields: hourly_occurrenceWhereUniqueInputFields,
});

export const hourly_occurrenceOrderByWithAggregationInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  occurrence_id: t.field({"required":false,"type":SortOrder}),
  interval_start: t.field({"required":false,"type":SortOrder}),
  interval_end: t.field({"required":false,"type":SortOrder}),
  count: t.field({"required":false,"type":SortOrder}),
  _count: t.field({"required":false,"type":hourly_occurrenceCountOrderByAggregateInput}),
  _avg: t.field({"required":false,"type":hourly_occurrenceAvgOrderByAggregateInput}),
  _max: t.field({"required":false,"type":hourly_occurrenceMaxOrderByAggregateInput}),
  _min: t.field({"required":false,"type":hourly_occurrenceMinOrderByAggregateInput}),
  _sum: t.field({"required":false,"type":hourly_occurrenceSumOrderByAggregateInput}),
});
export const hourly_occurrenceOrderByWithAggregationInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.hourly_occurrenceOrderByWithAggregationInput>>('hourly_occurrenceOrderByWithAggregationInput').implement({
  fields: hourly_occurrenceOrderByWithAggregationInputFields,
});

export const hourly_occurrenceScalarWhereWithAggregatesInputFields = (t: any) => ({
  AND: t.field({"required":false,"type":[hourly_occurrenceScalarWhereWithAggregatesInput]}),
  OR: t.field({"required":false,"type":[hourly_occurrenceScalarWhereWithAggregatesInput]}),
  NOT: t.field({"required":false,"type":[hourly_occurrenceScalarWhereWithAggregatesInput]}),
  id: t.field({"required":false,"type":BigIntWithAggregatesFilter}),
  occurrence_id: t.field({"required":false,"type":BigIntWithAggregatesFilter}),
  interval_start: t.field({"required":false,"type":DateTimeWithAggregatesFilter}),
  interval_end: t.field({"required":false,"type":DateTimeWithAggregatesFilter}),
  count: t.field({"required":false,"type":BigIntWithAggregatesFilter}),
});
export const hourly_occurrenceScalarWhereWithAggregatesInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.hourly_occurrenceScalarWhereWithAggregatesInput>>('hourly_occurrenceScalarWhereWithAggregatesInput').implement({
  fields: hourly_occurrenceScalarWhereWithAggregatesInputFields,
});

export const projectCreateInputFields = (t: any) => ({
  name: t.string({"required":true}),
  api_key: t.string({"required":true}),
  organization: t.string({"required":false}),
  repo_provider: t.string({"required":false}),
  repo_provider_api_key: t.string({"required":false}),
  repo_provider_api_secret: t.string({"required":false}),
  repo_branch: t.string({"required":false}),
  repo_issue_tracker: t.string({"required":false}),
  repo_url: t.string({"required":false}),
  notices: t.field({"required":false,"type":noticeCreateNestedManyWithoutProjectInput}),
  // 'id' was omitted due to @Pothos.omit found in schema comment
  // 'notices_count' was omitted due to @Pothos.omit found in schema comment
  // 'created_at' was omitted due to @Pothos.omit found in schema comment
  // 'updated_at' was omitted due to @Pothos.omit found in schema comment
});
export const projectCreateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.projectCreateInput>>('projectCreateInput').implement({
  fields: projectCreateInputFields,
});

export const projectUpdateInputFields = (t: any) => ({
  name: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  api_key: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  organization: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  repo_provider: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  repo_provider_api_key: t.field({"required":false,"type":NullableStringFieldUpdateOperationsInput}),
  repo_provider_api_secret: t.field({"required":false,"type":NullableStringFieldUpdateOperationsInput}),
  repo_branch: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  repo_issue_tracker: t.field({"required":false,"type":NullableStringFieldUpdateOperationsInput}),
  repo_url: t.field({"required":false,"type":NullableStringFieldUpdateOperationsInput}),
  notices: t.field({"required":false,"type":noticeUpdateManyWithoutProjectNestedInput}),
  // 'id' was omitted due to @Pothos.omit found in schema comment
  // 'notices_count' was omitted due to @Pothos.omit found in schema comment
  // 'created_at' was omitted due to @Pothos.omit found in schema comment
  // 'updated_at' was omitted due to @Pothos.omit found in schema comment
});
export const projectUpdateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.projectUpdateInput>>('projectUpdateInput').implement({
  fields: projectUpdateInputFields,
});

export const projectCreateManyInputFields = (t: any) => ({
  name: t.string({"required":true}),
  api_key: t.string({"required":true}),
  organization: t.string({"required":false}),
  repo_provider: t.string({"required":false}),
  repo_provider_api_key: t.string({"required":false}),
  repo_provider_api_secret: t.string({"required":false}),
  repo_branch: t.string({"required":false}),
  repo_issue_tracker: t.string({"required":false}),
  repo_url: t.string({"required":false}),
  // 'id' was omitted due to @Pothos.omit found in schema comment
  // 'notices_count' was omitted due to @Pothos.omit found in schema comment
  // 'created_at' was omitted due to @Pothos.omit found in schema comment
  // 'updated_at' was omitted due to @Pothos.omit found in schema comment
});
export const projectCreateManyInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.projectCreateManyInput>>('projectCreateManyInput').implement({
  fields: projectCreateManyInputFields,
});

export const projectUpdateManyMutationInputFields = (t: any) => ({
  name: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  api_key: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  organization: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  repo_provider: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  repo_provider_api_key: t.field({"required":false,"type":NullableStringFieldUpdateOperationsInput}),
  repo_provider_api_secret: t.field({"required":false,"type":NullableStringFieldUpdateOperationsInput}),
  repo_branch: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  repo_issue_tracker: t.field({"required":false,"type":NullableStringFieldUpdateOperationsInput}),
  repo_url: t.field({"required":false,"type":NullableStringFieldUpdateOperationsInput}),
  // 'id' was omitted due to @Pothos.omit found in schema comment
  // 'notices_count' was omitted due to @Pothos.omit found in schema comment
  // 'created_at' was omitted due to @Pothos.omit found in schema comment
  // 'updated_at' was omitted due to @Pothos.omit found in schema comment
});
export const projectUpdateManyMutationInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.projectUpdateManyMutationInput>>('projectUpdateManyMutationInput').implement({
  fields: projectUpdateManyMutationInputFields,
});

export const noticeCreateInputFields = (t: any) => ({
  env: t.string({"required":false}),
  kind: t.string({"required":false}),
  project: t.field({"required":true,"type":projectCreateNestedOneWithoutNoticesInput}),
  occurrences: t.field({"required":false,"type":occurrenceCreateNestedManyWithoutNoticeInput}),
  // 'id' was omitted due to @Pothos.omit found in schema comment
  // 'seen_count' was omitted due to @Pothos.omit found in schema comment
  // 'created_at' was omitted due to @Pothos.omit found in schema comment
  // 'updated_at' was omitted due to @Pothos.omit found in schema comment
});
export const noticeCreateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.noticeCreateInput>>('noticeCreateInput').implement({
  fields: noticeCreateInputFields,
});

export const noticeUpdateInputFields = (t: any) => ({
  env: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  kind: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  project: t.field({"required":false,"type":projectUpdateOneRequiredWithoutNoticesNestedInput}),
  occurrences: t.field({"required":false,"type":occurrenceUpdateManyWithoutNoticeNestedInput}),
  // 'id' was omitted due to @Pothos.omit found in schema comment
  // 'seen_count' was omitted due to @Pothos.omit found in schema comment
  // 'created_at' was omitted due to @Pothos.omit found in schema comment
  // 'updated_at' was omitted due to @Pothos.omit found in schema comment
});
export const noticeUpdateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.noticeUpdateInput>>('noticeUpdateInput').implement({
  fields: noticeUpdateInputFields,
});

export const noticeCreateManyInputFields = (t: any) => ({
  project_id: t.field({"required":true,"type":Bigint}),
  env: t.string({"required":false}),
  kind: t.string({"required":false}),
  // 'id' was omitted due to @Pothos.omit found in schema comment
  // 'seen_count' was omitted due to @Pothos.omit found in schema comment
  // 'created_at' was omitted due to @Pothos.omit found in schema comment
  // 'updated_at' was omitted due to @Pothos.omit found in schema comment
});
export const noticeCreateManyInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.noticeCreateManyInput>>('noticeCreateManyInput').implement({
  fields: noticeCreateManyInputFields,
});

export const noticeUpdateManyMutationInputFields = (t: any) => ({
  env: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  kind: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  // 'id' was omitted due to @Pothos.omit found in schema comment
  // 'seen_count' was omitted due to @Pothos.omit found in schema comment
  // 'created_at' was omitted due to @Pothos.omit found in schema comment
  // 'updated_at' was omitted due to @Pothos.omit found in schema comment
});
export const noticeUpdateManyMutationInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.noticeUpdateManyMutationInput>>('noticeUpdateManyMutationInput').implement({
  fields: noticeUpdateManyMutationInputFields,
});

export const occurrenceCreateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":Bigint}),
  message: t.string({"required":true}),
  seen_count: t.field({"required":false,"type":Bigint}),
  backtrace: t.field({"required":false,"type":Json}),
  context: t.field({"required":false,"type":Json}),
  environment: t.field({"required":false,"type":Json}),
  session: t.field({"required":false,"type":Json}),
  params: t.field({"required":false,"type":Json}),
  created_at: t.field({"required":false,"type":DateTime}),
  updated_at: t.field({"required":false,"type":DateTime}),
  notice: t.field({"required":true,"type":noticeCreateNestedOneWithoutOccurrencesInput}),
  hourly_occurrences: t.field({"required":false,"type":hourly_occurrenceCreateNestedManyWithoutOccurrenceInput}),
});
export const occurrenceCreateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.occurrenceCreateInput>>('occurrenceCreateInput').implement({
  fields: occurrenceCreateInputFields,
});

export const occurrenceUpdateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":BigIntFieldUpdateOperationsInput}),
  message: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  seen_count: t.field({"required":false,"type":BigIntFieldUpdateOperationsInput}),
  backtrace: t.field({"required":false,"type":Json}),
  context: t.field({"required":false,"type":Json}),
  environment: t.field({"required":false,"type":Json}),
  session: t.field({"required":false,"type":Json}),
  params: t.field({"required":false,"type":Json}),
  created_at: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  updated_at: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  notice: t.field({"required":false,"type":noticeUpdateOneRequiredWithoutOccurrencesNestedInput}),
  hourly_occurrences: t.field({"required":false,"type":hourly_occurrenceUpdateManyWithoutOccurrenceNestedInput}),
});
export const occurrenceUpdateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.occurrenceUpdateInput>>('occurrenceUpdateInput').implement({
  fields: occurrenceUpdateInputFields,
});

export const occurrenceCreateManyInputFields = (t: any) => ({
  id: t.field({"required":false,"type":Bigint}),
  notice_id: t.field({"required":true,"type":Bigint}),
  message: t.string({"required":true}),
  seen_count: t.field({"required":false,"type":Bigint}),
  backtrace: t.field({"required":false,"type":Json}),
  context: t.field({"required":false,"type":Json}),
  environment: t.field({"required":false,"type":Json}),
  session: t.field({"required":false,"type":Json}),
  params: t.field({"required":false,"type":Json}),
  created_at: t.field({"required":false,"type":DateTime}),
  updated_at: t.field({"required":false,"type":DateTime}),
});
export const occurrenceCreateManyInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.occurrenceCreateManyInput>>('occurrenceCreateManyInput').implement({
  fields: occurrenceCreateManyInputFields,
});

export const occurrenceUpdateManyMutationInputFields = (t: any) => ({
  id: t.field({"required":false,"type":BigIntFieldUpdateOperationsInput}),
  message: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  seen_count: t.field({"required":false,"type":BigIntFieldUpdateOperationsInput}),
  backtrace: t.field({"required":false,"type":Json}),
  context: t.field({"required":false,"type":Json}),
  environment: t.field({"required":false,"type":Json}),
  session: t.field({"required":false,"type":Json}),
  params: t.field({"required":false,"type":Json}),
  created_at: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  updated_at: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
});
export const occurrenceUpdateManyMutationInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.occurrenceUpdateManyMutationInput>>('occurrenceUpdateManyMutationInput').implement({
  fields: occurrenceUpdateManyMutationInputFields,
});

export const hourly_occurrenceCreateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":Bigint}),
  interval_start: t.field({"required":true,"type":DateTime}),
  interval_end: t.field({"required":true,"type":DateTime}),
  count: t.field({"required":false,"type":Bigint}),
  occurrence: t.field({"required":true,"type":occurrenceCreateNestedOneWithoutHourly_occurrencesInput}),
});
export const hourly_occurrenceCreateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.hourly_occurrenceCreateInput>>('hourly_occurrenceCreateInput').implement({
  fields: hourly_occurrenceCreateInputFields,
});

export const hourly_occurrenceUpdateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":BigIntFieldUpdateOperationsInput}),
  interval_start: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  interval_end: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  count: t.field({"required":false,"type":BigIntFieldUpdateOperationsInput}),
  occurrence: t.field({"required":false,"type":occurrenceUpdateOneRequiredWithoutHourly_occurrencesNestedInput}),
});
export const hourly_occurrenceUpdateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.hourly_occurrenceUpdateInput>>('hourly_occurrenceUpdateInput').implement({
  fields: hourly_occurrenceUpdateInputFields,
});

export const hourly_occurrenceCreateManyInputFields = (t: any) => ({
  id: t.field({"required":false,"type":Bigint}),
  occurrence_id: t.field({"required":true,"type":Bigint}),
  interval_start: t.field({"required":true,"type":DateTime}),
  interval_end: t.field({"required":true,"type":DateTime}),
  count: t.field({"required":false,"type":Bigint}),
});
export const hourly_occurrenceCreateManyInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.hourly_occurrenceCreateManyInput>>('hourly_occurrenceCreateManyInput').implement({
  fields: hourly_occurrenceCreateManyInputFields,
});

export const hourly_occurrenceUpdateManyMutationInputFields = (t: any) => ({
  id: t.field({"required":false,"type":BigIntFieldUpdateOperationsInput}),
  interval_start: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  interval_end: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  count: t.field({"required":false,"type":BigIntFieldUpdateOperationsInput}),
});
export const hourly_occurrenceUpdateManyMutationInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.hourly_occurrenceUpdateManyMutationInput>>('hourly_occurrenceUpdateManyMutationInput').implement({
  fields: hourly_occurrenceUpdateManyMutationInputFields,
});

export const BigIntFilterFields = (t: any) => ({
  equals: t.field({"required":false,"type":Bigint}),
  in: t.field({"required":false,"type":[Bigint]}),
  notIn: t.field({"required":false,"type":[Bigint]}),
  lt: t.field({"required":false,"type":Bigint}),
  lte: t.field({"required":false,"type":Bigint}),
  gt: t.field({"required":false,"type":Bigint}),
  gte: t.field({"required":false,"type":Bigint}),
  not: t.field({"required":false,"type":NestedBigIntFilter}),
});
export const BigIntFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.BigIntFilter>>('BigIntFilter').implement({
  fields: BigIntFilterFields,
});

export const StringFilterFields = (t: any) => ({
  equals: t.string({"required":false}),
  in: t.stringList({"required":false}),
  notIn: t.stringList({"required":false}),
  lt: t.string({"required":false}),
  lte: t.string({"required":false}),
  gt: t.string({"required":false}),
  gte: t.string({"required":false}),
  contains: t.string({"required":false}),
  startsWith: t.string({"required":false}),
  endsWith: t.string({"required":false}),
  mode: t.field({"required":false,"type":QueryMode}),
  not: t.field({"required":false,"type":NestedStringFilter}),
});
export const StringFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.StringFilter>>('StringFilter').implement({
  fields: StringFilterFields,
});

export const StringNullableFilterFields = (t: any) => ({
  equals: t.string({"required":false}),
  in: t.stringList({"required":false}),
  notIn: t.stringList({"required":false}),
  lt: t.string({"required":false}),
  lte: t.string({"required":false}),
  gt: t.string({"required":false}),
  gte: t.string({"required":false}),
  contains: t.string({"required":false}),
  startsWith: t.string({"required":false}),
  endsWith: t.string({"required":false}),
  mode: t.field({"required":false,"type":QueryMode}),
  not: t.field({"required":false,"type":NestedStringNullableFilter}),
});
export const StringNullableFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.StringNullableFilter>>('StringNullableFilter').implement({
  fields: StringNullableFilterFields,
});

export const DateTimeFilterFields = (t: any) => ({
  equals: t.field({"required":false,"type":DateTime}),
  in: t.field({"required":false,"type":[DateTime]}),
  notIn: t.field({"required":false,"type":[DateTime]}),
  lt: t.field({"required":false,"type":DateTime}),
  lte: t.field({"required":false,"type":DateTime}),
  gt: t.field({"required":false,"type":DateTime}),
  gte: t.field({"required":false,"type":DateTime}),
  not: t.field({"required":false,"type":NestedDateTimeFilter}),
});
export const DateTimeFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.DateTimeFilter>>('DateTimeFilter').implement({
  fields: DateTimeFilterFields,
});

export const NoticeListRelationFilterFields = (t: any) => ({
  every: t.field({"required":false,"type":noticeWhereInput}),
  some: t.field({"required":false,"type":noticeWhereInput}),
  none: t.field({"required":false,"type":noticeWhereInput}),
});
export const NoticeListRelationFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NoticeListRelationFilter>>('NoticeListRelationFilter').implement({
  fields: NoticeListRelationFilterFields,
});

export const noticeOrderByRelationAggregateInputFields = (t: any) => ({
  _count: t.field({"required":false,"type":SortOrder}),
});
export const noticeOrderByRelationAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.noticeOrderByRelationAggregateInput>>('noticeOrderByRelationAggregateInput').implement({
  fields: noticeOrderByRelationAggregateInputFields,
});

export const projectCountOrderByAggregateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  name: t.field({"required":false,"type":SortOrder}),
  api_key: t.field({"required":false,"type":SortOrder}),
  organization: t.field({"required":false,"type":SortOrder}),
  repo_provider: t.field({"required":false,"type":SortOrder}),
  repo_provider_api_key: t.field({"required":false,"type":SortOrder}),
  repo_provider_api_secret: t.field({"required":false,"type":SortOrder}),
  repo_branch: t.field({"required":false,"type":SortOrder}),
  repo_issue_tracker: t.field({"required":false,"type":SortOrder}),
  repo_url: t.field({"required":false,"type":SortOrder}),
  notices_count: t.field({"required":false,"type":SortOrder}),
  created_at: t.field({"required":false,"type":SortOrder}),
  updated_at: t.field({"required":false,"type":SortOrder}),
});
export const projectCountOrderByAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.projectCountOrderByAggregateInput>>('projectCountOrderByAggregateInput').implement({
  fields: projectCountOrderByAggregateInputFields,
});

export const projectAvgOrderByAggregateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  notices_count: t.field({"required":false,"type":SortOrder}),
});
export const projectAvgOrderByAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.projectAvgOrderByAggregateInput>>('projectAvgOrderByAggregateInput').implement({
  fields: projectAvgOrderByAggregateInputFields,
});

export const projectMaxOrderByAggregateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  name: t.field({"required":false,"type":SortOrder}),
  api_key: t.field({"required":false,"type":SortOrder}),
  organization: t.field({"required":false,"type":SortOrder}),
  repo_provider: t.field({"required":false,"type":SortOrder}),
  repo_provider_api_key: t.field({"required":false,"type":SortOrder}),
  repo_provider_api_secret: t.field({"required":false,"type":SortOrder}),
  repo_branch: t.field({"required":false,"type":SortOrder}),
  repo_issue_tracker: t.field({"required":false,"type":SortOrder}),
  repo_url: t.field({"required":false,"type":SortOrder}),
  notices_count: t.field({"required":false,"type":SortOrder}),
  created_at: t.field({"required":false,"type":SortOrder}),
  updated_at: t.field({"required":false,"type":SortOrder}),
});
export const projectMaxOrderByAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.projectMaxOrderByAggregateInput>>('projectMaxOrderByAggregateInput').implement({
  fields: projectMaxOrderByAggregateInputFields,
});

export const projectMinOrderByAggregateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  name: t.field({"required":false,"type":SortOrder}),
  api_key: t.field({"required":false,"type":SortOrder}),
  organization: t.field({"required":false,"type":SortOrder}),
  repo_provider: t.field({"required":false,"type":SortOrder}),
  repo_provider_api_key: t.field({"required":false,"type":SortOrder}),
  repo_provider_api_secret: t.field({"required":false,"type":SortOrder}),
  repo_branch: t.field({"required":false,"type":SortOrder}),
  repo_issue_tracker: t.field({"required":false,"type":SortOrder}),
  repo_url: t.field({"required":false,"type":SortOrder}),
  notices_count: t.field({"required":false,"type":SortOrder}),
  created_at: t.field({"required":false,"type":SortOrder}),
  updated_at: t.field({"required":false,"type":SortOrder}),
});
export const projectMinOrderByAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.projectMinOrderByAggregateInput>>('projectMinOrderByAggregateInput').implement({
  fields: projectMinOrderByAggregateInputFields,
});

export const projectSumOrderByAggregateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  notices_count: t.field({"required":false,"type":SortOrder}),
});
export const projectSumOrderByAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.projectSumOrderByAggregateInput>>('projectSumOrderByAggregateInput').implement({
  fields: projectSumOrderByAggregateInputFields,
});

export const BigIntWithAggregatesFilterFields = (t: any) => ({
  equals: t.field({"required":false,"type":Bigint}),
  in: t.field({"required":false,"type":[Bigint]}),
  notIn: t.field({"required":false,"type":[Bigint]}),
  lt: t.field({"required":false,"type":Bigint}),
  lte: t.field({"required":false,"type":Bigint}),
  gt: t.field({"required":false,"type":Bigint}),
  gte: t.field({"required":false,"type":Bigint}),
  not: t.field({"required":false,"type":NestedBigIntWithAggregatesFilter}),
  _count: t.field({"required":false,"type":NestedIntFilter}),
  _avg: t.field({"required":false,"type":NestedFloatFilter}),
  _sum: t.field({"required":false,"type":NestedBigIntFilter}),
  _min: t.field({"required":false,"type":NestedBigIntFilter}),
  _max: t.field({"required":false,"type":NestedBigIntFilter}),
});
export const BigIntWithAggregatesFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.BigIntWithAggregatesFilter>>('BigIntWithAggregatesFilter').implement({
  fields: BigIntWithAggregatesFilterFields,
});

export const StringWithAggregatesFilterFields = (t: any) => ({
  equals: t.string({"required":false}),
  in: t.stringList({"required":false}),
  notIn: t.stringList({"required":false}),
  lt: t.string({"required":false}),
  lte: t.string({"required":false}),
  gt: t.string({"required":false}),
  gte: t.string({"required":false}),
  contains: t.string({"required":false}),
  startsWith: t.string({"required":false}),
  endsWith: t.string({"required":false}),
  mode: t.field({"required":false,"type":QueryMode}),
  not: t.field({"required":false,"type":NestedStringWithAggregatesFilter}),
  _count: t.field({"required":false,"type":NestedIntFilter}),
  _min: t.field({"required":false,"type":NestedStringFilter}),
  _max: t.field({"required":false,"type":NestedStringFilter}),
});
export const StringWithAggregatesFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.StringWithAggregatesFilter>>('StringWithAggregatesFilter').implement({
  fields: StringWithAggregatesFilterFields,
});

export const StringNullableWithAggregatesFilterFields = (t: any) => ({
  equals: t.string({"required":false}),
  in: t.stringList({"required":false}),
  notIn: t.stringList({"required":false}),
  lt: t.string({"required":false}),
  lte: t.string({"required":false}),
  gt: t.string({"required":false}),
  gte: t.string({"required":false}),
  contains: t.string({"required":false}),
  startsWith: t.string({"required":false}),
  endsWith: t.string({"required":false}),
  mode: t.field({"required":false,"type":QueryMode}),
  not: t.field({"required":false,"type":NestedStringNullableWithAggregatesFilter}),
  _count: t.field({"required":false,"type":NestedIntNullableFilter}),
  _min: t.field({"required":false,"type":NestedStringNullableFilter}),
  _max: t.field({"required":false,"type":NestedStringNullableFilter}),
});
export const StringNullableWithAggregatesFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.StringNullableWithAggregatesFilter>>('StringNullableWithAggregatesFilter').implement({
  fields: StringNullableWithAggregatesFilterFields,
});

export const DateTimeWithAggregatesFilterFields = (t: any) => ({
  equals: t.field({"required":false,"type":DateTime}),
  in: t.field({"required":false,"type":[DateTime]}),
  notIn: t.field({"required":false,"type":[DateTime]}),
  lt: t.field({"required":false,"type":DateTime}),
  lte: t.field({"required":false,"type":DateTime}),
  gt: t.field({"required":false,"type":DateTime}),
  gte: t.field({"required":false,"type":DateTime}),
  not: t.field({"required":false,"type":NestedDateTimeWithAggregatesFilter}),
  _count: t.field({"required":false,"type":NestedIntFilter}),
  _min: t.field({"required":false,"type":NestedDateTimeFilter}),
  _max: t.field({"required":false,"type":NestedDateTimeFilter}),
});
export const DateTimeWithAggregatesFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.DateTimeWithAggregatesFilter>>('DateTimeWithAggregatesFilter').implement({
  fields: DateTimeWithAggregatesFilterFields,
});

export const ProjectRelationFilterFields = (t: any) => ({
  is: t.field({"required":false,"type":projectWhereInput}),
  isNot: t.field({"required":false,"type":projectWhereInput}),
});
export const ProjectRelationFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.ProjectRelationFilter>>('ProjectRelationFilter').implement({
  fields: ProjectRelationFilterFields,
});

export const OccurrenceListRelationFilterFields = (t: any) => ({
  every: t.field({"required":false,"type":occurrenceWhereInput}),
  some: t.field({"required":false,"type":occurrenceWhereInput}),
  none: t.field({"required":false,"type":occurrenceWhereInput}),
});
export const OccurrenceListRelationFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.OccurrenceListRelationFilter>>('OccurrenceListRelationFilter').implement({
  fields: OccurrenceListRelationFilterFields,
});

export const occurrenceOrderByRelationAggregateInputFields = (t: any) => ({
  _count: t.field({"required":false,"type":SortOrder}),
});
export const occurrenceOrderByRelationAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.occurrenceOrderByRelationAggregateInput>>('occurrenceOrderByRelationAggregateInput').implement({
  fields: occurrenceOrderByRelationAggregateInputFields,
});

export const noticeProject_idEnvKindCompoundUniqueInputFields = (t: any) => ({
  project_id: t.field({"required":true,"type":Bigint}),
  env: t.string({"required":true}),
  kind: t.string({"required":true}),
});
export const noticeProject_idEnvKindCompoundUniqueInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.noticeProject_idEnvKindCompoundUniqueInput>>('noticeProject_idEnvKindCompoundUniqueInput').implement({
  fields: noticeProject_idEnvKindCompoundUniqueInputFields,
});

export const noticeCountOrderByAggregateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  project_id: t.field({"required":false,"type":SortOrder}),
  env: t.field({"required":false,"type":SortOrder}),
  kind: t.field({"required":false,"type":SortOrder}),
  seen_count: t.field({"required":false,"type":SortOrder}),
  created_at: t.field({"required":false,"type":SortOrder}),
  updated_at: t.field({"required":false,"type":SortOrder}),
});
export const noticeCountOrderByAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.noticeCountOrderByAggregateInput>>('noticeCountOrderByAggregateInput').implement({
  fields: noticeCountOrderByAggregateInputFields,
});

export const noticeAvgOrderByAggregateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  project_id: t.field({"required":false,"type":SortOrder}),
  seen_count: t.field({"required":false,"type":SortOrder}),
});
export const noticeAvgOrderByAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.noticeAvgOrderByAggregateInput>>('noticeAvgOrderByAggregateInput').implement({
  fields: noticeAvgOrderByAggregateInputFields,
});

export const noticeMaxOrderByAggregateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  project_id: t.field({"required":false,"type":SortOrder}),
  env: t.field({"required":false,"type":SortOrder}),
  kind: t.field({"required":false,"type":SortOrder}),
  seen_count: t.field({"required":false,"type":SortOrder}),
  created_at: t.field({"required":false,"type":SortOrder}),
  updated_at: t.field({"required":false,"type":SortOrder}),
});
export const noticeMaxOrderByAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.noticeMaxOrderByAggregateInput>>('noticeMaxOrderByAggregateInput').implement({
  fields: noticeMaxOrderByAggregateInputFields,
});

export const noticeMinOrderByAggregateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  project_id: t.field({"required":false,"type":SortOrder}),
  env: t.field({"required":false,"type":SortOrder}),
  kind: t.field({"required":false,"type":SortOrder}),
  seen_count: t.field({"required":false,"type":SortOrder}),
  created_at: t.field({"required":false,"type":SortOrder}),
  updated_at: t.field({"required":false,"type":SortOrder}),
});
export const noticeMinOrderByAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.noticeMinOrderByAggregateInput>>('noticeMinOrderByAggregateInput').implement({
  fields: noticeMinOrderByAggregateInputFields,
});

export const noticeSumOrderByAggregateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  project_id: t.field({"required":false,"type":SortOrder}),
  seen_count: t.field({"required":false,"type":SortOrder}),
});
export const noticeSumOrderByAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.noticeSumOrderByAggregateInput>>('noticeSumOrderByAggregateInput').implement({
  fields: noticeSumOrderByAggregateInputFields,
});

export const JsonFilterFields = (t: any) => ({
  equals: t.field({"required":false,"type":Json}),
  path: t.stringList({"required":false}),
  string_contains: t.string({"required":false}),
  string_starts_with: t.string({"required":false}),
  string_ends_with: t.string({"required":false}),
  array_contains: t.field({"required":false,"type":Json}),
  array_starts_with: t.field({"required":false,"type":Json}),
  array_ends_with: t.field({"required":false,"type":Json}),
  lt: t.field({"required":false,"type":Json}),
  lte: t.field({"required":false,"type":Json}),
  gt: t.field({"required":false,"type":Json}),
  gte: t.field({"required":false,"type":Json}),
  not: t.field({"required":false,"type":Json}),
});
export const JsonFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.JsonFilter>>('JsonFilter').implement({
  fields: JsonFilterFields,
});

export const NoticeRelationFilterFields = (t: any) => ({
  is: t.field({"required":false,"type":noticeWhereInput}),
  isNot: t.field({"required":false,"type":noticeWhereInput}),
});
export const NoticeRelationFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NoticeRelationFilter>>('NoticeRelationFilter').implement({
  fields: NoticeRelationFilterFields,
});

export const Hourly_occurrenceListRelationFilterFields = (t: any) => ({
  every: t.field({"required":false,"type":hourly_occurrenceWhereInput}),
  some: t.field({"required":false,"type":hourly_occurrenceWhereInput}),
  none: t.field({"required":false,"type":hourly_occurrenceWhereInput}),
});
export const Hourly_occurrenceListRelationFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.Hourly_occurrenceListRelationFilter>>('Hourly_occurrenceListRelationFilter').implement({
  fields: Hourly_occurrenceListRelationFilterFields,
});

export const hourly_occurrenceOrderByRelationAggregateInputFields = (t: any) => ({
  _count: t.field({"required":false,"type":SortOrder}),
});
export const hourly_occurrenceOrderByRelationAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.hourly_occurrenceOrderByRelationAggregateInput>>('hourly_occurrenceOrderByRelationAggregateInput').implement({
  fields: hourly_occurrenceOrderByRelationAggregateInputFields,
});

export const occurrenceNotice_idMessageCompoundUniqueInputFields = (t: any) => ({
  notice_id: t.field({"required":true,"type":Bigint}),
  message: t.string({"required":true}),
});
export const occurrenceNotice_idMessageCompoundUniqueInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.occurrenceNotice_idMessageCompoundUniqueInput>>('occurrenceNotice_idMessageCompoundUniqueInput').implement({
  fields: occurrenceNotice_idMessageCompoundUniqueInputFields,
});

export const occurrenceCountOrderByAggregateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  notice_id: t.field({"required":false,"type":SortOrder}),
  message: t.field({"required":false,"type":SortOrder}),
  seen_count: t.field({"required":false,"type":SortOrder}),
  backtrace: t.field({"required":false,"type":SortOrder}),
  context: t.field({"required":false,"type":SortOrder}),
  environment: t.field({"required":false,"type":SortOrder}),
  session: t.field({"required":false,"type":SortOrder}),
  params: t.field({"required":false,"type":SortOrder}),
  created_at: t.field({"required":false,"type":SortOrder}),
  updated_at: t.field({"required":false,"type":SortOrder}),
});
export const occurrenceCountOrderByAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.occurrenceCountOrderByAggregateInput>>('occurrenceCountOrderByAggregateInput').implement({
  fields: occurrenceCountOrderByAggregateInputFields,
});

export const occurrenceAvgOrderByAggregateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  notice_id: t.field({"required":false,"type":SortOrder}),
  seen_count: t.field({"required":false,"type":SortOrder}),
});
export const occurrenceAvgOrderByAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.occurrenceAvgOrderByAggregateInput>>('occurrenceAvgOrderByAggregateInput').implement({
  fields: occurrenceAvgOrderByAggregateInputFields,
});

export const occurrenceMaxOrderByAggregateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  notice_id: t.field({"required":false,"type":SortOrder}),
  message: t.field({"required":false,"type":SortOrder}),
  seen_count: t.field({"required":false,"type":SortOrder}),
  created_at: t.field({"required":false,"type":SortOrder}),
  updated_at: t.field({"required":false,"type":SortOrder}),
});
export const occurrenceMaxOrderByAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.occurrenceMaxOrderByAggregateInput>>('occurrenceMaxOrderByAggregateInput').implement({
  fields: occurrenceMaxOrderByAggregateInputFields,
});

export const occurrenceMinOrderByAggregateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  notice_id: t.field({"required":false,"type":SortOrder}),
  message: t.field({"required":false,"type":SortOrder}),
  seen_count: t.field({"required":false,"type":SortOrder}),
  created_at: t.field({"required":false,"type":SortOrder}),
  updated_at: t.field({"required":false,"type":SortOrder}),
});
export const occurrenceMinOrderByAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.occurrenceMinOrderByAggregateInput>>('occurrenceMinOrderByAggregateInput').implement({
  fields: occurrenceMinOrderByAggregateInputFields,
});

export const occurrenceSumOrderByAggregateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  notice_id: t.field({"required":false,"type":SortOrder}),
  seen_count: t.field({"required":false,"type":SortOrder}),
});
export const occurrenceSumOrderByAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.occurrenceSumOrderByAggregateInput>>('occurrenceSumOrderByAggregateInput').implement({
  fields: occurrenceSumOrderByAggregateInputFields,
});

export const JsonWithAggregatesFilterFields = (t: any) => ({
  equals: t.field({"required":false,"type":Json}),
  path: t.stringList({"required":false}),
  string_contains: t.string({"required":false}),
  string_starts_with: t.string({"required":false}),
  string_ends_with: t.string({"required":false}),
  array_contains: t.field({"required":false,"type":Json}),
  array_starts_with: t.field({"required":false,"type":Json}),
  array_ends_with: t.field({"required":false,"type":Json}),
  lt: t.field({"required":false,"type":Json}),
  lte: t.field({"required":false,"type":Json}),
  gt: t.field({"required":false,"type":Json}),
  gte: t.field({"required":false,"type":Json}),
  not: t.field({"required":false,"type":Json}),
  _count: t.field({"required":false,"type":NestedIntFilter}),
  _min: t.field({"required":false,"type":NestedJsonFilter}),
  _max: t.field({"required":false,"type":NestedJsonFilter}),
});
export const JsonWithAggregatesFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.JsonWithAggregatesFilter>>('JsonWithAggregatesFilter').implement({
  fields: JsonWithAggregatesFilterFields,
});

export const OccurrenceRelationFilterFields = (t: any) => ({
  is: t.field({"required":false,"type":occurrenceWhereInput}),
  isNot: t.field({"required":false,"type":occurrenceWhereInput}),
});
export const OccurrenceRelationFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.OccurrenceRelationFilter>>('OccurrenceRelationFilter').implement({
  fields: OccurrenceRelationFilterFields,
});

export const hourly_occurrenceCountOrderByAggregateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  occurrence_id: t.field({"required":false,"type":SortOrder}),
  interval_start: t.field({"required":false,"type":SortOrder}),
  interval_end: t.field({"required":false,"type":SortOrder}),
  count: t.field({"required":false,"type":SortOrder}),
});
export const hourly_occurrenceCountOrderByAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.hourly_occurrenceCountOrderByAggregateInput>>('hourly_occurrenceCountOrderByAggregateInput').implement({
  fields: hourly_occurrenceCountOrderByAggregateInputFields,
});

export const hourly_occurrenceAvgOrderByAggregateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  occurrence_id: t.field({"required":false,"type":SortOrder}),
  count: t.field({"required":false,"type":SortOrder}),
});
export const hourly_occurrenceAvgOrderByAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.hourly_occurrenceAvgOrderByAggregateInput>>('hourly_occurrenceAvgOrderByAggregateInput').implement({
  fields: hourly_occurrenceAvgOrderByAggregateInputFields,
});

export const hourly_occurrenceMaxOrderByAggregateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  occurrence_id: t.field({"required":false,"type":SortOrder}),
  interval_start: t.field({"required":false,"type":SortOrder}),
  interval_end: t.field({"required":false,"type":SortOrder}),
  count: t.field({"required":false,"type":SortOrder}),
});
export const hourly_occurrenceMaxOrderByAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.hourly_occurrenceMaxOrderByAggregateInput>>('hourly_occurrenceMaxOrderByAggregateInput').implement({
  fields: hourly_occurrenceMaxOrderByAggregateInputFields,
});

export const hourly_occurrenceMinOrderByAggregateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  occurrence_id: t.field({"required":false,"type":SortOrder}),
  interval_start: t.field({"required":false,"type":SortOrder}),
  interval_end: t.field({"required":false,"type":SortOrder}),
  count: t.field({"required":false,"type":SortOrder}),
});
export const hourly_occurrenceMinOrderByAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.hourly_occurrenceMinOrderByAggregateInput>>('hourly_occurrenceMinOrderByAggregateInput').implement({
  fields: hourly_occurrenceMinOrderByAggregateInputFields,
});

export const hourly_occurrenceSumOrderByAggregateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  occurrence_id: t.field({"required":false,"type":SortOrder}),
  count: t.field({"required":false,"type":SortOrder}),
});
export const hourly_occurrenceSumOrderByAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.hourly_occurrenceSumOrderByAggregateInput>>('hourly_occurrenceSumOrderByAggregateInput').implement({
  fields: hourly_occurrenceSumOrderByAggregateInputFields,
});

export const noticeCreateNestedManyWithoutProjectInputFields = (t: any) => ({
  create: t.field({"required":false,"type":[noticeCreateWithoutProjectInput]}),
  connectOrCreate: t.field({"required":false,"type":[noticeCreateOrConnectWithoutProjectInput]}),
  createMany: t.field({"required":false,"type":noticeCreateManyProjectInputEnvelope}),
  connect: t.field({"required":false,"type":[noticeWhereUniqueInput]}),
});
export const noticeCreateNestedManyWithoutProjectInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.noticeCreateNestedManyWithoutProjectInput>>('noticeCreateNestedManyWithoutProjectInput').implement({
  fields: noticeCreateNestedManyWithoutProjectInputFields,
});

export const BigIntFieldUpdateOperationsInputFields = (t: any) => ({
  set: t.field({"required":false,"type":Bigint}),
  increment: t.field({"required":false,"type":Bigint}),
  decrement: t.field({"required":false,"type":Bigint}),
  multiply: t.field({"required":false,"type":Bigint}),
  divide: t.field({"required":false,"type":Bigint}),
});
export const BigIntFieldUpdateOperationsInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.BigIntFieldUpdateOperationsInput>>('BigIntFieldUpdateOperationsInput').implement({
  fields: BigIntFieldUpdateOperationsInputFields,
});

export const StringFieldUpdateOperationsInputFields = (t: any) => ({
  set: t.string({"required":false}),
});
export const StringFieldUpdateOperationsInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.StringFieldUpdateOperationsInput>>('StringFieldUpdateOperationsInput').implement({
  fields: StringFieldUpdateOperationsInputFields,
});

export const NullableStringFieldUpdateOperationsInputFields = (t: any) => ({
  set: t.string({"required":false}),
});
export const NullableStringFieldUpdateOperationsInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NullableStringFieldUpdateOperationsInput>>('NullableStringFieldUpdateOperationsInput').implement({
  fields: NullableStringFieldUpdateOperationsInputFields,
});

export const DateTimeFieldUpdateOperationsInputFields = (t: any) => ({
  set: t.field({"required":false,"type":DateTime}),
});
export const DateTimeFieldUpdateOperationsInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.DateTimeFieldUpdateOperationsInput>>('DateTimeFieldUpdateOperationsInput').implement({
  fields: DateTimeFieldUpdateOperationsInputFields,
});

export const noticeUpdateManyWithoutProjectNestedInputFields = (t: any) => ({
  create: t.field({"required":false,"type":[noticeCreateWithoutProjectInput]}),
  connectOrCreate: t.field({"required":false,"type":[noticeCreateOrConnectWithoutProjectInput]}),
  upsert: t.field({"required":false,"type":[noticeUpsertWithWhereUniqueWithoutProjectInput]}),
  createMany: t.field({"required":false,"type":noticeCreateManyProjectInputEnvelope}),
  set: t.field({"required":false,"type":[noticeWhereUniqueInput]}),
  disconnect: t.field({"required":false,"type":[noticeWhereUniqueInput]}),
  delete: t.field({"required":false,"type":[noticeWhereUniqueInput]}),
  connect: t.field({"required":false,"type":[noticeWhereUniqueInput]}),
  update: t.field({"required":false,"type":[noticeUpdateWithWhereUniqueWithoutProjectInput]}),
  updateMany: t.field({"required":false,"type":[noticeUpdateManyWithWhereWithoutProjectInput]}),
  deleteMany: t.field({"required":false,"type":[noticeScalarWhereInput]}),
});
export const noticeUpdateManyWithoutProjectNestedInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.noticeUpdateManyWithoutProjectNestedInput>>('noticeUpdateManyWithoutProjectNestedInput').implement({
  fields: noticeUpdateManyWithoutProjectNestedInputFields,
});

export const projectCreateNestedOneWithoutNoticesInputFields = (t: any) => ({
  create: t.field({"required":false,"type":projectCreateWithoutNoticesInput}),
  connectOrCreate: t.field({"required":false,"type":projectCreateOrConnectWithoutNoticesInput}),
  connect: t.field({"required":false,"type":projectWhereUniqueInput}),
});
export const projectCreateNestedOneWithoutNoticesInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.projectCreateNestedOneWithoutNoticesInput>>('projectCreateNestedOneWithoutNoticesInput').implement({
  fields: projectCreateNestedOneWithoutNoticesInputFields,
});

export const occurrenceCreateNestedManyWithoutNoticeInputFields = (t: any) => ({
  create: t.field({"required":false,"type":[occurrenceCreateWithoutNoticeInput]}),
  connectOrCreate: t.field({"required":false,"type":[occurrenceCreateOrConnectWithoutNoticeInput]}),
  createMany: t.field({"required":false,"type":occurrenceCreateManyNoticeInputEnvelope}),
  connect: t.field({"required":false,"type":[occurrenceWhereUniqueInput]}),
});
export const occurrenceCreateNestedManyWithoutNoticeInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.occurrenceCreateNestedManyWithoutNoticeInput>>('occurrenceCreateNestedManyWithoutNoticeInput').implement({
  fields: occurrenceCreateNestedManyWithoutNoticeInputFields,
});

export const projectUpdateOneRequiredWithoutNoticesNestedInputFields = (t: any) => ({
  create: t.field({"required":false,"type":projectCreateWithoutNoticesInput}),
  connectOrCreate: t.field({"required":false,"type":projectCreateOrConnectWithoutNoticesInput}),
  upsert: t.field({"required":false,"type":projectUpsertWithoutNoticesInput}),
  connect: t.field({"required":false,"type":projectWhereUniqueInput}),
  update: t.field({"required":false,"type":projectUpdateWithoutNoticesInput}),
});
export const projectUpdateOneRequiredWithoutNoticesNestedInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.projectUpdateOneRequiredWithoutNoticesNestedInput>>('projectUpdateOneRequiredWithoutNoticesNestedInput').implement({
  fields: projectUpdateOneRequiredWithoutNoticesNestedInputFields,
});

export const occurrenceUpdateManyWithoutNoticeNestedInputFields = (t: any) => ({
  create: t.field({"required":false,"type":[occurrenceCreateWithoutNoticeInput]}),
  connectOrCreate: t.field({"required":false,"type":[occurrenceCreateOrConnectWithoutNoticeInput]}),
  upsert: t.field({"required":false,"type":[occurrenceUpsertWithWhereUniqueWithoutNoticeInput]}),
  createMany: t.field({"required":false,"type":occurrenceCreateManyNoticeInputEnvelope}),
  set: t.field({"required":false,"type":[occurrenceWhereUniqueInput]}),
  disconnect: t.field({"required":false,"type":[occurrenceWhereUniqueInput]}),
  delete: t.field({"required":false,"type":[occurrenceWhereUniqueInput]}),
  connect: t.field({"required":false,"type":[occurrenceWhereUniqueInput]}),
  update: t.field({"required":false,"type":[occurrenceUpdateWithWhereUniqueWithoutNoticeInput]}),
  updateMany: t.field({"required":false,"type":[occurrenceUpdateManyWithWhereWithoutNoticeInput]}),
  deleteMany: t.field({"required":false,"type":[occurrenceScalarWhereInput]}),
});
export const occurrenceUpdateManyWithoutNoticeNestedInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.occurrenceUpdateManyWithoutNoticeNestedInput>>('occurrenceUpdateManyWithoutNoticeNestedInput').implement({
  fields: occurrenceUpdateManyWithoutNoticeNestedInputFields,
});

export const noticeCreateNestedOneWithoutOccurrencesInputFields = (t: any) => ({
  create: t.field({"required":false,"type":noticeCreateWithoutOccurrencesInput}),
  connectOrCreate: t.field({"required":false,"type":noticeCreateOrConnectWithoutOccurrencesInput}),
  connect: t.field({"required":false,"type":noticeWhereUniqueInput}),
});
export const noticeCreateNestedOneWithoutOccurrencesInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.noticeCreateNestedOneWithoutOccurrencesInput>>('noticeCreateNestedOneWithoutOccurrencesInput').implement({
  fields: noticeCreateNestedOneWithoutOccurrencesInputFields,
});

export const hourly_occurrenceCreateNestedManyWithoutOccurrenceInputFields = (t: any) => ({
  create: t.field({"required":false,"type":[hourly_occurrenceCreateWithoutOccurrenceInput]}),
  connectOrCreate: t.field({"required":false,"type":[hourly_occurrenceCreateOrConnectWithoutOccurrenceInput]}),
  createMany: t.field({"required":false,"type":hourly_occurrenceCreateManyOccurrenceInputEnvelope}),
  connect: t.field({"required":false,"type":[hourly_occurrenceWhereUniqueInput]}),
});
export const hourly_occurrenceCreateNestedManyWithoutOccurrenceInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.hourly_occurrenceCreateNestedManyWithoutOccurrenceInput>>('hourly_occurrenceCreateNestedManyWithoutOccurrenceInput').implement({
  fields: hourly_occurrenceCreateNestedManyWithoutOccurrenceInputFields,
});

export const noticeUpdateOneRequiredWithoutOccurrencesNestedInputFields = (t: any) => ({
  create: t.field({"required":false,"type":noticeCreateWithoutOccurrencesInput}),
  connectOrCreate: t.field({"required":false,"type":noticeCreateOrConnectWithoutOccurrencesInput}),
  upsert: t.field({"required":false,"type":noticeUpsertWithoutOccurrencesInput}),
  connect: t.field({"required":false,"type":noticeWhereUniqueInput}),
  update: t.field({"required":false,"type":noticeUpdateWithoutOccurrencesInput}),
});
export const noticeUpdateOneRequiredWithoutOccurrencesNestedInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.noticeUpdateOneRequiredWithoutOccurrencesNestedInput>>('noticeUpdateOneRequiredWithoutOccurrencesNestedInput').implement({
  fields: noticeUpdateOneRequiredWithoutOccurrencesNestedInputFields,
});

export const hourly_occurrenceUpdateManyWithoutOccurrenceNestedInputFields = (t: any) => ({
  create: t.field({"required":false,"type":[hourly_occurrenceCreateWithoutOccurrenceInput]}),
  connectOrCreate: t.field({"required":false,"type":[hourly_occurrenceCreateOrConnectWithoutOccurrenceInput]}),
  upsert: t.field({"required":false,"type":[hourly_occurrenceUpsertWithWhereUniqueWithoutOccurrenceInput]}),
  createMany: t.field({"required":false,"type":hourly_occurrenceCreateManyOccurrenceInputEnvelope}),
  set: t.field({"required":false,"type":[hourly_occurrenceWhereUniqueInput]}),
  disconnect: t.field({"required":false,"type":[hourly_occurrenceWhereUniqueInput]}),
  delete: t.field({"required":false,"type":[hourly_occurrenceWhereUniqueInput]}),
  connect: t.field({"required":false,"type":[hourly_occurrenceWhereUniqueInput]}),
  update: t.field({"required":false,"type":[hourly_occurrenceUpdateWithWhereUniqueWithoutOccurrenceInput]}),
  updateMany: t.field({"required":false,"type":[hourly_occurrenceUpdateManyWithWhereWithoutOccurrenceInput]}),
  deleteMany: t.field({"required":false,"type":[hourly_occurrenceScalarWhereInput]}),
});
export const hourly_occurrenceUpdateManyWithoutOccurrenceNestedInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.hourly_occurrenceUpdateManyWithoutOccurrenceNestedInput>>('hourly_occurrenceUpdateManyWithoutOccurrenceNestedInput').implement({
  fields: hourly_occurrenceUpdateManyWithoutOccurrenceNestedInputFields,
});

export const occurrenceCreateNestedOneWithoutHourly_occurrencesInputFields = (t: any) => ({
  create: t.field({"required":false,"type":occurrenceCreateWithoutHourly_occurrencesInput}),
  connectOrCreate: t.field({"required":false,"type":occurrenceCreateOrConnectWithoutHourly_occurrencesInput}),
  connect: t.field({"required":false,"type":occurrenceWhereUniqueInput}),
});
export const occurrenceCreateNestedOneWithoutHourly_occurrencesInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.occurrenceCreateNestedOneWithoutHourly_occurrencesInput>>('occurrenceCreateNestedOneWithoutHourly_occurrencesInput').implement({
  fields: occurrenceCreateNestedOneWithoutHourly_occurrencesInputFields,
});

export const occurrenceUpdateOneRequiredWithoutHourly_occurrencesNestedInputFields = (t: any) => ({
  create: t.field({"required":false,"type":occurrenceCreateWithoutHourly_occurrencesInput}),
  connectOrCreate: t.field({"required":false,"type":occurrenceCreateOrConnectWithoutHourly_occurrencesInput}),
  upsert: t.field({"required":false,"type":occurrenceUpsertWithoutHourly_occurrencesInput}),
  connect: t.field({"required":false,"type":occurrenceWhereUniqueInput}),
  update: t.field({"required":false,"type":occurrenceUpdateWithoutHourly_occurrencesInput}),
});
export const occurrenceUpdateOneRequiredWithoutHourly_occurrencesNestedInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.occurrenceUpdateOneRequiredWithoutHourly_occurrencesNestedInput>>('occurrenceUpdateOneRequiredWithoutHourly_occurrencesNestedInput').implement({
  fields: occurrenceUpdateOneRequiredWithoutHourly_occurrencesNestedInputFields,
});

export const NestedBigIntFilterFields = (t: any) => ({
  equals: t.field({"required":false,"type":Bigint}),
  in: t.field({"required":false,"type":[Bigint]}),
  notIn: t.field({"required":false,"type":[Bigint]}),
  lt: t.field({"required":false,"type":Bigint}),
  lte: t.field({"required":false,"type":Bigint}),
  gt: t.field({"required":false,"type":Bigint}),
  gte: t.field({"required":false,"type":Bigint}),
  not: t.field({"required":false,"type":NestedBigIntFilter}),
});
export const NestedBigIntFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NestedBigIntFilter>>('NestedBigIntFilter').implement({
  fields: NestedBigIntFilterFields,
});

export const NestedStringFilterFields = (t: any) => ({
  equals: t.string({"required":false}),
  in: t.stringList({"required":false}),
  notIn: t.stringList({"required":false}),
  lt: t.string({"required":false}),
  lte: t.string({"required":false}),
  gt: t.string({"required":false}),
  gte: t.string({"required":false}),
  contains: t.string({"required":false}),
  startsWith: t.string({"required":false}),
  endsWith: t.string({"required":false}),
  not: t.field({"required":false,"type":NestedStringFilter}),
});
export const NestedStringFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NestedStringFilter>>('NestedStringFilter').implement({
  fields: NestedStringFilterFields,
});

export const NestedStringNullableFilterFields = (t: any) => ({
  equals: t.string({"required":false}),
  in: t.stringList({"required":false}),
  notIn: t.stringList({"required":false}),
  lt: t.string({"required":false}),
  lte: t.string({"required":false}),
  gt: t.string({"required":false}),
  gte: t.string({"required":false}),
  contains: t.string({"required":false}),
  startsWith: t.string({"required":false}),
  endsWith: t.string({"required":false}),
  not: t.field({"required":false,"type":NestedStringNullableFilter}),
});
export const NestedStringNullableFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NestedStringNullableFilter>>('NestedStringNullableFilter').implement({
  fields: NestedStringNullableFilterFields,
});

export const NestedDateTimeFilterFields = (t: any) => ({
  equals: t.field({"required":false,"type":DateTime}),
  in: t.field({"required":false,"type":[DateTime]}),
  notIn: t.field({"required":false,"type":[DateTime]}),
  lt: t.field({"required":false,"type":DateTime}),
  lte: t.field({"required":false,"type":DateTime}),
  gt: t.field({"required":false,"type":DateTime}),
  gte: t.field({"required":false,"type":DateTime}),
  not: t.field({"required":false,"type":NestedDateTimeFilter}),
});
export const NestedDateTimeFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NestedDateTimeFilter>>('NestedDateTimeFilter').implement({
  fields: NestedDateTimeFilterFields,
});

export const NestedBigIntWithAggregatesFilterFields = (t: any) => ({
  equals: t.field({"required":false,"type":Bigint}),
  in: t.field({"required":false,"type":[Bigint]}),
  notIn: t.field({"required":false,"type":[Bigint]}),
  lt: t.field({"required":false,"type":Bigint}),
  lte: t.field({"required":false,"type":Bigint}),
  gt: t.field({"required":false,"type":Bigint}),
  gte: t.field({"required":false,"type":Bigint}),
  not: t.field({"required":false,"type":NestedBigIntWithAggregatesFilter}),
  _count: t.field({"required":false,"type":NestedIntFilter}),
  _avg: t.field({"required":false,"type":NestedFloatFilter}),
  _sum: t.field({"required":false,"type":NestedBigIntFilter}),
  _min: t.field({"required":false,"type":NestedBigIntFilter}),
  _max: t.field({"required":false,"type":NestedBigIntFilter}),
});
export const NestedBigIntWithAggregatesFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NestedBigIntWithAggregatesFilter>>('NestedBigIntWithAggregatesFilter').implement({
  fields: NestedBigIntWithAggregatesFilterFields,
});

export const NestedIntFilterFields = (t: any) => ({
  equals: t.int({"required":false}),
  in: t.intList({"required":false}),
  notIn: t.intList({"required":false}),
  lt: t.int({"required":false}),
  lte: t.int({"required":false}),
  gt: t.int({"required":false}),
  gte: t.int({"required":false}),
  not: t.field({"required":false,"type":NestedIntFilter}),
});
export const NestedIntFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NestedIntFilter>>('NestedIntFilter').implement({
  fields: NestedIntFilterFields,
});

export const NestedFloatFilterFields = (t: any) => ({
  equals: t.float({"required":false}),
  in: t.floatList({"required":false}),
  notIn: t.floatList({"required":false}),
  lt: t.float({"required":false}),
  lte: t.float({"required":false}),
  gt: t.float({"required":false}),
  gte: t.float({"required":false}),
  not: t.field({"required":false,"type":NestedFloatFilter}),
});
export const NestedFloatFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NestedFloatFilter>>('NestedFloatFilter').implement({
  fields: NestedFloatFilterFields,
});

export const NestedStringWithAggregatesFilterFields = (t: any) => ({
  equals: t.string({"required":false}),
  in: t.stringList({"required":false}),
  notIn: t.stringList({"required":false}),
  lt: t.string({"required":false}),
  lte: t.string({"required":false}),
  gt: t.string({"required":false}),
  gte: t.string({"required":false}),
  contains: t.string({"required":false}),
  startsWith: t.string({"required":false}),
  endsWith: t.string({"required":false}),
  not: t.field({"required":false,"type":NestedStringWithAggregatesFilter}),
  _count: t.field({"required":false,"type":NestedIntFilter}),
  _min: t.field({"required":false,"type":NestedStringFilter}),
  _max: t.field({"required":false,"type":NestedStringFilter}),
});
export const NestedStringWithAggregatesFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NestedStringWithAggregatesFilter>>('NestedStringWithAggregatesFilter').implement({
  fields: NestedStringWithAggregatesFilterFields,
});

export const NestedStringNullableWithAggregatesFilterFields = (t: any) => ({
  equals: t.string({"required":false}),
  in: t.stringList({"required":false}),
  notIn: t.stringList({"required":false}),
  lt: t.string({"required":false}),
  lte: t.string({"required":false}),
  gt: t.string({"required":false}),
  gte: t.string({"required":false}),
  contains: t.string({"required":false}),
  startsWith: t.string({"required":false}),
  endsWith: t.string({"required":false}),
  not: t.field({"required":false,"type":NestedStringNullableWithAggregatesFilter}),
  _count: t.field({"required":false,"type":NestedIntNullableFilter}),
  _min: t.field({"required":false,"type":NestedStringNullableFilter}),
  _max: t.field({"required":false,"type":NestedStringNullableFilter}),
});
export const NestedStringNullableWithAggregatesFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NestedStringNullableWithAggregatesFilter>>('NestedStringNullableWithAggregatesFilter').implement({
  fields: NestedStringNullableWithAggregatesFilterFields,
});

export const NestedIntNullableFilterFields = (t: any) => ({
  equals: t.int({"required":false}),
  in: t.intList({"required":false}),
  notIn: t.intList({"required":false}),
  lt: t.int({"required":false}),
  lte: t.int({"required":false}),
  gt: t.int({"required":false}),
  gte: t.int({"required":false}),
  not: t.field({"required":false,"type":NestedIntNullableFilter}),
});
export const NestedIntNullableFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NestedIntNullableFilter>>('NestedIntNullableFilter').implement({
  fields: NestedIntNullableFilterFields,
});

export const NestedDateTimeWithAggregatesFilterFields = (t: any) => ({
  equals: t.field({"required":false,"type":DateTime}),
  in: t.field({"required":false,"type":[DateTime]}),
  notIn: t.field({"required":false,"type":[DateTime]}),
  lt: t.field({"required":false,"type":DateTime}),
  lte: t.field({"required":false,"type":DateTime}),
  gt: t.field({"required":false,"type":DateTime}),
  gte: t.field({"required":false,"type":DateTime}),
  not: t.field({"required":false,"type":NestedDateTimeWithAggregatesFilter}),
  _count: t.field({"required":false,"type":NestedIntFilter}),
  _min: t.field({"required":false,"type":NestedDateTimeFilter}),
  _max: t.field({"required":false,"type":NestedDateTimeFilter}),
});
export const NestedDateTimeWithAggregatesFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NestedDateTimeWithAggregatesFilter>>('NestedDateTimeWithAggregatesFilter').implement({
  fields: NestedDateTimeWithAggregatesFilterFields,
});

export const NestedJsonFilterFields = (t: any) => ({
  equals: t.field({"required":false,"type":Json}),
  path: t.stringList({"required":false}),
  string_contains: t.string({"required":false}),
  string_starts_with: t.string({"required":false}),
  string_ends_with: t.string({"required":false}),
  array_contains: t.field({"required":false,"type":Json}),
  array_starts_with: t.field({"required":false,"type":Json}),
  array_ends_with: t.field({"required":false,"type":Json}),
  lt: t.field({"required":false,"type":Json}),
  lte: t.field({"required":false,"type":Json}),
  gt: t.field({"required":false,"type":Json}),
  gte: t.field({"required":false,"type":Json}),
  not: t.field({"required":false,"type":Json}),
});
export const NestedJsonFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NestedJsonFilter>>('NestedJsonFilter').implement({
  fields: NestedJsonFilterFields,
});

export const noticeCreateWithoutProjectInputFields = (t: any) => ({
  env: t.string({"required":false}),
  kind: t.string({"required":false}),
  occurrences: t.field({"required":false,"type":occurrenceCreateNestedManyWithoutNoticeInput}),
  // 'id' was omitted due to @Pothos.omit found in schema comment
  // 'seen_count' was omitted due to @Pothos.omit found in schema comment
  // 'created_at' was omitted due to @Pothos.omit found in schema comment
  // 'updated_at' was omitted due to @Pothos.omit found in schema comment
});
export const noticeCreateWithoutProjectInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.noticeCreateWithoutProjectInput>>('noticeCreateWithoutProjectInput').implement({
  fields: noticeCreateWithoutProjectInputFields,
});

export const noticeCreateOrConnectWithoutProjectInputFields = (t: any) => ({
  where: t.field({"required":true,"type":noticeWhereUniqueInput}),
  create: t.field({"required":true,"type":noticeCreateWithoutProjectInput}),
});
export const noticeCreateOrConnectWithoutProjectInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.noticeCreateOrConnectWithoutProjectInput>>('noticeCreateOrConnectWithoutProjectInput').implement({
  fields: noticeCreateOrConnectWithoutProjectInputFields,
});

export const noticeCreateManyProjectInputEnvelopeFields = (t: any) => ({
  data: t.field({"required":true,"type":[noticeCreateManyProjectInput]}),
  skipDuplicates: t.boolean({"required":false}),
});
export const noticeCreateManyProjectInputEnvelope = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.noticeCreateManyProjectInputEnvelope>>('noticeCreateManyProjectInputEnvelope').implement({
  fields: noticeCreateManyProjectInputEnvelopeFields,
});

export const noticeUpsertWithWhereUniqueWithoutProjectInputFields = (t: any) => ({
  where: t.field({"required":true,"type":noticeWhereUniqueInput}),
  update: t.field({"required":true,"type":noticeUpdateWithoutProjectInput}),
  create: t.field({"required":true,"type":noticeCreateWithoutProjectInput}),
});
export const noticeUpsertWithWhereUniqueWithoutProjectInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.noticeUpsertWithWhereUniqueWithoutProjectInput>>('noticeUpsertWithWhereUniqueWithoutProjectInput').implement({
  fields: noticeUpsertWithWhereUniqueWithoutProjectInputFields,
});

export const noticeUpdateWithWhereUniqueWithoutProjectInputFields = (t: any) => ({
  where: t.field({"required":true,"type":noticeWhereUniqueInput}),
  data: t.field({"required":true,"type":noticeUpdateWithoutProjectInput}),
});
export const noticeUpdateWithWhereUniqueWithoutProjectInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.noticeUpdateWithWhereUniqueWithoutProjectInput>>('noticeUpdateWithWhereUniqueWithoutProjectInput').implement({
  fields: noticeUpdateWithWhereUniqueWithoutProjectInputFields,
});

export const noticeUpdateManyWithWhereWithoutProjectInputFields = (t: any) => ({
  where: t.field({"required":true,"type":noticeScalarWhereInput}),
  data: t.field({"required":true,"type":noticeUpdateManyMutationInput}),
});
export const noticeUpdateManyWithWhereWithoutProjectInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.noticeUpdateManyWithWhereWithoutProjectInput>>('noticeUpdateManyWithWhereWithoutProjectInput').implement({
  fields: noticeUpdateManyWithWhereWithoutProjectInputFields,
});

export const noticeScalarWhereInputFields = (t: any) => ({
  AND: t.field({"required":false,"type":[noticeScalarWhereInput]}),
  OR: t.field({"required":false,"type":[noticeScalarWhereInput]}),
  NOT: t.field({"required":false,"type":[noticeScalarWhereInput]}),
  id: t.field({"required":false,"type":BigIntFilter}),
  project_id: t.field({"required":false,"type":BigIntFilter}),
  env: t.field({"required":false,"type":StringFilter}),
  kind: t.field({"required":false,"type":StringFilter}),
  seen_count: t.field({"required":false,"type":BigIntFilter}),
  created_at: t.field({"required":false,"type":DateTimeFilter}),
  updated_at: t.field({"required":false,"type":DateTimeFilter}),
});
export const noticeScalarWhereInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.noticeScalarWhereInput>>('noticeScalarWhereInput').implement({
  fields: noticeScalarWhereInputFields,
});

export const projectCreateWithoutNoticesInputFields = (t: any) => ({
  name: t.string({"required":true}),
  api_key: t.string({"required":true}),
  organization: t.string({"required":false}),
  repo_provider: t.string({"required":false}),
  repo_provider_api_key: t.string({"required":false}),
  repo_provider_api_secret: t.string({"required":false}),
  repo_branch: t.string({"required":false}),
  repo_issue_tracker: t.string({"required":false}),
  repo_url: t.string({"required":false}),
  // 'id' was omitted due to @Pothos.omit found in schema comment
  // 'notices_count' was omitted due to @Pothos.omit found in schema comment
  // 'created_at' was omitted due to @Pothos.omit found in schema comment
  // 'updated_at' was omitted due to @Pothos.omit found in schema comment
});
export const projectCreateWithoutNoticesInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.projectCreateWithoutNoticesInput>>('projectCreateWithoutNoticesInput').implement({
  fields: projectCreateWithoutNoticesInputFields,
});

export const projectCreateOrConnectWithoutNoticesInputFields = (t: any) => ({
  where: t.field({"required":true,"type":projectWhereUniqueInput}),
  create: t.field({"required":true,"type":projectCreateWithoutNoticesInput}),
});
export const projectCreateOrConnectWithoutNoticesInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.projectCreateOrConnectWithoutNoticesInput>>('projectCreateOrConnectWithoutNoticesInput').implement({
  fields: projectCreateOrConnectWithoutNoticesInputFields,
});

export const occurrenceCreateWithoutNoticeInputFields = (t: any) => ({
  id: t.field({"required":false,"type":Bigint}),
  message: t.string({"required":true}),
  seen_count: t.field({"required":false,"type":Bigint}),
  backtrace: t.field({"required":false,"type":Json}),
  context: t.field({"required":false,"type":Json}),
  environment: t.field({"required":false,"type":Json}),
  session: t.field({"required":false,"type":Json}),
  params: t.field({"required":false,"type":Json}),
  created_at: t.field({"required":false,"type":DateTime}),
  updated_at: t.field({"required":false,"type":DateTime}),
  hourly_occurrences: t.field({"required":false,"type":hourly_occurrenceCreateNestedManyWithoutOccurrenceInput}),
});
export const occurrenceCreateWithoutNoticeInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.occurrenceCreateWithoutNoticeInput>>('occurrenceCreateWithoutNoticeInput').implement({
  fields: occurrenceCreateWithoutNoticeInputFields,
});

export const occurrenceCreateOrConnectWithoutNoticeInputFields = (t: any) => ({
  where: t.field({"required":true,"type":occurrenceWhereUniqueInput}),
  create: t.field({"required":true,"type":occurrenceCreateWithoutNoticeInput}),
});
export const occurrenceCreateOrConnectWithoutNoticeInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.occurrenceCreateOrConnectWithoutNoticeInput>>('occurrenceCreateOrConnectWithoutNoticeInput').implement({
  fields: occurrenceCreateOrConnectWithoutNoticeInputFields,
});

export const occurrenceCreateManyNoticeInputEnvelopeFields = (t: any) => ({
  data: t.field({"required":true,"type":[occurrenceCreateManyNoticeInput]}),
  skipDuplicates: t.boolean({"required":false}),
});
export const occurrenceCreateManyNoticeInputEnvelope = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.occurrenceCreateManyNoticeInputEnvelope>>('occurrenceCreateManyNoticeInputEnvelope').implement({
  fields: occurrenceCreateManyNoticeInputEnvelopeFields,
});

export const projectUpsertWithoutNoticesInputFields = (t: any) => ({
  update: t.field({"required":true,"type":projectUpdateWithoutNoticesInput}),
  create: t.field({"required":true,"type":projectCreateWithoutNoticesInput}),
});
export const projectUpsertWithoutNoticesInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.projectUpsertWithoutNoticesInput>>('projectUpsertWithoutNoticesInput').implement({
  fields: projectUpsertWithoutNoticesInputFields,
});

export const projectUpdateWithoutNoticesInputFields = (t: any) => ({
  name: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  api_key: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  organization: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  repo_provider: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  repo_provider_api_key: t.field({"required":false,"type":NullableStringFieldUpdateOperationsInput}),
  repo_provider_api_secret: t.field({"required":false,"type":NullableStringFieldUpdateOperationsInput}),
  repo_branch: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  repo_issue_tracker: t.field({"required":false,"type":NullableStringFieldUpdateOperationsInput}),
  repo_url: t.field({"required":false,"type":NullableStringFieldUpdateOperationsInput}),
  // 'id' was omitted due to @Pothos.omit found in schema comment
  // 'notices_count' was omitted due to @Pothos.omit found in schema comment
  // 'created_at' was omitted due to @Pothos.omit found in schema comment
  // 'updated_at' was omitted due to @Pothos.omit found in schema comment
});
export const projectUpdateWithoutNoticesInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.projectUpdateWithoutNoticesInput>>('projectUpdateWithoutNoticesInput').implement({
  fields: projectUpdateWithoutNoticesInputFields,
});

export const occurrenceUpsertWithWhereUniqueWithoutNoticeInputFields = (t: any) => ({
  where: t.field({"required":true,"type":occurrenceWhereUniqueInput}),
  update: t.field({"required":true,"type":occurrenceUpdateWithoutNoticeInput}),
  create: t.field({"required":true,"type":occurrenceCreateWithoutNoticeInput}),
});
export const occurrenceUpsertWithWhereUniqueWithoutNoticeInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.occurrenceUpsertWithWhereUniqueWithoutNoticeInput>>('occurrenceUpsertWithWhereUniqueWithoutNoticeInput').implement({
  fields: occurrenceUpsertWithWhereUniqueWithoutNoticeInputFields,
});

export const occurrenceUpdateWithWhereUniqueWithoutNoticeInputFields = (t: any) => ({
  where: t.field({"required":true,"type":occurrenceWhereUniqueInput}),
  data: t.field({"required":true,"type":occurrenceUpdateWithoutNoticeInput}),
});
export const occurrenceUpdateWithWhereUniqueWithoutNoticeInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.occurrenceUpdateWithWhereUniqueWithoutNoticeInput>>('occurrenceUpdateWithWhereUniqueWithoutNoticeInput').implement({
  fields: occurrenceUpdateWithWhereUniqueWithoutNoticeInputFields,
});

export const occurrenceUpdateManyWithWhereWithoutNoticeInputFields = (t: any) => ({
  where: t.field({"required":true,"type":occurrenceScalarWhereInput}),
  data: t.field({"required":true,"type":occurrenceUpdateManyMutationInput}),
});
export const occurrenceUpdateManyWithWhereWithoutNoticeInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.occurrenceUpdateManyWithWhereWithoutNoticeInput>>('occurrenceUpdateManyWithWhereWithoutNoticeInput').implement({
  fields: occurrenceUpdateManyWithWhereWithoutNoticeInputFields,
});

export const occurrenceScalarWhereInputFields = (t: any) => ({
  AND: t.field({"required":false,"type":[occurrenceScalarWhereInput]}),
  OR: t.field({"required":false,"type":[occurrenceScalarWhereInput]}),
  NOT: t.field({"required":false,"type":[occurrenceScalarWhereInput]}),
  id: t.field({"required":false,"type":BigIntFilter}),
  notice_id: t.field({"required":false,"type":BigIntFilter}),
  message: t.field({"required":false,"type":StringFilter}),
  seen_count: t.field({"required":false,"type":BigIntFilter}),
  backtrace: t.field({"required":false,"type":JsonFilter}),
  context: t.field({"required":false,"type":JsonFilter}),
  environment: t.field({"required":false,"type":JsonFilter}),
  session: t.field({"required":false,"type":JsonFilter}),
  params: t.field({"required":false,"type":JsonFilter}),
  created_at: t.field({"required":false,"type":DateTimeFilter}),
  updated_at: t.field({"required":false,"type":DateTimeFilter}),
});
export const occurrenceScalarWhereInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.occurrenceScalarWhereInput>>('occurrenceScalarWhereInput').implement({
  fields: occurrenceScalarWhereInputFields,
});

export const noticeCreateWithoutOccurrencesInputFields = (t: any) => ({
  env: t.string({"required":false}),
  kind: t.string({"required":false}),
  project: t.field({"required":true,"type":projectCreateNestedOneWithoutNoticesInput}),
  // 'id' was omitted due to @Pothos.omit found in schema comment
  // 'seen_count' was omitted due to @Pothos.omit found in schema comment
  // 'created_at' was omitted due to @Pothos.omit found in schema comment
  // 'updated_at' was omitted due to @Pothos.omit found in schema comment
});
export const noticeCreateWithoutOccurrencesInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.noticeCreateWithoutOccurrencesInput>>('noticeCreateWithoutOccurrencesInput').implement({
  fields: noticeCreateWithoutOccurrencesInputFields,
});

export const noticeCreateOrConnectWithoutOccurrencesInputFields = (t: any) => ({
  where: t.field({"required":true,"type":noticeWhereUniqueInput}),
  create: t.field({"required":true,"type":noticeCreateWithoutOccurrencesInput}),
});
export const noticeCreateOrConnectWithoutOccurrencesInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.noticeCreateOrConnectWithoutOccurrencesInput>>('noticeCreateOrConnectWithoutOccurrencesInput').implement({
  fields: noticeCreateOrConnectWithoutOccurrencesInputFields,
});

export const hourly_occurrenceCreateWithoutOccurrenceInputFields = (t: any) => ({
  id: t.field({"required":false,"type":Bigint}),
  interval_start: t.field({"required":true,"type":DateTime}),
  interval_end: t.field({"required":true,"type":DateTime}),
  count: t.field({"required":false,"type":Bigint}),
});
export const hourly_occurrenceCreateWithoutOccurrenceInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.hourly_occurrenceCreateWithoutOccurrenceInput>>('hourly_occurrenceCreateWithoutOccurrenceInput').implement({
  fields: hourly_occurrenceCreateWithoutOccurrenceInputFields,
});

export const hourly_occurrenceCreateOrConnectWithoutOccurrenceInputFields = (t: any) => ({
  where: t.field({"required":true,"type":hourly_occurrenceWhereUniqueInput}),
  create: t.field({"required":true,"type":hourly_occurrenceCreateWithoutOccurrenceInput}),
});
export const hourly_occurrenceCreateOrConnectWithoutOccurrenceInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.hourly_occurrenceCreateOrConnectWithoutOccurrenceInput>>('hourly_occurrenceCreateOrConnectWithoutOccurrenceInput').implement({
  fields: hourly_occurrenceCreateOrConnectWithoutOccurrenceInputFields,
});

export const hourly_occurrenceCreateManyOccurrenceInputEnvelopeFields = (t: any) => ({
  data: t.field({"required":true,"type":[hourly_occurrenceCreateManyOccurrenceInput]}),
  skipDuplicates: t.boolean({"required":false}),
});
export const hourly_occurrenceCreateManyOccurrenceInputEnvelope = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.hourly_occurrenceCreateManyOccurrenceInputEnvelope>>('hourly_occurrenceCreateManyOccurrenceInputEnvelope').implement({
  fields: hourly_occurrenceCreateManyOccurrenceInputEnvelopeFields,
});

export const noticeUpsertWithoutOccurrencesInputFields = (t: any) => ({
  update: t.field({"required":true,"type":noticeUpdateWithoutOccurrencesInput}),
  create: t.field({"required":true,"type":noticeCreateWithoutOccurrencesInput}),
});
export const noticeUpsertWithoutOccurrencesInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.noticeUpsertWithoutOccurrencesInput>>('noticeUpsertWithoutOccurrencesInput').implement({
  fields: noticeUpsertWithoutOccurrencesInputFields,
});

export const noticeUpdateWithoutOccurrencesInputFields = (t: any) => ({
  env: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  kind: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  project: t.field({"required":false,"type":projectUpdateOneRequiredWithoutNoticesNestedInput}),
  // 'id' was omitted due to @Pothos.omit found in schema comment
  // 'seen_count' was omitted due to @Pothos.omit found in schema comment
  // 'created_at' was omitted due to @Pothos.omit found in schema comment
  // 'updated_at' was omitted due to @Pothos.omit found in schema comment
});
export const noticeUpdateWithoutOccurrencesInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.noticeUpdateWithoutOccurrencesInput>>('noticeUpdateWithoutOccurrencesInput').implement({
  fields: noticeUpdateWithoutOccurrencesInputFields,
});

export const hourly_occurrenceUpsertWithWhereUniqueWithoutOccurrenceInputFields = (t: any) => ({
  where: t.field({"required":true,"type":hourly_occurrenceWhereUniqueInput}),
  update: t.field({"required":true,"type":hourly_occurrenceUpdateWithoutOccurrenceInput}),
  create: t.field({"required":true,"type":hourly_occurrenceCreateWithoutOccurrenceInput}),
});
export const hourly_occurrenceUpsertWithWhereUniqueWithoutOccurrenceInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.hourly_occurrenceUpsertWithWhereUniqueWithoutOccurrenceInput>>('hourly_occurrenceUpsertWithWhereUniqueWithoutOccurrenceInput').implement({
  fields: hourly_occurrenceUpsertWithWhereUniqueWithoutOccurrenceInputFields,
});

export const hourly_occurrenceUpdateWithWhereUniqueWithoutOccurrenceInputFields = (t: any) => ({
  where: t.field({"required":true,"type":hourly_occurrenceWhereUniqueInput}),
  data: t.field({"required":true,"type":hourly_occurrenceUpdateWithoutOccurrenceInput}),
});
export const hourly_occurrenceUpdateWithWhereUniqueWithoutOccurrenceInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.hourly_occurrenceUpdateWithWhereUniqueWithoutOccurrenceInput>>('hourly_occurrenceUpdateWithWhereUniqueWithoutOccurrenceInput').implement({
  fields: hourly_occurrenceUpdateWithWhereUniqueWithoutOccurrenceInputFields,
});

export const hourly_occurrenceUpdateManyWithWhereWithoutOccurrenceInputFields = (t: any) => ({
  where: t.field({"required":true,"type":hourly_occurrenceScalarWhereInput}),
  data: t.field({"required":true,"type":hourly_occurrenceUpdateManyMutationInput}),
});
export const hourly_occurrenceUpdateManyWithWhereWithoutOccurrenceInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.hourly_occurrenceUpdateManyWithWhereWithoutOccurrenceInput>>('hourly_occurrenceUpdateManyWithWhereWithoutOccurrenceInput').implement({
  fields: hourly_occurrenceUpdateManyWithWhereWithoutOccurrenceInputFields,
});

export const hourly_occurrenceScalarWhereInputFields = (t: any) => ({
  AND: t.field({"required":false,"type":[hourly_occurrenceScalarWhereInput]}),
  OR: t.field({"required":false,"type":[hourly_occurrenceScalarWhereInput]}),
  NOT: t.field({"required":false,"type":[hourly_occurrenceScalarWhereInput]}),
  id: t.field({"required":false,"type":BigIntFilter}),
  occurrence_id: t.field({"required":false,"type":BigIntFilter}),
  interval_start: t.field({"required":false,"type":DateTimeFilter}),
  interval_end: t.field({"required":false,"type":DateTimeFilter}),
  count: t.field({"required":false,"type":BigIntFilter}),
});
export const hourly_occurrenceScalarWhereInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.hourly_occurrenceScalarWhereInput>>('hourly_occurrenceScalarWhereInput').implement({
  fields: hourly_occurrenceScalarWhereInputFields,
});

export const occurrenceCreateWithoutHourly_occurrencesInputFields = (t: any) => ({
  id: t.field({"required":false,"type":Bigint}),
  message: t.string({"required":true}),
  seen_count: t.field({"required":false,"type":Bigint}),
  backtrace: t.field({"required":false,"type":Json}),
  context: t.field({"required":false,"type":Json}),
  environment: t.field({"required":false,"type":Json}),
  session: t.field({"required":false,"type":Json}),
  params: t.field({"required":false,"type":Json}),
  created_at: t.field({"required":false,"type":DateTime}),
  updated_at: t.field({"required":false,"type":DateTime}),
  notice: t.field({"required":true,"type":noticeCreateNestedOneWithoutOccurrencesInput}),
});
export const occurrenceCreateWithoutHourly_occurrencesInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.occurrenceCreateWithoutHourly_occurrencesInput>>('occurrenceCreateWithoutHourly_occurrencesInput').implement({
  fields: occurrenceCreateWithoutHourly_occurrencesInputFields,
});

export const occurrenceCreateOrConnectWithoutHourly_occurrencesInputFields = (t: any) => ({
  where: t.field({"required":true,"type":occurrenceWhereUniqueInput}),
  create: t.field({"required":true,"type":occurrenceCreateWithoutHourly_occurrencesInput}),
});
export const occurrenceCreateOrConnectWithoutHourly_occurrencesInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.occurrenceCreateOrConnectWithoutHourly_occurrencesInput>>('occurrenceCreateOrConnectWithoutHourly_occurrencesInput').implement({
  fields: occurrenceCreateOrConnectWithoutHourly_occurrencesInputFields,
});

export const occurrenceUpsertWithoutHourly_occurrencesInputFields = (t: any) => ({
  update: t.field({"required":true,"type":occurrenceUpdateWithoutHourly_occurrencesInput}),
  create: t.field({"required":true,"type":occurrenceCreateWithoutHourly_occurrencesInput}),
});
export const occurrenceUpsertWithoutHourly_occurrencesInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.occurrenceUpsertWithoutHourly_occurrencesInput>>('occurrenceUpsertWithoutHourly_occurrencesInput').implement({
  fields: occurrenceUpsertWithoutHourly_occurrencesInputFields,
});

export const occurrenceUpdateWithoutHourly_occurrencesInputFields = (t: any) => ({
  id: t.field({"required":false,"type":BigIntFieldUpdateOperationsInput}),
  message: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  seen_count: t.field({"required":false,"type":BigIntFieldUpdateOperationsInput}),
  backtrace: t.field({"required":false,"type":Json}),
  context: t.field({"required":false,"type":Json}),
  environment: t.field({"required":false,"type":Json}),
  session: t.field({"required":false,"type":Json}),
  params: t.field({"required":false,"type":Json}),
  created_at: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  updated_at: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  notice: t.field({"required":false,"type":noticeUpdateOneRequiredWithoutOccurrencesNestedInput}),
});
export const occurrenceUpdateWithoutHourly_occurrencesInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.occurrenceUpdateWithoutHourly_occurrencesInput>>('occurrenceUpdateWithoutHourly_occurrencesInput').implement({
  fields: occurrenceUpdateWithoutHourly_occurrencesInputFields,
});

export const noticeCreateManyProjectInputFields = (t: any) => ({
  env: t.string({"required":false}),
  kind: t.string({"required":false}),
  // 'id' was omitted due to @Pothos.omit found in schema comment
  // 'seen_count' was omitted due to @Pothos.omit found in schema comment
  // 'created_at' was omitted due to @Pothos.omit found in schema comment
  // 'updated_at' was omitted due to @Pothos.omit found in schema comment
});
export const noticeCreateManyProjectInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.noticeCreateManyProjectInput>>('noticeCreateManyProjectInput').implement({
  fields: noticeCreateManyProjectInputFields,
});

export const noticeUpdateWithoutProjectInputFields = (t: any) => ({
  env: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  kind: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  occurrences: t.field({"required":false,"type":occurrenceUpdateManyWithoutNoticeNestedInput}),
  // 'id' was omitted due to @Pothos.omit found in schema comment
  // 'seen_count' was omitted due to @Pothos.omit found in schema comment
  // 'created_at' was omitted due to @Pothos.omit found in schema comment
  // 'updated_at' was omitted due to @Pothos.omit found in schema comment
});
export const noticeUpdateWithoutProjectInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.noticeUpdateWithoutProjectInput>>('noticeUpdateWithoutProjectInput').implement({
  fields: noticeUpdateWithoutProjectInputFields,
});

export const occurrenceCreateManyNoticeInputFields = (t: any) => ({
  id: t.field({"required":false,"type":Bigint}),
  message: t.string({"required":true}),
  seen_count: t.field({"required":false,"type":Bigint}),
  backtrace: t.field({"required":false,"type":Json}),
  context: t.field({"required":false,"type":Json}),
  environment: t.field({"required":false,"type":Json}),
  session: t.field({"required":false,"type":Json}),
  params: t.field({"required":false,"type":Json}),
  created_at: t.field({"required":false,"type":DateTime}),
  updated_at: t.field({"required":false,"type":DateTime}),
});
export const occurrenceCreateManyNoticeInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.occurrenceCreateManyNoticeInput>>('occurrenceCreateManyNoticeInput').implement({
  fields: occurrenceCreateManyNoticeInputFields,
});

export const occurrenceUpdateWithoutNoticeInputFields = (t: any) => ({
  id: t.field({"required":false,"type":BigIntFieldUpdateOperationsInput}),
  message: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  seen_count: t.field({"required":false,"type":BigIntFieldUpdateOperationsInput}),
  backtrace: t.field({"required":false,"type":Json}),
  context: t.field({"required":false,"type":Json}),
  environment: t.field({"required":false,"type":Json}),
  session: t.field({"required":false,"type":Json}),
  params: t.field({"required":false,"type":Json}),
  created_at: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  updated_at: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  hourly_occurrences: t.field({"required":false,"type":hourly_occurrenceUpdateManyWithoutOccurrenceNestedInput}),
});
export const occurrenceUpdateWithoutNoticeInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.occurrenceUpdateWithoutNoticeInput>>('occurrenceUpdateWithoutNoticeInput').implement({
  fields: occurrenceUpdateWithoutNoticeInputFields,
});

export const hourly_occurrenceCreateManyOccurrenceInputFields = (t: any) => ({
  id: t.field({"required":false,"type":Bigint}),
  interval_start: t.field({"required":true,"type":DateTime}),
  interval_end: t.field({"required":true,"type":DateTime}),
  count: t.field({"required":false,"type":Bigint}),
});
export const hourly_occurrenceCreateManyOccurrenceInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.hourly_occurrenceCreateManyOccurrenceInput>>('hourly_occurrenceCreateManyOccurrenceInput').implement({
  fields: hourly_occurrenceCreateManyOccurrenceInputFields,
});

export const hourly_occurrenceUpdateWithoutOccurrenceInputFields = (t: any) => ({
  id: t.field({"required":false,"type":BigIntFieldUpdateOperationsInput}),
  interval_start: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  interval_end: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  count: t.field({"required":false,"type":BigIntFieldUpdateOperationsInput}),
});
export const hourly_occurrenceUpdateWithoutOccurrenceInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.hourly_occurrenceUpdateWithoutOccurrenceInput>>('hourly_occurrenceUpdateWithoutOccurrenceInput').implement({
  fields: hourly_occurrenceUpdateWithoutOccurrenceInputFields,
});