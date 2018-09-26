import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import { messages } from '../../../plugins/lists/ui/ToolbarLists';

import {
  getDocFromElement,
  fullpage,
  editable,
  quickInsert,
} from '../_helpers';

BrowserTestCase(
  `Extension: Quick Insert`,
  { skip: ['edge', 'ie', 'safari'] },
  async client => {
    const page = await new Page(client);
    await page.goto(fullpage.path);
    await page.waitForSelector(fullpage.placeholder);
    await page.click(fullpage.placeholder);

    await quickInsert(page, 'Bodied extension');
    await quickInsert(page, messages.action.defaultMessage);

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchDocSnapshot();
  },
);
