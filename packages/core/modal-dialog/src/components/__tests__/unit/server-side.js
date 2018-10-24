/**
 * @jest-environment node
 */
// @flow
import React from 'react';
import { getExamplesFor } from '@atlaskit/build-utils/getExamples';
import ReactDOMServer from 'react-dom/server';
import Modal from '../../../../src';

test('Modal dialog server side rendering', async () => {
  (await getExamplesFor('modal-dialog')).forEach(examples => {
    // $StringLitteral
    const Example = require(examples.filePath).default; // eslint-disable-line import/no-dynamic-require
    expect(() => ReactDOMServer.renderToString(<Example />)).not.toThrowError();
  });
});

test('Modal dialog should render content in ssr', () => {
  const Content = jest.fn(() => 'Hello');
  const modalString = ReactDOMServer.renderToString(
    <Modal
      heading="Look at this"
      actions={[{ text: 'Close', onClick: () => {} }]}
    >
      <Content />
    </Modal>,
  );
  expect(Content).toHaveBeenCalled();
  expect(modalString).toContain('Close');
  expect(modalString).toContain('Look at this');
});
