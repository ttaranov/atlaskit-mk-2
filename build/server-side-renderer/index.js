//@flow
'use strict';
/*
* test case to validate that our components are rendering on server-side
*/
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { getExamplesFor } from './helper';

function testSSR(example: string, reactComponent: React$Element<*>) {
  describe(example, () => {
    it(`should be possible to create a server side friendly component for this ${example}`, () => {
      expect(() =>
        ReactDOMServer.renderToString(reactComponent),
      ).not.toThrowError();
    });
  });
}

function testSSRAll(pkg: string) {
  return getExamplesFor(pkg).forEach(examples => {
    // $FlowFixMe - string litteral
    testSSR(examples.exampleName, require(examples.examplePath).default);
  });
}

module.exports = { testSSR, testSSRAll };
