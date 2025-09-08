const classExportRule = require('./lib/rules/class-export');
const pkg = require('./package.json');

const plugin = {
  meta: {
    name: pkg.name,
    version: pkg.version
  },
  rules: {
    'class-export': classExportRule
  },
  configs: {}
};

// Flat config exports (avoid circular reference by using a factory function)
Object.defineProperty(plugin.configs, 'recommended', {
  get() {
    return {
      plugins: {
        'class-export': plugin
      },
      rules: {
        'class-export/class-export': 'error'
      }
    };
  }
});

Object.defineProperty(plugin.configs, 'strict-default', {
  get() {
    return {
      plugins: {
        'class-export': plugin
      },
      rules: {
        'class-export/class-export': ['error', { require: 'default' }]
      }
    };
  }
});

Object.defineProperty(plugin.configs, 'strict-named', {
  get() {
    return {
      plugins: {
        'class-export': plugin
      },
      rules: {
        'class-export/class-export': ['error', { require: 'named' }]
      }
    };
  }
});

Object.defineProperty(plugin.configs, 'flexible', {
  get() {
    return {
      plugins: {
        'class-export': plugin
      },
      rules: {
        'class-export/class-export': ['error', { require: 'any' }]
      }
    };
  }
});

// Legacy eslintrc configs for backwards compatibility
plugin.configs['recommended-legacy'] = {
  plugins: ['class-export'],
  rules: {
    'class-export/class-export': 'error'
  }
};

plugin.configs['strict-default-legacy'] = {
  plugins: ['class-export'],
  rules: {
    'class-export/class-export': ['error', { require: 'default' }]
  }
};

plugin.configs['strict-named-legacy'] = {
  plugins: ['class-export'],
  rules: {
    'class-export/class-export': ['error', { require: 'named' }]
  }
};

plugin.configs['flexible-legacy'] = {
  plugins: ['class-export'],
  rules: {
    'class-export/class-export': ['error', { require: 'any' }]
  }
};

module.exports = plugin;