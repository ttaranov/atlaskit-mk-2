import * as path from 'path';
import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';

import { gotoPopupSimplePage } from '../../../pages/popup-simple-page';

/* This is used to identify test case in Browserstack */
process.env.TEST_FILE = __filename.split('/').reverse()[0];

BrowserTestCase(
  'MediaPicker: local upload',
  { skip: ['edge', 'ie', 'safari', 'firefox'] },
  async client => {
    const page = await gotoPopupSimplePage(client);
    const filename = 'popup.png';
    const localPath = path.join(__dirname, '..', '..', '..', 'docs', filename);

    expect(await page.getRecentUploadCards()).toHaveLength(10);

    await page.uploadFile(localPath);

    expect(await page.getRecentUploadCards()).toHaveLength(11);
    expect(await page.getRecentUploadCard(filename)).not.toBeUndefined();

    await page.clickInsertButton();

    expect(await page.getEvent('uploads-start')).toMatchObject({
      payload: { files: [{ name: filename }] },
    });

    expect(await page.getEvent('upload-end')).toMatchObject({
      payload: { file: { name: filename } },
    });
  },
);
