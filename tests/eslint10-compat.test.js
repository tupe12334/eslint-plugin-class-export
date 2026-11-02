const { Linter } = require('eslint');
const plugin = require('../index');

// ESLint 10 removed these context APIs. ESLint 9 (the dev dependency) still
// has them, so a rule that calls one passes RuleTester and crashes for
// consumers. Wrap each rule's context so any use of a removed API throws.
const REMOVED = new Set([
  'getAncestors',
  'getCwd',
  'getDeclaredVariables',
  'getFilename',
  'getPhysicalFilename',
  'getScope',
  'getSourceCode',
  'markVariableAsUsed',
  'parserOptions',
  'parserPath',
]);

const guard = (rule) => ({
  ...rule,
  create: (context) =>
    rule.create(
      new Proxy(context, {
        get(target, property) {
          if (REMOVED.has(property)) throw new TypeError(`context.${String(property)} was removed in ESLint 10`);
          return Reflect.get(target, property);
        },
      }),
    ),
});

const source = ['class Foo {}', 'export { Foo };', 'export class Bar {}', 'class Baz {}'].join('\n');

describe('ESLint 10 compatibility', () => {
  it('no rule uses a context API removed in ESLint 10', () => {
    const entries = Object.entries(plugin.rules);
    const guarded = { rules: Object.fromEntries(entries.map(([name, rule]) => [name, guard(rule)])) };
    const rules = Object.fromEntries(entries.map(([name]) => [`p/${name}`, 'error']));
    const config = [{ files: ['**/*.js'], languageOptions: { sourceType: 'module' }, plugins: { p: guarded }, rules }];
    const messages = new Linter().verify(source, config, { filename: 'src/a.js' });
    expect(messages.filter((m) => m.fatal)).toEqual([]);
    expect(messages.length).toBeGreaterThan(0);
  });
});
