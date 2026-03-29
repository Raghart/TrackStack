// @ts-check
import eslint from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginSecurity from 'eslint-plugin-security';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      security: pluginSecurity,
    }
  },
  {
    rules: {
      ...pluginSecurity.configs.recommended.rules,
    },
  },
  { ignores: ['eslint.config.mjs', "node_modules", "dist", "bonsai", "coverage", "public"], },
);