// ESLint v9 flat config in CommonJS format
const js = require('@eslint/js');

module.exports = [
  {
    languageOptions: {
      ecmaVersion: 2018,
      sourceType: 'script',
      globals: {
        ...require('globals').node,
        ...require('globals').jest
      }
    },
    rules: {
      ...js.configs.recommended.rules,
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-console': 'off'
    }
  }
];