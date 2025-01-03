// eslint.config.mjs

import { FlatCompat } from '@eslint/eslintrc';
import reactCompiler from 'eslint-plugin-react-compiler';

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript', 'prettier'),
  {
    plugins: {
      'react-compiler': reactCompiler,
    },
    rules: {
      'react-compiler/react-compiler': 'error',
    },
  },
];

export default eslintConfig;
