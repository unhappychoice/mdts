const globals = require("globals");
const pluginJs = require("@eslint/js");
const stylistic = require('@stylistic/eslint-plugin');
const tseslint = require("typescript-eslint");
const reactPlugin = require("@eslint-react/eslint-plugin");
const hooksPlugin = require("eslint-plugin-react-hooks");
const jestPlugin = require("eslint-plugin-jest");

module.exports = tseslint.config(
  {
    files: ["src/**/*.{js,mjs,cjs,ts,tsx}", "test/**/*.{js,mjs,cjs,ts,tsx}"],
    extends: [
      pluginJs.configs.recommended,
      ...tseslint.configs.recommended,
      reactPlugin.configs.recommended,
    ],
    plugins: {
      '@stylistic': stylistic,
      "react-hooks": hooksPlugin,
      jest: jestPlugin,
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 2020,
        sourceType: "module",
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      '@typescript-eslint/no-var-requires': 'warn',
      '@typescript-eslint/no-unused-vars': 'error',
      '@stylistic/indent': ['error', 2, {'SwitchCase': 1}],
      '@stylistic/linebreak-style': ['error', 'unix'],
      '@stylistic/max-len': ['error', { code: 120, ignoreComments: true, ignoreStrings: true }],
      '@stylistic/quotes': ['error', 'single'],
      '@eslint-react/no-nested-component-definitions': 'error',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      '@stylistic/semi': ['error', 'always'],
    },
  },
);
