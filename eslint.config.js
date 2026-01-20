
import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';
import eslintPluginJsxA11y from 'eslint-plugin-jsx-a11y';

export default defineConfig([
  globalIgnores(['dist', 'build', 'coverage']),

  {
    files: ['**/*.{js,jsx,ts,tsx}'],

    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.es2021 },
      parser: tseslint.parser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },

    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      // ⬇️ Utiliser la flat config du plugin A11y
      eslintPluginJsxA11y.flatConfigs.recommended,
    ],

    rules: {
      'jsx-a11y/alt-text': 'warn',
      'jsx-a11y/role-supports-aria-props': "off",
      "jsx-a11y/anchor-has-content":"warn",
      'jsx-a11y/anchor-is-valid': [
        'warn',
        {
          components: ['Link'],
          specialLink: ['to'],
          aspects: ['noHref', 'invalidHref', 'preferButton'],
        },
      ],
       "react-hooks/incompatible-library": "off",
       "react-refresh/only-export-components": "off",
        "@typescript-eslint/no-explicit-any": "off",
    },
  },
]);
