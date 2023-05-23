import * as Inputs from '../inputs';
import {
  defineExposeObject,
  definePrismaObject,
  defineFieldObject,
  defineRelationFunction,
  defineRelationObject,
} from '../utils';

export const projectObject = definePrismaObject('project', {
  description: 'Project details along with associated notices',
  findUnique: ({ id }) => ({ id }),
  fields: (t) => ({
    id: t.exposeID('id', projectIdFieldObject),
    name: t.exposeString('name', projectNameFieldObject),
    api_key: t.exposeString('api_key', projectApi_keyFieldObject),
    organization: t.exposeString('organization', projectOrganizationFieldObject),
    repo_provider: t.exposeString('repo_provider', projectRepo_providerFieldObject),
    repo_provider_api_key: t.exposeString('repo_provider_api_key', projectRepo_provider_api_keyFieldObject),
    repo_provider_api_secret: t.exposeString('repo_provider_api_secret', projectRepo_provider_api_secretFieldObject),
    repo_branch: t.exposeString('repo_branch', projectRepo_branchFieldObject),
    repo_issue_tracker: t.exposeString('repo_issue_tracker', projectRepo_issue_trackerFieldObject),
    repo_url: t.exposeString('repo_url', projectRepo_urlFieldObject),
    notices_count: t.field(projectNotices_countFieldObject),
    created_at: t.field(projectCreated_atFieldObject),
    updated_at: t.field(projectUpdated_atFieldObject),
    notices: t.relation('notices', projectNoticesFieldObject(t)),
  }),
});

export const projectIdFieldObject = defineExposeObject('Bigint', {
  description: undefined,
  nullable: false,
});

export const projectNameFieldObject = defineExposeObject('String', {
  description: 'Unique name of the project',
  nullable: false,
});

export const projectApi_keyFieldObject = defineExposeObject('String', {
  description: undefined,
  nullable: false,
});

export const projectOrganizationFieldObject = defineExposeObject('String', {
  description: undefined,
  nullable: false,
});

export const projectRepo_providerFieldObject = defineExposeObject('String', {
  description: undefined,
  nullable: false,
});

export const projectRepo_provider_api_keyFieldObject = defineExposeObject('String', {
  description: undefined,
  nullable: true,
});

export const projectRepo_provider_api_secretFieldObject = defineExposeObject('String', {
  description: undefined,
  nullable: true,
});

export const projectRepo_branchFieldObject = defineExposeObject('String', {
  description: undefined,
  nullable: false,
});

export const projectRepo_issue_trackerFieldObject = defineExposeObject('String', {
  description: undefined,
  nullable: true,
});

export const projectRepo_urlFieldObject = defineExposeObject('String', {
  description: undefined,
  nullable: true,
});

export const projectNotices_countFieldObject = defineFieldObject('project', {
  type: Inputs.Bigint,
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.notices_count,
});

export const projectCreated_atFieldObject = defineFieldObject('project', {
  type: Inputs.DateTime,
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.created_at,
});

export const projectUpdated_atFieldObject = defineFieldObject('project', {
  type: Inputs.DateTime,
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.updated_at,
});

export const projectNoticesFieldObject = defineRelationFunction('project', (t) =>
  defineRelationObject('project', 'notices', {
    description: 'Relation to associated notices',
    nullable: false,
    args: {
      where: t.arg({ type: Inputs.noticeWhereInput, required: false }),
      orderBy: t.arg({ type: [Inputs.noticeOrderByWithRelationInput], required: false }),
      cursor: t.arg({ type: Inputs.noticeWhereUniqueInput, required: false }),
      take: t.arg({ type: 'Int', required: false }),
      skip: t.arg({ type: 'Int', required: false }),
      distinct: t.arg({ type: [Inputs.NoticeScalarFieldEnum], required: false }),
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
