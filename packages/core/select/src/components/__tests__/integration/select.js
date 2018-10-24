// @flow
import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

const urlSelect = getExampleUrl('core', 'select');
const selectDefault = '.react-select__control';
const selectMenu = '.react-select__menu';

const urlArray = [
  'single-select',
  'multi-select',
  'radio-select',
  'async-select-with-callback',
];

urlArray.forEach(url => {
  BrowserTestCase(
    `select.js: ${url.toUpperCase()} should display its menu once clicked on it and no errors`,
    { skip: ['firefox'] },
    async client => {
      const selectTest = new Page(client);
      await selectTest.goto(urlSelect + url);
      await selectTest.waitForSelector(selectDefault);
      await selectTest.click(selectDefault);
      const menuIsVisible = await selectTest.isVisible(selectMenu);
      expect(menuIsVisible).toBe(true);
      await selectTest.checkConsoleErrors();
    },
  );
});
