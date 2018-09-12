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
  'Can change media single to full-width layout on fullpage',
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

    // wait for the nodeview to appear

    await sleep(500);
    await browser.waitForSelector('.wrapper .img-wrapper');

    // click it so the toolbar appears
    await browser.click('.media-single div div div');
    await sleep(200);

    // change layouts
    const layoutButton = `button [aria-label="Change layout to Full width"]`;
    await browser.waitForSelector(layoutButton);

    // Eval instead of click as sugessted here: http://webdriver.io/api/action/click.html
    await browser.$eval(
      layoutButton,
      `function(elem) {
        elem.click();
      }`,
    );

    await browser.waitForSelector(`.media-single.full-width`);

    const doc = await browser.$eval(editable, getDocFromElement);
    expect(doc).toMatchDocSnapshot();
  },
);
