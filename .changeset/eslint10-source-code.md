---
"eslint-plugin-class-export": patch
---

fix: ESLint 10 compatibility. The rule now reads `context.sourceCode` and falls back to `context.getSourceCode()`.
