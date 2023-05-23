import { generateAllCrud } from '@/lib/graphql/__generated__/autocrud';

import builder from './builder';

generateAllCrud()

builder.queryType({});
builder.mutationType({});

export default builder.toSchema();
