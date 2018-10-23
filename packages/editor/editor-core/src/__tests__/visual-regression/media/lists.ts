import {
  initEditor,
  snapshot,
  insertMedia,
  editable,
  setupMediaMocksProviders,
} from '../_utils';

describe('Snapshot Test: Media', () => {
  let page;
  beforeAll(async () => {
    // @ts-ignore
    page = global.page;
    await initEditor(page, 'full-page-with-toolbar');
    await page.setViewport({ width: 1920, height: 1080 });
    await setupMediaMocksProviders(page);

    // click into the editor
    await page.waitForSelector(editable);
    await page.click(editable);

    // prepare media
    await setupMediaMocksProviders(page);
  });

  afterEach(async () => {
    const image = await page.screenshot();
    // @ts-ignore
    expect(image).toMatchProdImageSnapshot();
  });
  // TODO: AK-5551
  describe.skip('Lists', async () => {
    it('can insert a media single inside a bullet list', async () => {
      // type some text
      await page.click(editable);
      await page.type(editable, '* ');

      // now we can insert media as necessary
      await insertMedia(page);
      await page.waitForSelector('.media-card');
      await snapshot(page);
    });

    it('can insert a media single inside a numbered list', async () => {
      // type some text
      await page.click(editable);
      await page.type(editable, '1. ');

      // now we can insert media as necessary
      await insertMedia(page);
      await page.waitForSelector('.media-card');
      await snapshot(page);
    });
  });
});
