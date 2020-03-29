const path = require('path');

module.exports = {
  getConfig({curModule, plugins}) {
    curModule.entry.index = path.join(__dirname, 'src', 'index.tsx');
  },
};
