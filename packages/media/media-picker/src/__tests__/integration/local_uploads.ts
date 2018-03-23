import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
//getExampleUrl
import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

BrowserTestCase(
  'MediaPicker: local upload',
  { skip: ['edge', 'ie', 'safari', 'firefox'] },
  async client => {
    const browser = await new Page(client);
    const url = getExampleUrl('media', 'media-picker', 'popup');
    // const url = 'http://localhost:9000/examples/media/media-picker/popup';
    // const url = 'http://localhost:9000/examples.html?groupId=media&packageId=media-picker&exampleId=popup';
    // const url = 'http://localhost:9000/examples.html?groupId=media&packageId=popup&exampleId';
    // const url = 'http://localhost:9000/examples.html?groupId=editor&packageId=editor-core&exampleId';
    // examples/media/media-picker/popup
    // const url = ${global.__baseUrl__};
    await browser.goto(url);

    await browser.waitForSelector('.fjZrI');
    //inline code
    // <actual test code>
  },
);
