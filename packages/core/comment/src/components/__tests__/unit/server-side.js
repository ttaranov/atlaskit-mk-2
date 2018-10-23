/**
 * @jest-environment node
 */
// @flow
import React from 'react';
import { getExamplesFor } from '@atlaskit/build-utils/getExamples';
import ReactDOMServer from 'react-dom/server';

test('Comment server side rendering', async () => {
  // $FlowFixMe
  (await getExamplesFor('comment')).forEach(examples => {
    // Editor example is not SSR, it is on their roadmap. At the moment, there is no need to block comment component.
    if (!examples.filePath.includes('editor')) {
      // $StringLitteral
      const Example = require(examples.filePath).default; // eslint-disable-line import/no-dynamic-require
      expect(() =>
        ReactDOMServer.renderToString(<Example />),
      ).not.toThrowError();
    }
  });
});
