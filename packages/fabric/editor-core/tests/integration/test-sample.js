// @flow

//replace the path with @atlaskit/bolt-webdriver-runner once we have a package.
import { BrowserTestCase } from '../../../../../build/webdriver-runner/runner';
import Page from '../../../../../build/webdriver-runner/wd-wrapper';

//TODO: Fix flow and lint
// $FlowFixMe
BrowserTestCase('should get title on one browser', async client => {
  const sample = await new Page(client);
  await sample.goto('http://localhost:9000/');
  const title = await sample.getTitle();
  // eslint-disable-next-line
  expect(title).toBe('Atlaskit by Atlassian');
});
