const { RuleTester } = require('eslint');
const rule = require('../../../lib/rules/class-export');

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  }
});

ruleTester.run('class-export', rule, {
  valid: [
    // Default export tests
    {
      code: 'export default class UserComponent {}',
      options: [{ require: 'default' }]
    },
    {
      code: 'export default class {}',
      options: [{ require: 'default' }]
    },
    
    // Named export tests
    {
      code: 'export class UserService {}',
      options: [{ require: 'named' }]
    },
    {
      code: 'class UserModel {} export { UserModel };',
      options: [{ require: 'named' }]
    },
    
    // Named export with allowed names
    {
      code: 'export class UserComponent {}',
      options: [{ require: 'named', allowedExportNames: ['Component', 'Service'] }]
    },
    {
      code: 'export class DataService {}',
      options: [{ require: 'named', allowedExportNames: ['Component', 'Service'] }]
    },
    {
      code: 'class UserModel {} export { UserModel };',
      options: [{ require: 'named', allowedExportNames: ['Model'] }]
    },
    
    // Any export tests
    {
      code: 'export default class UserComponent {}',
      options: [{ require: 'any' }]
    },
    {
      code: 'export class UserService {}',
      options: [{ require: 'any' }]
    },
    {
      code: 'class UserModel {} export { UserModel };',
      options: [{ require: 'any' }]
    },
    
    // Any export with allowed names
    {
      code: 'export class UserComponent {}',
      options: [{ require: 'any', allowedExportNames: ['Component'] }]
    },
    {
      code: 'export default class UserComponent {}',
      options: [{ require: 'any', allowedExportNames: ['Component'] }]
    },
    
    // No export tests
    {
      code: 'class UserHelper {}',
      options: [{ require: 'none' }]
    },
    {
      code: 'class UtilityClass {}',
      options: [{ require: 'none' }]
    },
    
    // Default behavior (any export)
    {
      code: 'export default class UserComponent {}'
    },
    {
      code: 'export class UserService {}'
    }
  ],

  invalid: [
    // Default export required but missing
    {
      code: 'class UserComponent {}',
      options: [{ require: 'default' }],
      errors: [{
        message: "Class 'UserComponent' must be exported as default."
      }]
    },
    {
      code: 'export class UserComponent {}',
      options: [{ require: 'default' }],
      errors: [{
        message: "Class 'UserComponent' must be exported as default."
      }]
    },
    
    // Named export required but missing
    {
      code: 'class UserService {}',
      options: [{ require: 'named' }],
      errors: [{
        message: "Class 'UserService' must be exported as named export."
      }]
    },
    {
      code: 'export default class UserService {}',
      options: [{ require: 'named' }],
      errors: [{
        message: "Class 'UserService' must be exported as named export."
      }]
    },
    
    // Named export with wrong name
    {
      code: 'export class UserHelper {}',
      options: [{ require: 'named', allowedExportNames: ['Component', 'Service'] }],
      errors: [{
        message: "Class 'UserHelper' name must end with one of: Component, Service."
      }]
    },
    {
      code: 'class DataProcessor {} export { DataProcessor };',
      options: [{ require: 'named', allowedExportNames: ['Model', 'Controller'] }],
      errors: [{
        message: "Class 'DataProcessor' name must end with one of: Model, Controller."
      }]
    },
    
    // Any export required but missing
    {
      code: 'class UserModel {}',
      options: [{ require: 'any' }],
      errors: [{
        message: "Class 'UserModel' must be exported (default or named)."
      }]
    },
    
    // Any export with wrong name (named export)
    {
      code: 'export class UserHandler {}',
      options: [{ require: 'any', allowedExportNames: ['Component', 'Service'] }],
      errors: [{
        message: "Class 'UserHandler' name must end with one of: Component, Service."
      }]
    },
    
    // No export required but has export
    {
      code: 'export default class UserHelper {}',
      options: [{ require: 'none' }],
      errors: [{
        message: "Class 'UserHelper' must not be exported."
      }]
    },
    {
      code: 'export class UtilityClass {}',
      options: [{ require: 'none' }],
      errors: [{
        message: "Class 'UtilityClass' must not be exported."
      }]
    },
    {
      code: 'class InternalHelper {} export { InternalHelper };',
      options: [{ require: 'none' }],
      errors: [{
        message: "Class 'InternalHelper' must not be exported."
      }]
    },
    
    // Default behavior (any export required)
    {
      code: 'class UserModel {}',
      errors: [{
        message: "Class 'UserModel' must be exported (default or named)."
      }]
    },
    
    // Anonymous class tests
    {
      code: 'export default class {}',
      options: [{ require: 'named' }],
      errors: [{
        message: "Class 'Anonymous' must be exported as named export."
      }]
    }
  ]
});