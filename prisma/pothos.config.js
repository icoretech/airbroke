// ./pothos.config.js

/** @type {import('prisma-generator-pothos-codegen').Config} */
module.exports = {
  inputs: {
    outputFilePath: './lib/graphql/__generated__/inputs.ts',
  },
  crud: {
    outputDir: './lib/graphql/__generated__/',
    // inputsImporter: `import * as Inputs from '@/lib/graphql/__generated__/inputs';`,
    resolversImports: `import { prisma } from '@/lib/db';`,
    prismaCaller: 'prisma',
  },
  global: {
    builderImporter: `import builder from '@/lib/graphql/builder';`,
  },
};
