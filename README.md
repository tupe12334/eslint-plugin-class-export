# eslint-plugin-class-export

[![npm version](https://badge.fury.io/js/eslint-plugin-class-export.svg)](https://badge.fury.io/js/eslint-plugin-class-export)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![ESLint](https://img.shields.io/badge/ESLint-9.0%2B-4B32C3?logo=eslint)](https://eslint.org/)

An ESLint plugin that enforces class export rules, allowing you to specify whether classes must have exports and what type of exports are allowed.

## Features

✅ **ESLint v9 Compatible** - Built with flat config support  
✅ **AST Selector Patterns** - High-performance rule implementation  
✅ **Flexible Configuration** - Support for default, named, any, or no exports  
✅ **Naming Restrictions** - Optional validation of export naming patterns  
✅ **Zero Dependencies** - Lightweight and fast  
✅ **TypeScript Ready** - Works with TypeScript via ESLint

## Installation

```bash
# Recommended: Use pnpm for better performance and strict dependency management
pnpm add --save-dev eslint-plugin-class-export

# Alternative: npm/yarn
npm install --save-dev eslint-plugin-class-export
yarn add --dev eslint-plugin-class-export
```

## Usage

### ESLint v9+ (Flat Config) - Recommended

```javascript
// eslint.config.js
import classExport from 'eslint-plugin-class-export';

export default [
  {
    plugins: {
      'class-export': classExport
    },
    rules: {
      'class-export/class-export': 'error'
    }
  }
];
```

### CommonJS Flat Config

```javascript
// eslint.config.js
const classExport = require('eslint-plugin-class-export');

module.exports = [
  {
    plugins: {
      'class-export': classExport
    },
    rules: {
      'class-export/class-export': 'error'
    }
  }
];
```

### Legacy ESLint (eslintrc format)

```json
{
  "plugins": ["class-export"],
  "rules": {
    "class-export/class-export": "error"
  }
}
```

## Rule Options

The `class-export/class-export` rule accepts an options object with the following properties:

- `require` (string): Specifies export requirement
  - `"default"` - Classes must be exported as default export
  - `"named"` - Classes must be exported as named export
  - `"any"` - Classes must be exported (default or named)
  - `"none"` - Classes must not be exported
  - Default: `"any"`

- `allowedExportNames` (array): When using named exports, only class names ending with these suffixes are allowed
  - Default: `[]` (no restriction)

## Examples

### Require Default Exports

```javascript
// eslint.config.js
export default [
  {
    plugins: { 'class-export': classExport },
    rules: {
      'class-export/class-export': ['error', { require: 'default' }]
    }
  }
];
```

✅ **Valid:**
```javascript
export default class UserComponent {}
export default class {}
```

❌ **Invalid:**
```javascript
class UserComponent {} // Missing export
export class UserComponent {} // Named export instead of default
```

### Require Named Exports

```javascript
// eslint.config.js
export default [
  {
    plugins: { 'class-export': classExport },
    rules: {
      'class-export/class-export': ['error', { require: 'named' }]
    }
  }
];
```

✅ **Valid:**
```javascript
export class UserService {}
class UserModel {}
export { UserModel };
```

❌ **Invalid:**
```javascript
class UserService {} // Missing export
export default class UserService {} // Default export instead of named
```

### Named Exports with Naming Restrictions

```javascript
// eslint.config.js
export default [
  {
    plugins: { 'class-export': classExport },
    rules: {
      'class-export/class-export': ['error', { 
        require: 'named',
        allowedExportNames: ['Component', 'Service', 'Model']
      }]
    }
  }
];
```

✅ **Valid:**
```javascript
export class UserComponent {}
export class DataService {}
export class UserModel {}
```

❌ **Invalid:**
```javascript
export class UserHelper {} // Name doesn't end with allowed suffixes
export class DataProcessor {} // Name doesn't end with allowed suffixes
```

### Allow Any Export Type

```javascript
// eslint.config.js
export default [
  {
    plugins: { 'class-export': classExport },
    rules: {
      'class-export/class-export': ['error', { require: 'any' }]
    }
  }
];
```

✅ **Valid:**
```javascript
export default class UserComponent {}
export class UserService {}
class UserModel {}
export { UserModel };
```

❌ **Invalid:**
```javascript
class UserHelper {} // No export
```

### Prohibit All Exports

```javascript
// eslint.config.js
export default [
  {
    plugins: { 'class-export': classExport },
    rules: {
      'class-export/class-export': ['error', { require: 'none' }]
    }
  }
];
```

✅ **Valid:**
```javascript
class UtilityClass {}
class InternalHelper {}
```

❌ **Invalid:**
```javascript
export default class UtilityClass {} // Has export
export class InternalHelper {} // Has export
```

## Predefined Configurations

### Flat Config (ESLint v9+)

```javascript
import classExport from 'eslint-plugin-class-export';

// Use predefined configs
export default [
  classExport.configs.recommended,        // Classes must be exported (any type)
  classExport.configs['strict-default'], // Classes must be default exported
  classExport.configs['strict-named'],   // Classes must be named exported
  classExport.configs.flexible          // Classes must be exported (any type)
];
```

### Legacy Config (ESLint v8 and below)

```json
{
  "extends": [
    "plugin:class-export/recommended-legacy",
    "plugin:class-export/strict-default-legacy",
    "plugin:class-export/strict-named-legacy",
    "plugin:class-export/flexible-legacy"
  ]
}
```

## Requirements

- **Node.js**: >= 12.0.0
- **ESLint**: >= 9.0.0 (flat config support)

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for development setup, testing guidelines, and release processes.

## Author

Created by **Ofek Gabay**

## License

MIT © 2024 Ofek Gabay
