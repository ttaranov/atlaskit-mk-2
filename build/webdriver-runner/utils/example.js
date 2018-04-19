// @flow

/*
This file contains the build the example url using during the test
*/

const baseUrl = 'http://localhost:9000';

const getExampleUrl = (
  group: string,
  packageName: string,
  exampleName: string = '',
) =>
  `${baseUrl}/examples.html?groupId=${group}&packageId=${packageName}&exampleId=${exampleName}`;

module.exports = {
  baseUrl,
  getExampleUrl,
};
