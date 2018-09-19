// @flow
const baseStyles = require('./base');
const browserFixesStyles = require('./browser-fixes');
const resetStyles = require('./reset');
const tableStyles = require('./tables');
const utilStyles = require('./utils');

module.exports = `
${resetStyles}
${baseStyles}
${tableStyles}
${browserFixesStyles}
${utilStyles}
`;
