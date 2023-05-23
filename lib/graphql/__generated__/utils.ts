import {
  FieldOptionsFromKind,
  InputFieldMap,
  InterfaceParam,
  MutationFieldBuilder,
  MutationFieldsShape,
  ObjectRef,
  QueryFieldBuilder,
  QueryFieldsShape,
  TypeParam,
} from '@pothos/core';
import {
  PrismaFieldOptions,
  PrismaObjectTypeOptions,
  RelatedFieldOptions,
} from '@pothos/plugin-prisma';
import builder from '@/lib/graphql/builder';

type Types = typeof builder extends PothosSchemaTypes.SchemaBuilder<infer T> ? T : unknown;

export const defineQuery = <Q extends QueryFieldsShape<Types>>(q: Q) => q;

export const defineQueryFunction = <Obj>(
  func: (t: QueryFieldBuilder<Types, Types['Root']>) => Obj,
) => func;

export const defineQueryObject = <
  Type extends TypeParam<Types>,
  Nullable extends boolean,
  Args extends InputFieldMap,
>(
  obj: FieldOptionsFromKind<Types, Types['Root'], Type, Nullable, Args, 'Query', Types, unknown>,
) => obj as { type: Type; nullable: Nullable; args: Args; resolve: typeof obj['resolve'] };

export const defineQueryPrismaObject = <
  Type extends keyof Types['PrismaTypes'] | [keyof Types['PrismaTypes']],
  Model extends Types['PrismaTypes'][Type extends [unknown] ? Type[0] : Type],
  Args extends InputFieldMap,
  Nullable extends boolean,
>(
  def: PrismaFieldOptions<
    Types,
    Types['Root'],
    Type,
    Model,
    Type extends [unknown] ? [ObjectRef<Model['Shape']>] : ObjectRef<Model['Shape']>,
    Args,
    Nullable,
    unknown,
    unknown,
    'Query'
  >,
) => def as { type: Type; nullable: Nullable; args: Args; resolve: typeof def['resolve'] };

export const defineMutation = <M extends MutationFieldsShape<Types>>(m: M) => m;

export const defineMutationFunction = <Obj>(
  func: (t: MutationFieldBuilder<Types, Types['Root']>) => Obj,
) => func;

export const defineMutationObject = <
  Type extends TypeParam<Types>,
  Nullable extends boolean,
  Args extends InputFieldMap,
>(
  obj: FieldOptionsFromKind<Types, Types['Root'], Type, Nullable, Args, 'Mutation', Types, unknown>,
) => obj as { type: Type; nullable: Nullable; args: Args; resolve: typeof obj['resolve'] };

export const defineMutationPrismaObject = <
  Type extends keyof Types['PrismaTypes'] | [keyof Types['PrismaTypes']],
  Model extends Types['PrismaTypes'][Type extends [unknown] ? Type[0] : Type],
  Args extends InputFieldMap,
  Nullable extends boolean,
>(
  obj: PrismaFieldOptions<
    Types,
    Types['Root'],
    Type,
    Model,
    Type extends [unknown] ? [ObjectRef<Model['Shape']>] : ObjectRef<Model['Shape']>,
    Args,
    Nullable,
    unknown,
    unknown,
    'Mutation'
  >,
) => obj as { type: Type; nullable: Nullable; args: Args; resolve: typeof obj['resolve'] };

export const defineFieldObject = <
  Name extends keyof Types['PrismaTypes'],
  Type extends TypeParam<Types>,
  Nullable extends boolean,
  Args extends InputFieldMap,
>(
  _: Name,
  obj: FieldOptionsFromKind<
    Types,
    Types['PrismaTypes'][Name]['Shape'],
    Type,
    Nullable,
    Args,
    'Object',
    unknown,
    unknown
  >,
) =>
  obj as { type: Type; nullable: Nullable; description?: string; resolve: typeof obj['resolve'] };

export const defineExposeObject = <Type extends TypeParam<Types>, Nullable extends boolean>(
  _: Type,
  obj: { description: string | undefined; nullable: Nullable },
) => obj;

export const defineRelationObject = <
  ModelName extends keyof Types['PrismaTypes'],
  RelationName extends keyof Types['PrismaTypes'][ModelName]['Relations'],
  Nullable extends boolean,
  Args extends InputFieldMap,
>(
  _: ModelName,
  __: RelationName,
  obj: RelatedFieldOptions<
    Types,
    Types['PrismaTypes'][ModelName],
    RelationName,
    Nullable,
    Args,
    unknown,
    false,
    Types['PrismaTypes'][ModelName]['Shape']
  >,
) =>
  obj as {
    description: string | undefined;
    nullable: Nullable;
    args: Args;
    query: typeof obj['query'];
  };

export const defineRelationFunction = <ModelName extends keyof Types['PrismaTypes'], O>(
  _: ModelName,
  func: (
    t: PothosSchemaTypes.PrismaObjectFieldBuilder<
      Types,
      Types['PrismaTypes'][ModelName],
      false,
      Types['PrismaTypes'][ModelName]['Shape']
    >,
  ) => O,
) => func;

export const definePrismaObject = <
  Name extends keyof Types['PrismaTypes'],
  Obj extends PrismaObjectTypeOptions<
    Types,
    Types['PrismaTypes'][Name],
    InterfaceParam<Types>[],
    unknown,
    unknown,
    unknown,
    Types['PrismaTypes'][Name]['Shape']
  >,
>(
  _: Name,
  obj: Obj,
) => obj;
