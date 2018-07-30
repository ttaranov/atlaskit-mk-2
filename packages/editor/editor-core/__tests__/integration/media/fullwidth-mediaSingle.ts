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

const mediaSingleLayouts = {
  center: 'Align center',
  'wrap-left': 'Align left',
  'wrap-right': 'Align right',
  wide: 'Wide',
  'full-width': 'Full width',
};

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
    await insertFirstMedia(browser);

    // wait for the nodeview to appear
    await browser.waitForSelector('.media-single');

    await sleep(400);

    // click it so the toolbar appears
    await browser.click('.media-single div div div');

    // change layouts
    for (const layout of Object.keys(mediaSingleLayouts)) {
      const layoutButton = `[aria-label="Change layout to ${
        mediaSingleLayouts[layout]
      }"]`;
      await browser.waitForSelector(layoutButton);
      await browser.click(layoutButton);

      await browser.waitForSelector(`.media-single.${layout}`);

      const doc = await browser.$eval(editable, getDocFromElement);

      // FIXME: our override only supports a single snapshot per test :(
      // leaving this here so we can grab this code for the visual regression tests
      expect(doc).toMatchDocSnapshot();
    }
  },
);
