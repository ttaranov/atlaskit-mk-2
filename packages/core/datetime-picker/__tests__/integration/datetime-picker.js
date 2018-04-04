// @flow
// eslint-disable-next-line
import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
// eslint-disable-next-line
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
// import * as assert from 'assert';

const urlSelect = getExampleUrl('core', 'datetime-picker', 'basic');
const selectDefault = '.react-select__control';
const dateSelector = 'div=15';
const selectValueSelector = '.react-select__single-value';

BrowserTestCase(
  `Datepicker should update select after selecting date`,
  {
    edge: true,
    ie: true,
    safari: true,
    firefox: true,
    skip: ['edge', 'ie', 'safari', 'firefox'],
  },
  async client => {
    const page = await new Page(client);
    await page.goto(urlSelect);
    await page.waitForSelector(selectDefault);
    await page.click(selectDefault);
    const dateIsVisible = await page.isVisible(dateSelector);
    // eslint-disable-next-line
    expect(dateIsVisible).toBe(true);
    await page.click(dateSelector);
    const selectValue = await page.getText(selectValueSelector);
    expect(selectValue).toBe('2018/04/15');

    const logs = await page.log('browser');

    console.log(logs);
  },
);
