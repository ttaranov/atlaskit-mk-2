// @flow
// eslint-disable-next-line
import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
// eslint-disable-next-line
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import * as assert from 'assert';

const urlSelect = `${
  global.__baseUrl__
}/examples.html?groupId=core&packageId=select&exampleId=`;

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
    `${url.toUpperCase()} should display its menu once clicked on it and no errors`,
    async client => {
      const selectTest = await new Page(client);
      await selectTest.goto(urlSelect + url);
      await selectTest.waitForSelector(selectDefault);
      await selectTest.click(selectDefault);
      const menuIsVisible = await selectTest.isVisible(selectMenu);
      // eslint-disable-next-line
      expect(menuIsVisible).toBe(true);
      if (selectTest.log('browser').value) {
        selectTest.log('browser').value.forEach(val => {
          assert.notEqual(
            val.level,
            'SEVERE',
            `Console errors :${val.message} when visited ${url}`,
          );
        });
      }
    },
  );
});
