/**
 * @jest-environment node
 */
// @flow
import React from 'react';
import { getExamplesFor } from '@atlaskit/build-utils/getExamples';
import ReactDOMServer from 'react-dom/server';

/* AK-5590: SSR tests failing because of window is not defined */
/* eslint-disable jest/no-disabled-tests */
test.skip('Modal dialog server side rendering', async () => {
  (await getExamplesFor('modal-dialog')).forEach(examples => {
    // $StringLitteral
    const Example = require(examples.filePath).default; // eslint-disable-line import/no-dynamic-require
    expect(() => ReactDOMServer.renderToString(<Example />)).not.toThrowError();
  });
});
