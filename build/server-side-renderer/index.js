//@flow
'use strict';
/*
* test case to validate that our components are rendering on server-side
*/
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { getExamplesFor } from './helper';

/* This test takes the example name and a react component. It will throw an error if the component is not SSR friendly
* Usage: 
* import { testSSR } from '@atlaskit/test-ssr';
* import { Example } from 'yourPath';
*  */
function testSSR(example: string, reactComponent: () => React$Element<*>) {
  test(`this example: ${example} should be server side friendly`, () => {
    expect(() =>
      ReactDOMServer.renderToString(reactComponent),
    ).not.toThrowError();
  });
}

/* This test takes a package name and will get all the examples for this package. It will throw an error if the component is not SSR friendly
* Usage: 
* import { testSSRAll } from '@atlaskit/test-ssr';
*  */
async function testSSRAll(pkg: string) {
  test(pkg, async () => {
    (await getExamplesFor(pkg)).forEach(examples => {
      expect(() =>
        // $FlowFixMe - string literal
        ReactDOMServer.renderToString(require(examples.filePath).default),
      ).not.toThrowError();
    });
  });
}
module.exports = { testSSR, testSSRAll };
