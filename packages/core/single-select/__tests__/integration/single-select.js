// @flow
// eslint-disable-next-line
import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
// eslint-disable-next-line
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

const urlSingleSelect = `${
  global.__baseUrl__
}/examples.html?groupId=core&packageId=single-select&exampleId=basic`;

const singleSelectDefault =
  '#examples > div > div > div > div:nth-child(2) > div > div > div:nth-child(1) > div > div > div';
const singleSelectMenu = '[data-role="droplistContent"]';

BrowserTestCase(
  'AK-4173 - Single Select should display its menu once clicked on it',
  async client => {
    const singleSelectTest = await new Page(client);
    await singleSelectTest.goto(urlSingleSelect);
    await singleSelectTest.click(singleSelectDefault);
    const menuIsVisible = await singleSelectTest.isVisible(singleSelectMenu);
    // eslint-disable-next-line
    expect(menuIsVisible).toBe(true);
  },
);
