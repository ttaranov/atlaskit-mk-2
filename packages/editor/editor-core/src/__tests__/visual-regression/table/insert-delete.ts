import {
  initEditor,
  clearEditor,
  insertTable,
  snapshot,
  getSelectorForTableCell,
} from '../_utils';
import { TableSharedCssClassName as SharedClassName } from '@atlaskit/editor-common';
import commonMessages from '../../../messages';
import { TableCssClassName as ClassName } from '../../../plugins/table/types';
import {
  insertRowOrColumn,
  getSelectorForTableControl,
  getInsertClass,
} from './_table-utils';

describe('Snapshot Test: table insert/delete', () => {
  ['full-page', 'comment'].forEach(appearance => {
    let page;

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

      it('insert table', async () => {
        await snapshot(page);
      });

      it('trash icon', async () => {
        const buttonSelector = `span[aria-label="${
          commonMessages.remove.defaultMessage
        }"]`;
        await page.hover(buttonSelector);
        await page.waitForSelector('.ProseMirror table td.danger');
        await snapshot(page);
        await page.click(buttonSelector);
        await snapshot(page);
      });

      ['row', 'column'].forEach(type => {
        it(`5 ${type}s added`, async () => {
          for (let k = 0; k < 5; k++) {
            await insertRowOrColumn(page, type, 1);
          }

          await page.click(
            `${getSelectorForTableCell({ row: 1, cell: 1, cellType: 'th' })} p`,
          );
          await snapshot(page);
        });

        for (let i = 1; i <= 3; i++) {
          it('control button', async () => {
            const controlSelector = getSelectorForTableControl(type);
            await page.hover(`${controlSelector}:nth-child(${i})`);
            await page.waitForSelector(
              `.ProseMirror table .${ClassName.HOVERED_CELL}`,
            );
            await snapshot(page);
            await page.click(`${controlSelector} button`);
            await snapshot(page);
          });
          it(`add ${type} button at ${i} index`, async () => {
            const controlSelector = getSelectorForTableControl(type);
            const insertSelector = getInsertClass(type);
            const buttonSelector = `${controlSelector} .${insertSelector}`;
            await page.hover(`${controlSelector} > div`);
            await page.waitForSelector(buttonSelector);
            await snapshot(page);
            await page.click(buttonSelector);
            await page.click(`table td:nth-child(1) p`);
            await snapshot(page);
          });
          it(`remove ${type} button at ${i} index`, async () => {
            const removeButtonSelector = `.${ClassName.CONTROLS_DELETE_BUTTON}`;
            const controlSelector = getSelectorForTableControl(type, i);
            await page.click(`${controlSelector} button`);
            await page.hover(removeButtonSelector);
            await page.waitForSelector(
              `.${SharedClassName.TABLE_CONTAINER} .danger`,
            );
            await snapshot(page);
            await page.click(removeButtonSelector);
            await page.waitForSelector(
              `.${SharedClassName.TABLE_CONTAINER} .danger`,
              {
                hidden: true,
              },
            );
            await page.click(`table td:nth-child(1)`);
            await snapshot(page);
          });
        }
      });
    });
  });
});
