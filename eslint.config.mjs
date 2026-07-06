import recommendedIncremental from 'eslint-config-agent/recommended-incremental'
import globals from 'globals'

export default [
  ...recommendedIncremental,
  {
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
        ...globals.jest
      }
    },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }]
    }
  }
]
