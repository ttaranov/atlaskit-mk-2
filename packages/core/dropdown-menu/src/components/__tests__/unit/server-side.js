/**
 * @jest-environment node
 */
// @flow
import React from 'react';
import { getExamplesFor } from '@atlaskit/build-utils/getExamples';
import ReactDOMServer from 'react-dom/server';

/* AK-5593: SSR tests failing because of navigator is not defined */
/* eslint-disable jest/no-disabled-tests */
test.skip('Dropdown menu server side rendering', async () => {
  (await getExamplesFor('dropdown-menu')).forEach(examples => {
    // $StringLitteral
    const Example = require(examples.filePath).default; // eslint-disable-line import/no-dynamic-require
    expect(() => ReactDOMServer.renderToString(<Example />)).not.toThrowError();
  });
});
