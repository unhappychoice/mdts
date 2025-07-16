import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  pluginJs.configs.recommended,
  tseslint.configs.recommended,
  {
    files: ["src/**/*.{js,mjs,cjs,ts}"],
    rules: {
      indent: [
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
      'linebreak-style': [
        'error',
        'unix'
      ],
      'max-len': [
        'error',
        {
          code: 180, // TODO: should be 120
          ignoreComments: true
        }
      ],
      quotes: [
        'error',
        'single'
      ],
      semi: [
        'error',
        'always'
      ],
      '@typescript-eslint/explicit-module-boundary-types': ['error'],
      'keyword-spacing': ['error'],
      'space-before-blocks': ['error'],
      'space-infix-ops': ['error']
    },
  },
);
