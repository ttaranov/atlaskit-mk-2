/**
 * @jest-environment node
 */
// @flow
import React from 'react';
import { getExamplesFor } from '@atlaskit/build-utils/getExamples';
import ReactDOMServer from 'react-dom/server';

/* AK-5589: SSR tests failing because of Browser history needs a DOM */
/* eslint-disable jest/no-disabled-tests */
test.skip('Navigation server side rendering', async () => {
  (await getExamplesFor('navigation')).forEach(examples => {
    // $StringLitteral
    const Example = require(examples.filePath).default; // eslint-disable-line import/no-dynamic-require
    expect(() => ReactDOMServer.renderToString(<Example />)).not.toThrowError();
  });
});
