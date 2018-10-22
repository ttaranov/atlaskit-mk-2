import {
  initEditor,
  snapshot,
  insertMedia,
  setupMediaMocksProviders,
  editable,
} from '../_utils';
import { messages as insertBlockMessages } from '../../../plugins/insert-block/ui/ToolbarInsertBlock';
// TODO: AK-5551
describe.skip('Snapshot Test: Media', () => {
  ['full-page-with-toolbar', 'comment'].forEach(editor => {
    describe(`${editor} editor`, () => {
      let page;
      beforeEach(async () => {
        // @ts-ignore
        page = global.page;
        await initEditor(page, editor);
        await setupMediaMocksProviders(page);

        // click into the editor
        await page.waitForSelector(editable);
        await page.click(editable);
      });

      afterEach(async () => {
        const image = await page.screenshot();
        // @ts-ignore
        expect(image).toMatchProdImageSnapshot();
      });

      describe('Tables', async () => {
        it('can insert into second row', async () => {
          await page.click(
            `[aria-label="${insertBlockMessages.table.defaultMessage}"]`,
          );

          // second cell
          // await page.click(editable);
          await page.keyboard.down('ArrowDown');

          // now we can insert media as necessary
          await insertMedia(page);
          await page.waitForSelector('.media-card');
          await snapshot(page);
        });
      });
    });
  });
});
