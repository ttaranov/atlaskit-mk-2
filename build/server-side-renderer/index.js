//@flow
'use strict';
/*
* test case to validate that our components are rendering on server-side
*/
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { getExamplesFor, getFileContent } from './helper';

function testSSR(example: string, reactComponent: React$Element<*>) {
  describe(example, () => {
    it(`should be possible to create a server side friendly component for this ${example}`, () => {
      expect(() =>
        ReactDOMServer.renderToString(reactComponent),
      ).not.toThrowError();
    });
  });
}

async function testSSRAll(pkg: string) {
  return getExamplesFor(pkg).forEach(async examples => {
    testSSR(examples.exampleName, await examples.exampleName);
  });
}

module.exports = { testSSR, testSSRAll };
