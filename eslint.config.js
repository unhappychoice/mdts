import pluginJs from "@eslint/js";
import stylistic from '@stylistic/eslint-plugin'
import tseslint from "typescript-eslint";

export default tseslint.config(
  pluginJs.configs.recommended,
  tseslint.configs.recommended,
  {
    plugins: {
      '@stylistic': stylistic
    },
    files: ["src/**/*.{js,mjs,cjs,ts}", "test/**/*.{js,mjs,cjs,ts}"],
    rules: {
      '@stylistic/indent': [
        'error',
        2,
        {
          SwitchCase: 1,
          ignoredNodes: [
            'FunctionExpression > .params[decorators.length > 0]',
            'FunctionExpression > .params > :matches(Decorator, :not(:first-child))',
            'ClassBody.body > PropertyDefinition[decorators.length > 0] > .key',
          ],
        },
      ],
      '@stylistic/linebreak-style': [
        'error',
        'unix'
      ],
      '@stylistic/max-len': [
        'error',
        {
          code: 120,
          ignoreComments: true
        }
      ],
      '@stylistic/quotes': [
        'error',
        'single'
      ],
      '@stylistic/semi': [
        'error',
        'always'
      ],
      '@typescript-eslint/explicit-module-boundary-types': ['error'],
      '@stylistic/keyword-spacing': ['error'],
      '@stylistic/space-before-blocks': ['error'],
      '@stylistic/space-infix-ops': ['error']
    },
  },
);
