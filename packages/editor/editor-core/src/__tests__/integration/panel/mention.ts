import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

import {
  editable,
  getDocFromElement,
  fullpage,
  quickInsert,
  insertMentionUsingClick,
} from '../_helpers';

BrowserTestCase(
  'mention.ts: Can insert mention inside panel using click',
  { skip: ['ie', 'edge', 'safari'] },
  async client => {
    const browser = new Page(client);

    await browser.goto(fullpage.path);
    await browser.waitFor(editable);
    await browser.click(editable);
    await quickInsert(browser, 'Panel');

    await insertMentionUsingClick(browser, '0');
    const doc = await browser.$eval(editable, getDocFromElement);
    expect(doc).toMatchDocSnapshot();
  },
);
