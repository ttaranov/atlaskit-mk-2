// @flow

jest.autoMockOff();
const defineTest = require('jscodeshift/dist/testUtils').defineTest;

describe('analytics', () => {
  defineTest(__dirname, 'index', null, 'AddsHocsToDeclaration');
  defineTest(__dirname, 'index', null, 'AddsHocsToExpression');
  defineTest(__dirname, 'index', null, 'AddsHocsToDeclarationIdempotency');
  defineTest(__dirname, 'index', null, 'AddsHocsToExpressionIdempotency');
});
