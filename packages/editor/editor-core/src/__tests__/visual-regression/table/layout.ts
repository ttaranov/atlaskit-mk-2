import { initEditor, clearEditor, insertTable, snapshot } from '../_utils';
import { TableCssClassName as ClassName } from '../../../plugins/table/types';
import { insertColumn, setTableLayout } from './_table-utils';

describe('Snapshot Test: table layout', () => {
  let page;

  describe(`Full page`, () => {
    beforeAll(async () => {
      // @ts-ignore
      page = global.page;
      await initEditor(page, 'full-page');
    });

    beforeEach(async () => {
      await clearEditor(page);
      await insertTable(page);
    });

    ['wide', 'full-width'].forEach(layout => {
      it(`${layout} layout`, async () => {
        await page.setViewport({ width: 1280, height: 1024 });
        await setTableLayout(page, layout);
        await snapshot(page);
      });
    });
    it(`remove row buttons in full width layout mode`, async () => {
      await page.setViewport({ width: 1280, height: 1024 });
      await setTableLayout(page, 'full-width');
      await page.waitForSelector(
        `.ProseMirror table[data-layout="full-width"]`,
      );

      await page.click(
        `.${ClassName.ROW_CONTROLS_BUTTON_WRAP}:nth-child(1) button`,
      );
      await page.hover(`button[title="Remove row"]`);
      await page.waitForSelector('.ProseMirror table .danger');
      await snapshot(page);
    });

    it('table with scroll', async () => {
      for (let k = 0; k < 3; k++) {
        await insertColumn(page);
      }
      await page.click('table tr td:nth-child(1) p');
      await page.evaluate(ClassName => {
        document.querySelector(
          `.ProseMirror .${ClassName.TABLE_NODE_WRAPPER}`,
        )!.scrollLeft = 3;
      }, ClassName);
      await snapshot(page);
      await page.evaluate(ClassName => {
        document.querySelector(
          `.ProseMirror .${ClassName.TABLE_NODE_WRAPPER}`,
        )!.scrollLeft = 150;
      }, ClassName);
      await snapshot(page);
      await page.evaluate(ClassName => {
        document.querySelector(
          `.ProseMirror .${ClassName.TABLE_NODE_WRAPPER}`,
        )!.scrollLeft = 300;
      }, ClassName);
      await snapshot(page);
    });
  });
});
