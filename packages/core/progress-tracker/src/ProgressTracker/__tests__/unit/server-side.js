/**
 * @jest-environment node
 */
// @flow
import { getExamplesFor } from '@atlaskit/build-utils/getExamples';
import ReactDOMServer from 'react-dom/server';

test('Progress tracker server side rendering', async () => {
  (await getExamplesFor('progress-tracker')).forEach(examples => {
    expect(
      () =>
        // $StringLitteral
        ReactDOMServer.renderToString(require(examples.filePath).default), // eslint-disable-line
    ).not.toThrowError();
  });
});
