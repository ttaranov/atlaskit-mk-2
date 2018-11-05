import { initEditor, snapshot } from '../_utils';
import { resizeColumn, insertColumn, deleteColumn } from './_table-utils';
import { TableCssClassName as ClassName } from '../../../plugins/table/types';

describe('Snapshot Test: table resizing', () => {
  describe('Re-sizing', () => {
    let page;
    beforeEach(async () => {
      // @ts-ignore
      page = global.page;
      await initEditor(page, 'table-flexi-resizing');
      await page.setViewport({ width: 1280, height: 1024 });
      // Focus the table
      await page.click('table tr td');
    });

    it(`resize a column with content width`, async () => {
      await snapshot(page);
      await resizeColumn(page, { colIdx: 2, amount: 123, row: 2 });
      await snapshot(page);
      await resizeColumn(page, { colIdx: 2, amount: -100, row: 2 });
      await snapshot(page);
    });

    // TODO: https://product-fabric.atlassian.net/browse/ED-5688
    it.skip(`snaps back to layout width after column removal`, async () => {
      await snapshot(page);
      await deleteColumn(page, 1);
      await snapshot(page);
    });

    it('overflow table', async () => {
      await snapshot(page);
      await resizeColumn(page, { colIdx: 2, amount: 500, row: 2 });
      await snapshot(page);

      // Scroll to the end of col we are about to resize
      // Its in overflow.
      await page.evaluate(ClassName => {
        const element = document.querySelector(
          `.${ClassName.TABLE_NODE_WRAPPER}`,
        ) as HTMLElement;

        if (element) {
          element.scrollTo(element.offsetWidth, 0);
        }
      }, ClassName);

      await resizeColumn(page, { colIdx: 2, amount: -550, row: 2 });

      // Scroll back so we can see the result of our resize.
      await page.evaluate(ClassName => {
        const element = document.querySelector(
          `.${ClassName.TABLE_NODE_WRAPPER}`,
        ) as HTMLElement;

        if (element) {
          element.scrollTo(0, 0);
        }
      }, ClassName);

      await snapshot(page);
    });

    // TODO This test can be merged with column adding above once this is the main table re-sizing.
    // TODO: https://product-fabric.atlassian.net/browse/ED-5688
    it.skip('Add a column', async () => {
      await snapshot(page);
      await insertColumn(page, 1);
      await snapshot(page);
    });
  });
});
