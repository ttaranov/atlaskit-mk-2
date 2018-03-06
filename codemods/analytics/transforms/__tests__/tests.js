// @flow

jest.autoMockOff();
const defineTest = require('jscodeshift/dist/testUtils').defineTest;

describe('analytics', () => {
  defineTest(__dirname, 'tests', null, 'addsTests');
  defineTest(__dirname, 'tests', null, 'addsTestsMultipleProps');
  defineTest(__dirname, 'tests', null, 'addsTestsIdempotency');
});
