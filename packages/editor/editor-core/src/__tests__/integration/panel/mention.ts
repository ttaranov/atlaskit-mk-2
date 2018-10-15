import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

import {
  editable,
  getDocFromElement,
  fullpage,
  quickInsert,
} from '../_helpers';

import { insertMentionUsingClick } from '../message-renderer/_mention-helpers';

BrowserTestCase(
  'can insert mention into panel using click',
  { skip: ['ie', 'safari', 'edge'] },
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
