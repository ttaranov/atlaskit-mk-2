import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import { messages } from '../../../plugins/lists/ui/ToolbarLists';

import {
  getDocFromElement,
  fullpage,
  editable,
  quickInsert,
} from '../_helpers';

/* This is used to identify test case in Browserstack */
process.env.TEST_FILE = __filename
  .split('/')
  .reverse()[0]
  .split('.')[0];

BrowserTestCase(
  `Extension: Quick Insert`,
  { skip: ['edge', 'ie', 'safari'] },
  async client => {
    const page = new Page(client);
    await page.goto(fullpage.path);
    await page.waitForSelector(fullpage.placeholder);
    await page.click(fullpage.placeholder);

    await quickInsert(page, 'Bodied extension');
    await quickInsert(page, messages.action.defaultMessage);

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchDocSnapshot();
  },
);
