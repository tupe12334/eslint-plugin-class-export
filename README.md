# eslint-plugin-class-export

An ESLint plugin that enforces class export rules, allowing you to specify whether classes must have exports and what type of exports are allowed.

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

## Implementation Details

This plugin uses **AST selector patterns** for optimal performance and precision:

- `ExportDefaultDeclaration > ClassDeclaration` - Targets classes with default exports
- `ExportNamedDeclaration > ClassDeclaration` - Targets classes with named exports  
- `Program > ClassDeclaration:not(ExportDefaultDeclaration > ClassDeclaration, ExportNamedDeclaration > ClassDeclaration)` - Targets non-exported classes

The selector-based approach provides better performance than traditional AST traversal and enables more precise rule targeting.

## Requirements

- **Node.js**: >= 12.0.0
- **ESLint**: >= 9.0.0 (for flat config support)
- **Package Manager**: pnpm recommended (configured with `packageManager` field)

## Development

This project uses **pnpm** exclusively for package management. All scripts are optimized for pnpm:

### Running Tests

```bash
pnpm test
pnpm test:watch  # Watch mode for development
```

### Linting

```bash
pnpm lint
pnpm lint:fix    # Auto-fix linting issues
```

### Package Management

```bash
pnpm install     # Install dependencies
pnpm fresh       # Clean install (removes node_modules and lockfile)
pnpm clean       # Remove node_modules and lockfile
```

### Releasing

This project uses [release-it](https://github.com/release-it/release-it) for automated releases with environment variables:

#### Setup Release Environment

1. Copy the environment template:
```bash
cp .env.example .env
```

2. Get your tokens:
   - **NPM Token**: Visit [npmjs.com/settings/tokens](https://www.npmjs.com/settings/tokens) and create an **Automation** token
   - **GitHub Token**: Visit [github.com/settings/tokens](https://github.com/settings/tokens) and create a token with `repo` and `write:packages` scopes

3. Update `.env` file:
```env
NPM_TOKEN=npm_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

#### Release Commands

```bash
pnpm release         # Full release: tests, linting, version bump, npm publish, GitHub release
pnpm release:dry     # Safe dry-run preview (no external calls)
pnpm release --dry-run  # Full dry-run preview (includes npm/GitHub checks)
```

**Note**: The `.env` file is git-ignored for security. Never commit tokens to version control.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Author

Created by **Ofek Gabay**

## License

MIT © 2024 Ofek Gabay