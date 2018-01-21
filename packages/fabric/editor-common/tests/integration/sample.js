// @flow
// eslint-disable-next-line
import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';

const baseUrl = global.__baseUrl__;
BrowserTestCase(
  'should skip test on one browser',
  { skip: ['ie', 'edge', 'firefox', 'safari'] },
  async client => {
    await client.url('http://google.com/');
    const title = await client.getTitle();
    // eslint-disable-next-line
    expect(title).toBe('Google');
    console.log(baseUrl);
  },
);

BrowserTestCase('more tests', async client => {
  await client.url('http://google.com/');
  const title = await client.getTitle();
  // eslint-disable-next-line
  expect(title).toBe('Google');
});
