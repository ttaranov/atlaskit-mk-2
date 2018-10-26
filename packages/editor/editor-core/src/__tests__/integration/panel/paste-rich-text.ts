import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

import {
  editable,
  getDocFromElement,
  fullpage,
  quickInsert,
  clipboardHelper,
  clipboardInput,
  copyAsHTMLButton,
} from '../_helpers';

BrowserTestCase(
  'paste-rich-text.ts: Paste rich text into panel',
  { skip: ['ie', 'edge', 'safari'] },
  async client => {
    const browser = new Page(client);
    await browser.goto(clipboardHelper);
    await browser.isVisible(clipboardInput);
    await browser.type(
      clipboardInput,
      '<p>this is a link <a href="http://www.google.com">www.google.com</a></p><p>more elements with some <strong>format</strong></p><p>some addition<em> formatting</em></p>',
    );
    await browser.click(copyAsHTMLButton);

    await browser.goto(fullpage.path);
    await browser.waitForSelector(editable);

    await browser.click(editable);
    await quickInsert(browser, 'Panel');

    await browser.paste(editable);

    const doc = await browser.$eval(editable, getDocFromElement);
    expect(doc).toMatchDocSnapshot();
  },
);
