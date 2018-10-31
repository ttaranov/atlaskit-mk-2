import {
  initEditor,
  clearEditor,
  insertTable,
  snapshot,
  getSelectorForTableCell,
} from '../_utils';
import { clickInContextMenu } from './_table-utils';
import { TableCssClassName as ClassName } from '../../../plugins/table/types';
import { messages as contextualMenuMessages } from '../../../plugins/table/ui/FloatingContextualMenu/ContextualMenu';

describe('Snapshot Test: table context menu', () => {
  let page;
  ['full-page'].forEach(appearance => {
    describe(`${appearance}`, () => {
      beforeAll(async () => {
        // @ts-ignore
        page = global.page;
        await initEditor(page, appearance);
      });

      beforeEach(async () => {
        await clearEditor(page);
        await insertTable(page);
      });

      ['row', 'column', 'row+col'].forEach(type => {
        it(`${type} merge and split`, async () => {
          let firstCellSelector = getSelectorForTableCell({
            row: 1,
            cell: 1,
            cellType: 'th',
          });
          let lastCellSelector = getSelectorForTableCell({ row: 3, cell: 1 });

          if (type === 'column') {
            firstCellSelector = getSelectorForTableCell({ row: 2, cell: 1 });
            lastCellSelector = getSelectorForTableCell({ row: 2, cell: 3 });
          } else if (type === 'row+col') {
            firstCellSelector = getSelectorForTableCell({ row: 2, cell: 1 });
            lastCellSelector = getSelectorForTableCell({ row: 3, cell: 2 });
          }

          await page.click(firstCellSelector);
          await page.keyboard.down('Shift');
          await page.click(lastCellSelector);
          await page.keyboard.up('Shift');
          await page.waitForSelector(
            `.ProseMirror table .${ClassName.SELECTED_CELL}`,
          );
          await snapshot(page);
          await clickInContextMenu(
            page,
            contextualMenuMessages.mergeCells.defaultMessage,
          );
          await snapshot(page);

          await page.click(firstCellSelector);
          await clickInContextMenu(
            page,
            contextualMenuMessages.splitCell.defaultMessage,
          );
          await snapshot(page);
        });
      });
    });
  });

  describe('Cell background', () => {
    beforeAll(async () => {
      // @ts-ignore
      page = global.page;
      await initEditor(page, 'full-page');
    });

    beforeEach(async () => {
      await clearEditor(page);
      await insertTable(page);
      await page.keyboard.press('Escape');
    });

    it('shows the submenu on the right', async () => {
      await page.click(
        getSelectorForTableCell({ row: 1, cell: 1, cellType: 'th' }),
      );
      await clickInContextMenu(
        page,
        contextualMenuMessages.cellBackground.defaultMessage,
      );
      await snapshot(page);
    });

    it('Submenu shows on the left if there is no available space', async () => {
      await page.click(
        getSelectorForTableCell({ row: 1, cell: 3, cellType: 'th' }),
      );
      await clickInContextMenu(
        page,
        contextualMenuMessages.cellBackground.defaultMessage,
      );
      await snapshot(page);
    });
  });
});
