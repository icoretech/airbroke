import builder from '@/lib/graphql/builder';
import * as project from './project';
import * as notice from './notice';
import * as occurrence from './occurrence';
import * as hourly_occurrence from './hourly_occurrence';
import * as Objects from './objects';

type Model = Objects.Model;

export const Cruds: Record<
  Objects.Model,
  {
    Object: any;
    queries: Record<string, Function>;
    mutations: Record<string, Function>;
  }
> = {
  project: {
    Object: project.projectObject,
    queries: {
      findFirst: project.findFirstprojectQueryObject,
      findMany: project.findManyprojectQueryObject,
      count: project.countprojectQueryObject,
      findUnique: project.findUniqueprojectQueryObject,
    },
    mutations: {
      createMany: project.createManyprojectMutationObject,
      createOne: project.createOneprojectMutationObject,
      deleteMany: project.deleteManyprojectMutationObject,
      deleteOne: project.deleteOneprojectMutationObject,
      updateMany: project.updateManyprojectMutationObject,
      updateOne: project.updateOneprojectMutationObject,
      upsertOne: project.upsertOneprojectMutationObject,
    },
  },
  notice: {
    Object: notice.noticeObject,
    queries: {
      findFirst: notice.findFirstnoticeQueryObject,
      findMany: notice.findManynoticeQueryObject,
      count: notice.countnoticeQueryObject,
      findUnique: notice.findUniquenoticeQueryObject,
    },
    mutations: {
      createMany: notice.createManynoticeMutationObject,
      createOne: notice.createOnenoticeMutationObject,
      deleteMany: notice.deleteManynoticeMutationObject,
      deleteOne: notice.deleteOnenoticeMutationObject,
      updateMany: notice.updateManynoticeMutationObject,
      updateOne: notice.updateOnenoticeMutationObject,
      upsertOne: notice.upsertOnenoticeMutationObject,
    },
  },
  occurrence: {
    Object: occurrence.occurrenceObject,
    queries: {
      findFirst: occurrence.findFirstoccurrenceQueryObject,
      findMany: occurrence.findManyoccurrenceQueryObject,
      count: occurrence.countoccurrenceQueryObject,
      findUnique: occurrence.findUniqueoccurrenceQueryObject,
    },
    mutations: {
      createMany: occurrence.createManyoccurrenceMutationObject,
      createOne: occurrence.createOneoccurrenceMutationObject,
      deleteMany: occurrence.deleteManyoccurrenceMutationObject,
      deleteOne: occurrence.deleteOneoccurrenceMutationObject,
      updateMany: occurrence.updateManyoccurrenceMutationObject,
      updateOne: occurrence.updateOneoccurrenceMutationObject,
      upsertOne: occurrence.upsertOneoccurrenceMutationObject,
    },
  },
  hourly_occurrence: {
    Object: hourly_occurrence.hourly_occurrenceObject,
    queries: {
      findFirst: hourly_occurrence.findFirsthourly_occurrenceQueryObject,
      findMany: hourly_occurrence.findManyhourly_occurrenceQueryObject,
      count: hourly_occurrence.counthourly_occurrenceQueryObject,
      findUnique: hourly_occurrence.findUniquehourly_occurrenceQueryObject,
    },
    mutations: {
      createMany: hourly_occurrence.createManyhourly_occurrenceMutationObject,
      createOne: hourly_occurrence.createOnehourly_occurrenceMutationObject,
      deleteMany: hourly_occurrence.deleteManyhourly_occurrenceMutationObject,
      deleteOne: hourly_occurrence.deleteOnehourly_occurrenceMutationObject,
      updateMany: hourly_occurrence.updateManyhourly_occurrenceMutationObject,
      updateOne: hourly_occurrence.updateOnehourly_occurrenceMutationObject,
      upsertOne: hourly_occurrence.upsertOnehourly_occurrenceMutationObject,
    },
  },
};

const crudEntries = Object.entries(Cruds);

type ResolverType = "Query" | "Mutation";
function generateResolversByType(type: ResolverType, opts?: CrudOptions) {
  return crudEntries
    .filter(([modelName]) => includeModel(modelName, opts))
    .map(([modelName, config]) => {
      const resolverEntries = Object.entries(config[type === "Query" ? "queries" : "mutations"]);

      return resolverEntries.map(([operationName, resolverObjectDefiner]) => {
        const resolverName = operationName + modelName;
        const isntPrismaFieldList = ["count", "deleteMany", "updateMany"];
        const isPrismaField = !isntPrismaFieldList.includes(operationName);

        const getFields = (t: any) => {
          const field = resolverObjectDefiner(t);
          const handledField = opts?.handleResolver
            ? opts.handleResolver({
                field,
                modelName: modelName as Model,
                operationName,
                resolverName,
                t,
                isPrismaField,
                type,
              })
            : field;

          return {
            [resolverName]: isPrismaField
              ? t.prismaField(handledField)
              : t.field(handledField),
          }
        }

        return type === "Query"
          ? builder.queryFields((t) => getFields(t))
          : builder.mutationFields((t) => getFields(t));
      });
    });
}

export function generateAllObjects(opts?: CrudOptions) {
  return crudEntries
    .filter(([md]) => includeModel(md, opts))
    .map(([modelName, { Object }]) => {
      return builder.prismaObject(modelName as Model, Object); // Objects is all imports
    });
}

export function generateAllQueries(opts?: CrudOptions) {
  generateResolversByType("Query", opts);
}

export function generateAllMutations(opts?: CrudOptions) {
  generateResolversByType("Mutation", opts);
}

export function generateAllResolvers(opts?: CrudOptions) {
  generateResolversByType("Mutation", opts);
  generateResolversByType("Query", opts);
}

type CrudOptions = {
  include?: Model[];
  exclude?: Model[];
  /**
   * Caution: This is not type safe
   * Wrap all queries/mutations to override args, run extra code in resolve function (ie: throw errors, logs), apply plugins, etc.
   */
  handleResolver?: (props: {
    modelName: Model;
    field: any;
    operationName: string;
    resolverName: string;
    t: any;
    isPrismaField: boolean;
    type: ResolverType;
  }) => any;
};

const includeModel = (model: string, opts?: CrudOptions): boolean => {
  if (!opts) return true;
  if (opts.include) return opts.include.includes(model as Model);
  if (opts.exclude) return !opts.exclude.includes(model as Model);
  return true;
};

export function generateAllCrud(opts?: CrudOptions) {
  generateAllObjects(opts);
  generateAllQueries(opts);
  generateAllMutations(opts);
}
