import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import {
  editable,
  getDocFromElement,
  setupMediaMocksProviders,
  message,
  comment,
  insertMedia,
} from '../_helpers';

[comment, message].forEach(editor => {
  BrowserTestCase(
    `insert-mediaGroup.ts: Inserts a media group on ${editor.name}`,
    { skip: ['edge', 'ie', 'safari'] },
    async client => {
      const browser = new Page(client);

      await browser.goto(editor.path);
      await browser.click(editor.placeholder);

      // prepare media
      await setupMediaMocksProviders(browser);

      await browser.click(editable);
      await browser.type(editable, 'some text');

      // now we can insert media as necessary
      await insertMedia(browser);

      expect(await browser.isVisible('.wrapper')).toBe(true);

      const doc = await browser.$eval(editable, getDocFromElement);
      expect(doc).toMatchDocSnapshot();
    },
  );
});
