import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import {
  editable,
  getDocFromElement,
  setupMediaMocksProviders,
  insertMedia,
  fullpage,
} from '../_helpers';
import { sleep } from '@atlaskit/editor-test-helpers';

BrowserTestCase(
  'Inserts a media single on fullpage',
  { skip: ['edge', 'ie', 'safari'] },
  async client => {
    const browser = await new Page(client);

    await browser.goto(fullpage.path);
    await browser.waitForSelector(editable);

    // prepare media
    await setupMediaMocksProviders(browser);

    // type some text
    await browser.click(editable);
    await browser.type(editable, 'some text');

    // now we can insert media as necessary
    await insertMedia(browser);

    // wait for "upload" and finish doc sync
    await sleep(200);
    await browser.waitForSelector('.media-single');
    expect(await browser.isVisible('.media-single')).toBe(true);

    const doc = await browser.$eval(editable, getDocFromElement);
    expect(doc).toMatchDocSnapshot();
  },
);
