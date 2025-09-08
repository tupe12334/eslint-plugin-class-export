module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'enforce class export rules',
      category: 'Best Practices',
      recommended: false
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          require: {
            type: 'string',
            enum: ['default', 'named', 'any', 'none']
          },
          allowedExportNames: {
            type: 'array',
            items: {
              type: 'string'
            }
          }
        },
        additionalProperties: false
      }
    ]
  },

  create(context) {
    const options = context.options[0] || {};
    const requireExport = options.require || 'any';
    const allowedExportNames = options.allowedExportNames || [];

    function checkExportName(className, exportType) {
      if (exportType !== 'named' || allowedExportNames.length === 0) {
        return true;
      }
      
      return allowedExportNames.some(allowed => className.endsWith(allowed));
    }

    function findClassInExportSpecifiers(className) {
      const sourceCode = context.getSourceCode();
      const program = sourceCode.ast;
      
      for (const statement of program.body) {
        if (statement.type === 'ExportNamedDeclaration' && statement.specifiers) {
          for (const specifier of statement.specifiers) {
            if (specifier.local && specifier.local.name === className) {
              return true;
            }
          }
        }
      }
      return false;
    }

    function validateClassExport(node, exportType) {
      const className = node.id ? node.id.name : 'Anonymous';
      
      switch (requireExport) {
        case 'default':
          if (exportType !== 'default') {
            context.report({
              node,
              message: `Class '${className}' must be exported as default.`
            });
          }
          break;
          
        case 'named':
          if (exportType !== 'named') {
            context.report({
              node,
              message: `Class '${className}' must be exported as named export.`
            });
          } else if (!checkExportName(className, exportType)) {
            context.report({
              node,
              message: `Class '${className}' name must end with one of: ${allowedExportNames.join(', ')}.`
            });
          }
          break;
          
        case 'any':
          if (!exportType) {
            context.report({
              node,
              message: `Class '${className}' must be exported (default or named).`
            });
          } else if (exportType === 'named' && !checkExportName(className, exportType)) {
            context.report({
              node,
              message: `Class '${className}' name must end with one of: ${allowedExportNames.join(', ')}.`
            });
          }
          break;
          
        case 'none':
          if (exportType) {
            context.report({
              node,
              message: `Class '${className}' must not be exported.`
            });
          }
          break;
      }
    }

    return {
      // Selector: Default exported classes
      'ExportDefaultDeclaration > ClassDeclaration': function(node) {
        validateClassExport(node, 'default');
      },

      // Selector: Named exported classes (inline export)
      'ExportNamedDeclaration > ClassDeclaration': function(node) {
        validateClassExport(node, 'named');
      },

      // Selector: Non-exported classes
      'Program > ClassDeclaration:not(ExportDefaultDeclaration > ClassDeclaration, ExportNamedDeclaration > ClassDeclaration)': function(node) {
        const className = node.id ? node.id.name : null;
        
        // Check if this class is exported via export { ClassName }
        if (className && findClassInExportSpecifiers(className)) {
          validateClassExport(node, 'named');
        } else {
          validateClassExport(node, null);
        }
      }
    };
  }
};