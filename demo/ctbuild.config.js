const path = require('path');

module.exports = {
  getConfig({ curModule }) {
    curModule.resolve.alias = {
      '@ctsj/state/lib': path.resolve(__dirname, 'src/ctsj-state'),
    };
  },
};
