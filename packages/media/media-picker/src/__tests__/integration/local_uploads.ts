import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

BrowserTestCase(
  'MediaPicker: local upload',
  { skip: ['edge', 'ie', 'safari', 'firefox'] },
  async client => {
    const browser = await new Page(client);
    const url = getExampleUrl('media', 'media-picker', 'popup');

    await browser.goto(url);
    await browser.waitForSelector('.show-button');
    await browser.click('.show-button');

    // const file = path.join(__dirname, '..', '..', 'fixtures', 'cat-to-upload.gif')
    // const file = '';

    // browser.chooseFile('#upload-test', file);
  },
);
