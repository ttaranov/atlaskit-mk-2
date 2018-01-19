// @flow
// eslint-disable-next-line
import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
// eslint-disable-next-line
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

//TODO: Fix flow and lint
// $FlowFixMe
BrowserTestCase('should get title on one browser', async client => {
  const sample = await new Page(client);
  await sample.goto('http://localhost:9000/');
  const title = await sample.getTitle();
  // eslint-disable-next-line
  expect(title).toBe('Atlaskit by Atlassian');
});
