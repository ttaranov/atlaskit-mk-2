// @flow
// eslint-disable-next-line
import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
// eslint-disable-next-line
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

const urlSingleSelect = `${
  global.__baseUrl__
}/mk-2/packages/elements/single-select/example/basic`;

const singleSelectDefault =
  '[role="dialog"] > div > div > div > div > div > div > div > div:nth-child(2)';
const singleSelectMenu = '[data-role="droplistContent"]';

BrowserTestCase(
  'AK-4173 - Single Select should display its menu once clicked on it',
  { skip: ['ie'] }, // Skipping the test till AK-4173 is not fixed
  async client => {
    const singleSelectTest = await new Page(client);
    await singleSelectTest.goto(urlSingleSelect);
    await singleSelectTest.click(singleSelectDefault);
    const menuIsVisible = await singleSelectTest.isVisible(singleSelectMenu);
    // eslint-disable-next-line
    expect(menuIsVisible).toBe(true);
  },
);
