import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

import {
  editable,
  getDocFromElement,
  fullpage,
  quickInsert,
  clipboardHelper,
  clipboardInput,
  copyAsPlaintextButton,
} from '../_helpers';

BrowserTestCase(
  'paste-plain-text.ts: Paste plain text into panel',
  { skip: ['ie', 'edge', 'safari'] },
  async client => {
    const browser = new Page(client);
    await browser.goto(clipboardHelper);
    await browser.isVisible(clipboardInput);
    await browser.type(
      clipboardInput,
      'this is a link http://www.google.com more elements with some **format** some addition *formatting*',
    );
    await browser.click(copyAsPlaintextButton);

    await browser.goto(fullpage.path);
    await browser.waitForSelector(editable);

    await browser.click(editable);
    await quickInsert(browser, 'Panel');

    await browser.paste(editable);
    const doc = await browser.$eval(editable, getDocFromElement);
    expect(doc).toMatchDocSnapshot();
  },
);
