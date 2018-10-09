import { initEditor, insertMenuSelector, snapshot } from '../_utils';

describe('Snapshot Test: Extensions', () => {
  let page;
  beforeAll(async () => {
    // @ts-ignore
    page = global.page;
    await initEditor(page, 'full-page');
  });

  describe('Block Extensions: Selection', () => {
    it('should select the correct extension, when two extensions are direct siblings.', async () => {
      // Insert two block extensions after one another.
      for (let i = 0; i < 2; i++) {
        await page.click(insertMenuSelector);
        await page.click('.block-macro');
      }

      // Select the second extension.
      await page.click(
        '.ProseMirror .extensionView-content-wrap:nth-of-type(2) .extension-container',
      );
      await snapshot(page);
    });
  });
});
