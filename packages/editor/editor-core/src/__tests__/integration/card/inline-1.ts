import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import {
  getDocFromElement,
  fullpage,
  editable,
  clipboardHelper,
  copyAsPlaintextButton,
  clipboardInput,
} from '../_helpers';

[fullpage].forEach(editor => {
  BrowserTestCase(
    `inline-1.ts: pasting an link converts to inline card`,
    {
      skip: ['chrome', 'ie', 'safari'],
    },
    async client => {
      let browser = new Page(client);

      // copy stuff to clipboard
      await browser.goto(clipboardHelper);
      await browser.isVisible(clipboardInput);
      await browser.type(clipboardInput, 'https://www.atlassian.com');
      await browser.click(copyAsPlaintextButton);

      // open up editor
      await browser.goto(editor.path);
      await browser.waitForSelector(editor.placeholder);
      await browser.click(editor.placeholder);
      await browser.waitForSelector(editable);

      // type some text into the paragraph first
      await browser.type(editable, 'hello have a link ');

      // paste the link
      await browser.paste(editable);

      // selectors on the nodeview do not work correctly in chrome
      await browser.waitForSelector('.inlineCardView-content-wrap');

      const doc = await browser.$eval(editable, getDocFromElement);
      expect(doc).toMatchDocSnapshot();
    },
  );
});
