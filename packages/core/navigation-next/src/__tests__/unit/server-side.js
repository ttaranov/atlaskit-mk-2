/**
 * @jest-environment node
 */
// @flow

import { getExamplesFor } from '@atlaskit/build-utils/getExamples';
import ReactDOMServer from 'react-dom/server';

test('navigation-next server side rendering', async () => {
  (await getExamplesFor('navigation-next')).forEach(examples => {
    expect(
      () =>
        // $StringLitteral
        ReactDOMServer.renderToString(require(examples.filePath).default), // eslint-disable-line global-require, import/no-dynamic-require
    ).not.toThrowError();
  });
});
