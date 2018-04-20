// @flow

/*
* util to support defining url for the examples website to be used in webdriver tests.
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
