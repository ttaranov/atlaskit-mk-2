const path = require('path');

module.exports = [
  { name: 'Checkbox', src: path.join(__dirname, '../src/Checkbox.js') },
  {
    name: 'CheckboxStateless',
    src: path.join(__dirname, '../src/CheckboxStateless.js'),
  },
  {
    name: 'CheckboxGroup',
    src: path.join(__dirname, '../src/CheckboxGroup.js'),
  },
];
