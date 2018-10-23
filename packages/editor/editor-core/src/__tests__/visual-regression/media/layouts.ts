import {
  initEditor,
  snapshot,
  insertMedia,
  editable,
  setupMediaMocksProviders,
} from '../_utils';

const mediaSingleLayouts = {
  center: 'Center',
  'wrap-left': 'Wrap left',
  'wrap-right': 'Wrap right',
  wide: 'Wide',
  'full-width': 'Full width',
};

describe('Snapshot Test: Media', () => {
  let page;
  beforeAll(async () => {
    // @ts-ignore
    page = global.page;
    await initEditor(page, 'full-page-with-toolbar');
    await setupMediaMocksProviders(page);
  });
  // TODO: AK-5551
  describe.skip('Layouts', async () => {
    it('can switch layouts on media', async () => {
      // type some text
      await page.click(editable);
      await page.type(editable, 'some text');

      // now we can insert media as necessary
      await insertMedia(page);
      await page.waitForSelector('.media-single');

      // click it so the toolbar appears
      await page.click('.media-single div div div');

      // change layouts
      for (const layout of Object.keys(mediaSingleLayouts)) {
        const layoutButton = `[aria-label="${mediaSingleLayouts[layout]}"]`;
        await page.waitForSelector(layoutButton);
        await page.click(layoutButton);

        await page.waitForSelector(`.media-single.${layout}`);

        await snapshot(page);
      }
    });

    it('can switch layouts on individual media', async () => {
      // We need a bigger height to capture multiple large images in a row.
      await page.setViewport({ width: 1280, height: 1024 * 2 });

      // type some text
      await page.click(editable);
      await page.type(editable, 'some text');

      // now we can insert media as necessary
      await insertMedia(page, ['one.svg', 'two.svg']);
      await page.waitForSelector('.media-card');

      // click the *second one* so the toolbar appears
      await page.evaluate(() => {
        (document
          .querySelectorAll('.media-single')![1]
          .querySelector('div div div')! as HTMLElement).click();
      });

      // change layouts
      for (const layout of Object.keys(mediaSingleLayouts)) {
        const layoutButton = `[aria-label="${mediaSingleLayouts[layout]}"]`;
        await page.waitForSelector(layoutButton);
        await page.click(layoutButton);

        await page.waitForSelector(`.media-single.${layout}`);

        await snapshot(page);
      }
    });
  });
});
