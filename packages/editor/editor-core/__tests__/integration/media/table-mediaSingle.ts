import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import {
  editable,
  getDocFromElement,
  setupMediaMocksProviders,
  insertFirstMedia,
  fullpage,
} from '../_helpers';
import { sleep } from '@atlaskit/editor-test-helpers';

BrowserTestCase(
  'Can insert media single into table',
  { skip: ['edge', 'ie'] },
  async client => {
    const browser = await new Page(client);

    await browser.goto(fullpage.path);
    await browser.waitForSelector(editable);

    // prepare media
    await setupMediaMocksProviders(browser);

    await browser.click(editable);
    await browser.click('[aria-label="Insert table"]');

    // second cell
    await browser.type(editable, 'Down arrow');

    // now we can insert media as necessary
    await insertFirstMedia(browser);

    // wait for "upload" and finish doc sync
    await sleep(200);
    await browser.waitForSelector('.media-single');

    const doc = await browser.$eval(editable, getDocFromElement);
    expect(doc).toMatchDocSnapshot();
  },
);
