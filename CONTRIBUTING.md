# Contributing to eslint-plugin-class-export

Thank you for your interest in contributing! This guide covers development setup, testing, and release processes.

## Development Setup

### Prerequisites

- **Node.js**: >= 12.0.0
- **Package Manager**: pnpm (recommended) - configured with `packageManager` field

### Getting Started

1. Fork and clone the repository:
```bash
git clone https://github.com/your-username/eslint-plugin-class-export.git
cd eslint-plugin-class-export
```

2. Install dependencies:
```bash
pnpm install
```

## Implementation Details

This plugin uses **AST selector patterns** for optimal performance and precision:

- `ExportDefaultDeclaration > ClassDeclaration` - Targets classes with default exports
- `ExportNamedDeclaration > ClassDeclaration` - Targets classes with named exports  
- `Program > ClassDeclaration:not(ExportDefaultDeclaration > ClassDeclaration, ExportNamedDeclaration > ClassDeclaration)` - Targets non-exported classes

The selector-based approach provides better performance than traditional AST traversal and enables more precise rule targeting.

## Development Workflow

This project uses **pnpm** exclusively for package management. All scripts are optimized for pnpm:

### Running Tests

```bash
pnpm test            # Run full test suite
pnpm test:watch      # Watch mode for development
```

### Linting

```bash
pnpm lint            # Check code style
pnpm lint:fix        # Auto-fix linting issues
```

### Package Management

```bash
pnpm install         # Install dependencies
pnpm fresh           # Clean install (removes node_modules and lockfile)
pnpm clean           # Remove node_modules and lockfile
```

## Testing Guidelines

- All new features must include comprehensive tests
- Tests use Jest and ESLint's RuleTester
- Both valid and invalid code examples should be tested
- Test configuration options thoroughly

Example test structure:
```javascript
ruleTester.run('class-export', rule, {
  valid: [
    // Valid code examples
    { code: 'export default class Foo {}', options: [{ require: 'default' }] }
  ],
  invalid: [
    // Invalid code examples with expected errors
    {
      code: 'class Foo {}',
      options: [{ require: 'default' }],
      errors: [{ message: "Class 'Foo' must be exported as default." }]
    }
  ]
});
```

## Changesets

This project uses [Changesets](https://github.com/changesets/changesets) to track changes for release notes. The `changeset-check` CI job (`.github/workflows/changesets.yml`) fails any pull request that modifies source files without an accompanying changeset:

```bash
npx changeset add          # describe the change for the changelog
npx changeset add --empty  # use this if the change needs no release note (e.g. docs-only)
```

## Release Process

### Setup Release Environment

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

### Release Commands

```bash
pnpm release         # Full release: tests, linting, version bump, npm publish, GitHub release
pnpm release:dry     # Safe dry-run preview (no external calls)
pnpm release --dry-run  # Full dry-run preview (includes npm/GitHub checks)
```

**Note**: The `.env` file is git-ignored for security. Never commit tokens to version control.

## Code Style

- Follow existing patterns and conventions
- Use AST selectors for rule implementation
- Write descriptive commit messages following conventional commits
- Keep functions small and focused
- Add JSDoc comments for public APIs

## Submitting Changes

1. Create a feature branch from `main`
2. Make your changes with tests
3. Run the full test suite and linting
4. Commit with descriptive messages
5. Push and create a pull request

### Pull Request Guidelines

- Describe the problem and solution clearly
- Include test cases for new functionality
- Update documentation if needed
- Ensure all CI checks pass
- Link related issues

## Architecture Notes

### Rule Structure

The plugin follows ESLint v9 flat config patterns:

```javascript
const plugin = {
  meta: {
    name: pkg.name,
    version: pkg.version
  },
  rules: {
    'class-export': ruleImplementation
  },
  configs: {
    // Flat config objects with proper plugin references
  }
};
```

### AST Selector Benefits

1. **Performance**: Direct node targeting without traversal
2. **Precision**: CSS-like selectors for exact matches
3. **Readability**: Declarative rule logic
4. **Maintainability**: Clear separation of concerns

## Questions?

Feel free to open an issue for questions about contributing or implementation details.
