import { prisma } from '@/lib/db';
import SchemaBuilder from '@pothos/core';
import PrismaPlugin from '@pothos/plugin-prisma';
import { Scalars } from 'prisma-generator-pothos-codegen';

import type PrismaTypes from '@/prisma/pothos-types';

const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes,
  Scalars: Scalars;
}>({
  plugins: [PrismaPlugin],
  prisma: {
    client: prisma,
    exposeDescriptions: true,
    filterConnectionTotalCount: true,
  },
});

export default builder;
