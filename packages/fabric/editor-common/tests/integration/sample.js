// @flow
// eslint-disable-next-line
import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';

//TODO: Fix flow and lint
// $FlowFixMe
BrowserTestCase(
  'should skip test on one browser',
  { skip: ['ie', 'edge', 'firefox'] },
  async client => {
    await client.url('http://google.com/');
    const title = await client.getTitle();
    // eslint-disable-next-line
    expect(title).toBe('Google');
  },
);

BrowserTestCase('more tests', async client => {
  await client.url('http://google.com/');
  const title = await client.getTitle();
  // eslint-disable-next-line
  expect(title).toBe('Google');
});
