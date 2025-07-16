import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";
import hooksPlugin from "eslint-plugin-react-hooks";
import jestPlugin from "eslint-plugin-jest";
import importPlugin from "eslint-plugin-import";
import jsxA11yPlugin from "eslint-plugin-jsx-a11y";

export default tseslint.config(
  {
    files: ["src/**/*.{js,mjs,cjs,ts,tsx}"],
    extends: [
      pluginJs.configs.recommended,
      ...tseslint.configs.recommended,
      pluginReactConfig,
    ],
    plugins: {
      "react-hooks": hooksPlugin,
      jest: jestPlugin,
      import: importPlugin,
      "jsx-a11y": jsxA11yPlugin,
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
      '@typescript-eslint/no-var-requires': 'warn', // TODO: Make error
      '@typescript-eslint/no-unused-vars': 'error',
      'indent': ['error', 2, {'SwitchCase': 1}],
      'linebreak-style': ['error', 'unix'],
      'max-len': ['error', { code: 120, ignoreComments: true, ignoreStrings: true }],
      'quotes': ['error', 'single'],
      'react/jsx-no-bind': 'error',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'semi': ['error', 'always'],
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
);
