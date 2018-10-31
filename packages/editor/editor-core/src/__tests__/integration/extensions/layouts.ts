import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import {
  getDocFromElement,
  fullpage,
  editable,
  insertBlockMenuItem,
  changeSelectedNodeLayout,
} from '../_helpers';

import commonMessages from '../../../messages';

[
  commonMessages.layoutFixedWidth.defaultMessage,
  commonMessages.layoutWide.defaultMessage,
  commonMessages.layoutFullWidth.defaultMessage,
].forEach(async layoutName => {
  BrowserTestCase(
    `layouts.ts: Extension: ${layoutName} Layout`,
    { skip: ['edge', 'ie'] },
    async client => {
      const page = new Page(client);
      await page.goto(fullpage.path);
      await page.waitForSelector(fullpage.placeholder);
      await page.click(fullpage.placeholder);

      await insertBlockMenuItem(page, 'Block macro (EH)');
      await changeSelectedNodeLayout(page, layoutName);

      const doc = await page.$eval(editable, getDocFromElement);
      expect(doc).toMatchDocSnapshot();
    },
  );
});
