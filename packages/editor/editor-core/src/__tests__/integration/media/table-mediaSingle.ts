import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import {
  editable,
  getDocFromElement,
  setupMediaMocksProviders,
  insertMedia,
  fullpage,
} from '../_helpers';
import { messages as insertBlockMessages } from '../../../plugins/insert-block/ui/ToolbarInsertBlock';

// FIXME: not entirely sure why firefox is flakey on browserstack
BrowserTestCase(
  'table-mediaSingle.ts: Can insert media single into table',
  { skip: ['edge', 'ie', 'safari', 'firefox'] },
  async client => {
    const browser = new Page(client);

    await browser.goto(fullpage.path);
    await browser.waitForSelector(editable);

    // prepare media
    await setupMediaMocksProviders(browser);

    await browser.click(editable);
    await browser.click(
      `[aria-label="${insertBlockMessages.table.defaultMessage}"]`,
    );

    // second cell
    await browser.type(editable, 'Down arrow');

    // now we can insert media as necessary
    await insertMedia(browser);

    const doc = await browser.$eval(editable, getDocFromElement);
    expect(doc).toMatchDocSnapshot();
  },
);
