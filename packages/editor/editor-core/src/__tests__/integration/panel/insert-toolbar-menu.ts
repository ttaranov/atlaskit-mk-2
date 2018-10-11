import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

import {
  editable,
  getDocFromElement,
  fullpage,
  insertBlockMenuItem,
} from '../_helpers';

BrowserTestCase(
  'insert-toolbar-menu.ts: Insert panel via toolbar menu',
  { skip: ['ie'] },
  async client => {
    const browser = new Page(client);

    await browser.goto(fullpage.path);
    await browser.waitForSelector(editable);
    await browser.click(editable);

    await insertBlockMenuItem(browser, 'Panel');

    await browser.type(editable, 'this text should be in the panel');

    const doc = await browser.$eval(editable, getDocFromElement);
    expect(doc).toMatchDocSnapshot();
  },
);
