import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import {
  editable,
  getDocFromElement,
  setupMediaMocksProviders,
  message,
  comment,
  insertFirstMedia,
} from '../_helpers';

[comment, message].forEach(editor => {
  BrowserTestCase(
    `Inserts a media group on ${editor.name}`,
    { skip: ['edge', 'ie'] },
    async client => {
      const browser = await new Page(client);

      await browser.goto(editor.path);
      await browser.click(editor.placeholder);

      // prepare media
      await setupMediaMocksProviders(browser);

      await browser.click(editable);
      await browser.type(editable, 'some text');

      // now we can insert media as necessary
      await insertFirstMedia(browser);

      // wait for the nodeview to appear
      await browser.waitForSelector('.media-card');
      expect(await browser.isVisible('.media-card')).toBe(true);

      const doc = await browser.$eval(editable, getDocFromElement);
      expect(doc).toMatchDocSnapshot();
    },
  );
});
