/**
 * @jest-environment node
 */
// @flow
import { getExamplesFor } from '@atlaskit/build-utils/getExamples';
import ReactDOMServer from 'react-dom/server';

test('Empty state server side rendering', async () => {
  (await getExamplesFor('empty-state')).forEach(examples => {
    expect(
      () =>
        // $StringLitteral
        ReactDOMServer.renderToString(require(examples.filePath).default), // eslint-disable-line
    ).not.toThrowError();
  });
});
