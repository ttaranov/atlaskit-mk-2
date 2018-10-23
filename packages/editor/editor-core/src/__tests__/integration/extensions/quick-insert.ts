import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import { messages } from '../../../plugins/insert-block/ui/ToolbarInsertBlock';

import {
  getDocFromElement,
  fullpage,
  editable,
  quickInsert,
} from '../_helpers';

BrowserTestCase(
  `quick-insert.ts: Extension: Quick Insert`,
  { skip: ['edge', 'ie', 'safari'] },
  async client => {
    const page = new Page(client);
    await page.goto(fullpage.path);
    await page.waitForSelector(fullpage.placeholder);
    await page.click(fullpage.placeholder);

    await quickInsert(page, 'Bodied');
    await quickInsert(page, messages.action.defaultMessage);

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchDocSnapshot();
  },
);
