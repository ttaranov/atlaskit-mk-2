import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

import {
  editable,
  getDocFromElement,
  fullpage,
  quickInsert,
} from '../_helpers';
import { messages as insertBlockMessages } from '../../../plugins/insert-block/ui/ToolbarInsertBlock';

BrowserTestCase(
  'inside-table.ts: Insert panel into table, add text, change panel type',
  { skip: ['edge', 'ie'] },
  async client => {
    const insertTableMenu = `[aria-label="${
      insertBlockMessages.table.defaultMessage
    }"]`;
    const tableControls = '[aria-label="Table floating controls"]';

    const browser = new Page(client);

    await browser.goto(fullpage.path);
    await browser.waitForSelector(editable);
    await browser.click(editable);
    await browser.click(insertTableMenu);
    await browser.waitForSelector(tableControls);

    await quickInsert(browser, 'Panel');

    // type some text
    await browser.type(editable, 'this text should be in the panel');

    // click on Error label
    const selector = `[aria-label="Error"]`;
    await browser.click(selector);

    const doc = await browser.$eval(editable, getDocFromElement);
    expect(doc).toMatchDocSnapshot();
    expect(await browser.isExisting(tableControls)).toBe(false);
    expect(await browser.isVisible(tableControls)).toBe(false);
  },
);
