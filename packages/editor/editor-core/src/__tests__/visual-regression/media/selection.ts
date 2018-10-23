import {
  initEditor,
  snapshot,
  insertMedia,
  setupMediaMocksProviders,
  editable,
} from '../_utils';

describe('Snapshot Test: Media', () => {
  // TODO: fix this for fullpage editor mode
  describe.skip('full page editor', () => {
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

      // insert single media item
      await insertMedia(page);
    });

    it('renders selection ring around media (via up)', async () => {
      await snapshot(page);
      await page.keyboard.down('ArrowUp');
      await snapshot(page);
    });

    it('renders selection ring around media (via gap cursor)', async () => {
      await page.keyboard.down('ArrowLeft');
      await page.keyboard.down('ArrowLeft');
      await snapshot(page);

      await page.keyboard.down('ArrowLeft');
      await snapshot(page);
    });
  });

  describe('comment editor', () => {
    let page;
    beforeEach(async () => {
      // @ts-ignore
      page = global.page;

      await initEditor(page, 'comment');
      await setupMediaMocksProviders(page);

      // click into the editor
      await page.waitForSelector(editable);
      await page.click(editable);

      // insert 3 media items
      await insertMedia(page, ['one.svg', 'two.svg', 'three.svg']);
    });

    it('renders selection ring around last media group item (via up)', async () => {
      await snapshot(page);

      await page.keyboard.down('ArrowUp');
      await snapshot(page);
    });

    it('renders selection ring around media group items', async () => {
      await snapshot(page);

      await page.keyboard.down('ArrowLeft');
      await page.keyboard.down('ArrowLeft');
      await snapshot(page);

      await page.keyboard.down('ArrowLeft');
      await snapshot(page);

      await page.keyboard.down('ArrowLeft');
      await snapshot(page);
    });
  });
});
