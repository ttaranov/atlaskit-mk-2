// @flow

const baseUrl = 'http://localhost:9000';

const getExampleUrl = (group, packageName, exampleName = '') =>
  `${baseUrl}/examples.html?groupId=${group}&packageId=${packageName}&exampleId=${exampleName}`;

module.exports = {
  baseUrl,
  getExampleUrl,
};
