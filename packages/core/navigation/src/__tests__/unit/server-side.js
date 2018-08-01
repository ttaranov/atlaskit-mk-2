/**
 * @jest-environment node
 */
// @flow
import { getExamplesFor } from '@atlaskit/build-utils/getExamples';
import ReactDOMServer from 'react-dom/server';

// AK-5164
// eslint-disable-next-line
test.skip('Navigation server side rendering', async () => {
  (await getExamplesFor('navigation')).forEach(examples => {
    expect(
      () =>
        // $StringLitteral
        ReactDOMServer.renderToString(require(examples.filePath).default), // eslint-disable-line
    ).not.toThrowError();
  });
});
