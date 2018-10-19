import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import {
  editable,
  getDocFromElement,
  setupMediaMocksProviders,
  insertMedia,
  fullpage,
} from '../_helpers';
import commonMessages from '../../../messages';

BrowserTestCase(
  'layout-mediaSingle.ts: Can change media single to full-width layout on fullpage',
  { skip: ['edge', 'ie', 'safari'] },
  async client => {
    const browser = new Page(client);

    await browser.goto(fullpage.path);
    await browser.waitForSelector(editable);

    // prepare media
    await setupMediaMocksProviders(browser);

    // type some text
    await browser.click(editable);
    await browser.type(editable, 'some text');

    // now we can insert media as necessary
    await insertMedia(browser);

    // click it so the toolbar appears
    await browser.click('.media-single div div div');

    // change layouts
    const layoutButton = `[aria-label="${
      commonMessages.layoutFullWidth.defaultMessage
    }"]`;
    await browser.waitForSelector(layoutButton);
    await browser.click(layoutButton);

    await browser.waitForSelector(`.media-single.full-width`);

    const doc = await browser.$eval(editable, getDocFromElement);
    expect(doc).toMatchDocSnapshot();
  },
);
