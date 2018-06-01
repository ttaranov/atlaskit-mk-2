// @flow
// eslint-disable-next-line
import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
// eslint-disable-next-line
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import * as assert from 'assert';

const urlStatus = getExampleUrl('stride', 'stride-status', 'basic');
const statusDropdown = '#examples [role="button"]';
const statusDropdownMenu = '[data-role="droplistContent"]';
const statusField = '[type="text"]';
const logOutBtn = '[type="button"]';

BrowserTestCase(
  'Clicking on avatar stride status should display the dropdown status and no errors',
  async client => {
    const statusTest = await new Page(client);
    await statusTest.goto(urlStatus);
    await statusTest.click(statusDropdown);
    await statusTest.waitForSelector(urlStatus);
    await statusTest.click(statusDropdown);
    const isMenuVisible = await statusTest.isVisible(statusDropdownMenu);
    const isStatusFieldVisible = await statusTest.isVisible(statusField);
    const isLogOutBtn = await statusTest.isVisible(logOutBtn);
    // eslint-disable-next-line
    expect(isMenuVisible).toBe(true);
    expect(isStatusFieldVisible).toBe(true);
    expect(isLogOutBtn).toBe(true);
    if (statusTest.log('browser').value) {
      statusTest.log('browser').value.forEach(val => {
        assert.notEqual(
          val.level,
          'SEVERE',
          `Console errors :${val.message} when clicked on the dropdown status`,
        );
      });
    }
  },
);
