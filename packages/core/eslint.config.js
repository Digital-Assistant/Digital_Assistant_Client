// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
  // Global ignores
  {
    ignores: ['dist/**', 'node_modules/**', '.DS_Store', 'webpack.config.js'],
  },

  // Base configuration for all files
  eslint.configs.recommended,

  // TypeScript specific configurations
  {
    files: ['**/*.{ts,tsx}'],
    extends: [...tseslint.configs.recommended],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: true,
      },
    },
  },

  // Prettier configuration - must be last
  prettierConfig,
);
