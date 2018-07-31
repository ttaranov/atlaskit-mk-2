const fs = require('fs');
const path = require('path');

const createConfig = require('../config');

module.exports = createConfig(
  JSON.parse(fs.readFileSync(path.resolve(__dirname, '.config'))),
);
