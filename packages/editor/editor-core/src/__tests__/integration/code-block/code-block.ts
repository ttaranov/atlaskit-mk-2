import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import {
  getDocFromElement,
  fullpage,
  editable,
  insertBlockMenuItem,
} from '../_helpers';

import { messages } from '../../../plugins/block-type/types';

const selectQuery =
  'div[aria-label="CodeBlock floating controls"] input[aria-autocomplete="list"]';

// https://product-fabric.atlassian.net/browse/ED-5564
// Fix wrong ADF for code block when language is selected
BrowserTestCase(
  'code-block: produces correct ADF after language change',
  { skip: ['ie', 'safari'] },
  async client => {
    const page = new Page(client);
    await page.goto(fullpage.path);
    await page.waitForSelector(fullpage.placeholder);
    await page.click(fullpage.placeholder);

    await insertBlockMenuItem(page, messages.codeblock.defaultMessage);
    await page.waitForSelector(selectQuery);
    await page.type(selectQuery, ['javascript', 'Return']);

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchDocSnapshot();
  },
);
