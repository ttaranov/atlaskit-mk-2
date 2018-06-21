// @flow
import {
  getExampleUrl,
  removeOldProdSnapshots,
} from '@atlaskit/visual-regression/helper';

const path = require('path');

const imageSnapshotFolder = path.resolve(__dirname, `__image_snapshots__`);

describe('Snapshot Test', () => {
  beforeAll(async () => {
    removeOldProdSnapshots(imageSnapshotFolder);
  });

  it('editor core-should match prod', async () => {
    const url = getExampleUrl(
      'editor',
      'editor-core',
      'comment',
      global.__BASEURL__,
    );
    const browser = global.page;
    const editor = '.ProseMirror';
    const placeholder = 'input[placeholder="What do you want to say?"]';
    const bold = 'span[aria-label="Bold"]';
    const italics = 'span[aria-label="Italic"]';
    const advanceFormatting =
      'span[aria-label="Open or close advance text formatting dropdown"]';

    await browser.goto(url);
    await browser.waitForSelector(placeholder);
    await browser.click(placeholder);
    await browser.waitForSelector(editor);
    await browser.click(bold);
    await browser.click(italics);
    await browser.click(advanceFormatting);

    const image = await browser.screenshot();
    //$FlowFixMe
    expect(image).toMatchProdImageSnapshot();
  });
});
