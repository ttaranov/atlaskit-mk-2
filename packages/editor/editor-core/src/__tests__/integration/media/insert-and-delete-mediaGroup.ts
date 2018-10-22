import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import {
  editable,
  setupMediaMocksProviders,
  message,
  comment,
  insertMedia,
} from '../_helpers';

[comment, message].forEach(editor => {
  BrowserTestCase(
    `insert-and-delete-mediaGroup.ts: Inserts and deletes media group on ${
      editor.name
    }`,
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
      await insertMedia(browser, ['one.svg', 'two.svg']);

      // wait for the nodeview to appear
      await browser.waitForSelector('.wrapper .image');
      expect(await browser.count('.wrapper .image')).toBe(2);

      // TODO: check ADF

      // okay, delete the first
      await browser.click('.wrapper .image');
      await browser.click('.image [aria-label="delete"]');

      expect(await browser.count('.wrapper .image')).toBe(1);

      // TODO: check ADF

      await browser.click('.wrapper .image');
      await browser.click('.image [aria-label="delete"]');

      expect(await browser.count('.wrapper .image')).toBe(0);

      // TODO: check ADF
    },
  );
});
