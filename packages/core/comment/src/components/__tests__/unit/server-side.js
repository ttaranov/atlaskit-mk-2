/**
 * @jest-environment node
 */
// @flow
import { getExamplesFor } from '@atlaskit/build-utils/getExamples';
import ReactDOMServer from 'react-dom/server';

test('Comment server side rendering', async () => {
  // $FlowFixMe
  (await getExamplesFor('comment')).forEach(examples => {
    // Editor example is not SSR, it is on their roadmap. At the moment, there is no need to block comment component.
    if (!examples.filePath.includes('editor')) {
      expect(
        () =>
          // $StringLitteral
          ReactDOMServer.renderToString(require(examples.filePath).default), // eslint-disable-line
      ).not.toThrowError();
    }
  });
});
