import { removeOldProdSnapshots } from '@atlaskit/visual-regression/helper';

import { imageSnapshotFolder, initEditor, clearEditor } from './_utils';

type CellSelectorOpts = {
  row: number;
  cell?: number;
  cellType?: 'td' | 'th';
};

type ResizeColumnOpts = {
  colIdx: number;
  amount: number;
  // Useful if a row has a colspan and you need resize a col it spans over.
  row?: number;
};

const insertTable = async page => {
  await page.click('span[aria-label="Insert table"]');
  await page.waitForSelector('table td p');
};

const snapshot = async page => {
  const image = await page.screenshot();
  // @ts-ignore
  expect(image).toMatchProdImageSnapshot();
};

const selectTableDisplayOption = async (page, optionSelector) => {
  await page.click('span[aria-label="Table display options"]');
  await page.click(optionSelector);
};

const clickInContextMenu = async (page, title) => {
  const contextMenuTriggerSelector =
    '.ProseMirror-table-contextual-menu-trigger';
  await page.waitForSelector(contextMenuTriggerSelector);
  await page.click(contextMenuTriggerSelector);
  const menuItems = await page.$x(`//span[contains(text(), '${title}')]`);
  if (menuItems.length > 0) {
    await menuItems[0].click();
  } else {
    throw new Error(`Menu title "${title}" not found`);
  }
};

const getCellBoundingRect = async (page, selector) => {
  return await page.evaluate(selector => {
    const element = document.querySelector(selector);
    const { x, y, width, height } = element.getBoundingClientRect();
    return { left: x, top: y, width, height, id: element.id };
  }, selector);
};

const resizeColumn = async (
  page,
  { colIdx, amount, row = 1 }: ResizeColumnOpts,
) => {
  let cell = await getCellBoundingRect(
    page,
    getSelectorForCell({ row, cell: colIdx }),
  );

  const columnEndPosition = cell.left + cell.width;

  // Move to the right edge of the cell.
  await page.mouse.move(columnEndPosition, cell.top);

  // Resize
  await page.mouse.down();
  await page.mouse.move(columnEndPosition + amount, cell.top);
  await page.mouse.up();
};

const getSelectorForCell = ({
  row,
  cell,
  cellType = 'td',
}: CellSelectorOpts) => {
  const rowSelector = `table tr:nth-child(${row})`;
  if (!cell) {
    return rowSelector;
  }

  return `${rowSelector} > ${cellType}:nth-child(${cell})`;
};

describe('Snapshot Test: table', () => {
  beforeAll(async () => {
    removeOldProdSnapshots(imageSnapshotFolder);
  });

  ['full-page', 'comment'].forEach(appearance => {
    let page;

    describe(`${appearance}`, () => {
      beforeAll(async () => {
        // @ts-ignore
        page = global.page;
        await initEditor(page, appearance);
      });

      beforeEach(async () => {
        await page.setViewport({ width: 1920, height: 1080 });
        await clearEditor(page);
        await insertTable(page);
      });

      if (appearance === 'full-page') {
        ['wide', 'full-width'].forEach(layout => {
          it(`${layout} layout`, async () => {
            const layoutName = layout
              .replace('-', ' ')
              .replace(/^\w/, c => c.toUpperCase());
            const buttonSelector = `div[aria-label="Table floating controls"] span[aria-label="${layoutName}"]`;
            // Make the images large enough so there is noticable difference between the table layouts.
            await page.click(buttonSelector);
            await page.waitForSelector(
              `.ProseMirror table[data-layout="${layout}"]`,
            );
            await snapshot(page);
          });
        });
        it(`remove row buttons in full width layout mode`, async () => {
          const buttonSelector = `div[aria-label="Table floating controls"] span[aria-label="Full width"]`;
          await page.click(buttonSelector);
          await page.waitForSelector(
            `.ProseMirror table[data-layout="full-width"]`,
          );
          await page.click(`.table-row:nth-child(1) button`);
          await page.hover(`span[aria-label="Remove row"]`);
          await page.waitForSelector('.ProseMirror table .danger');
          await snapshot(page);
        });

        it('table with scroll', async () => {
          const buttonSelector = `.table-column:nth-child(1) span[aria-label="Add column"]`;
          for (let k = 0; k < 3; k++) {
            await page.hover(`.table-column:nth-child(1)>div`);
            await page.waitForSelector(buttonSelector);
            await page.click(buttonSelector);
          }
          await page.click('table tr td:nth-child(1) p');
          await page.evaluate(() => {
            document.querySelector(
              '.ProseMirror .table-wrapper',
            )!.scrollLeft = 3;
          });
          await snapshot(page);
          await page.evaluate(() => {
            document.querySelector(
              '.ProseMirror .table-wrapper',
            )!.scrollLeft = 150;
          });
          await snapshot(page);
          await page.evaluate(() => {
            document.querySelector(
              '.ProseMirror .table-wrapper',
            )!.scrollLeft = 300;
          });
          await snapshot(page);
        });

        it('table display options', async () => {
          const headerRowOptionSelector =
            'div[data-role="droplistContent"] span[role="button"]:nth-of-type(1)';
          const headerColumnOptionSelector =
            'div[data-role="droplistContent"] span[role="button"]:nth-of-type(2)';
          const numberedColumnOptionSelector =
            'div[data-role="droplistContent"] span[role="button"]:nth-of-type(3)';

          // Remove default header row styling
          await selectTableDisplayOption(page, headerRowOptionSelector);
          await snapshot(page);
          // Add header row and column options
          await selectTableDisplayOption(page, headerColumnOptionSelector);
          await selectTableDisplayOption(page, headerRowOptionSelector);
          await snapshot(page);
          // Add numbered column
          await selectTableDisplayOption(page, numberedColumnOptionSelector);
          await snapshot(page);
          // Remove header column style
          await selectTableDisplayOption(page, headerColumnOptionSelector);
          await snapshot(page);
          // Remove header row style
          await selectTableDisplayOption(page, headerRowOptionSelector);
          await snapshot(page);
          // Re-add header column style
          await selectTableDisplayOption(page, headerColumnOptionSelector);
          await snapshot(page);
          // Remove header column style and numbered columns
          await selectTableDisplayOption(page, headerColumnOptionSelector);
          await selectTableDisplayOption(page, numberedColumnOptionSelector);
          await snapshot(page);
        });

        ['row', 'column', 'row+col'].forEach(type => {
          it(`${type} merge and split`, async () => {
            let firstCellSelector = getSelectorForCell({
              row: 1,
              cell: 1,
              cellType: 'th',
            });
            let lastCellSelector = getSelectorForCell({ row: 3, cell: 1 });

            if (type === 'column') {
              firstCellSelector = getSelectorForCell({ row: 2, cell: 1 });
              lastCellSelector = getSelectorForCell({ row: 2, cell: 3 });
            } else if (type === 'row+col') {
              firstCellSelector = getSelectorForCell({ row: 2, cell: 1 });
              lastCellSelector = getSelectorForCell({ row: 3, cell: 2 });
            }

            await page.click(firstCellSelector);
            await page.keyboard.down('Shift');
            await page.click(lastCellSelector);
            await page.keyboard.up('Shift');
            await page.waitForSelector('.ProseMirror table .selectedCell');
            await snapshot(page);
            await clickInContextMenu(page, 'Merge cells');
            await snapshot(page);
            await clickInContextMenu(page, 'Split cell');
            await snapshot(page);
          });
        });

        describe('Cell background', () => {
          beforeEach(async () => {
            await page.setViewport({ width: 790, height: 620 });
          });

          it('shows the submenu on the right', async () => {
            await page.click('tr:nth-child(1) > th:nth-child(1)');
            await clickInContextMenu(page, 'Cell background');
            await snapshot(page);
          });

          it('Submenu shows on the left if there is no available space', async () => {
            await page.click('tr:nth-child(1) > th:nth-child(3)');
            await clickInContextMenu(page, 'Cell background');
            await snapshot(page);
          });
        });
      }

      it('insert table', async () => {
        await snapshot(page);
      });

      it('trash icon', async () => {
        const buttonSelector = 'span[aria-label="Remove table"]';
        await page.hover(buttonSelector);
        await page.waitForSelector('.ProseMirror table td.danger');
        await snapshot(page);
        await page.click(buttonSelector);
        await snapshot(page);
      });

      ['row', 'column'].forEach(type => {
        it(`5 ${type}s added`, async () => {
          const buttonSelector = `.table-${type}:nth-child(1) span[aria-label="Add ${type}"]`;
          for (let k = 0; k < 5; k++) {
            await page.hover(`.table-${type}:nth-child(1)>div`);
            await page.waitForSelector(buttonSelector);
            await page.click(buttonSelector);
          }
          if (type === 'row') {
            await page.click('table tr:nth-child(1) p');
          } else {
            await page.click('table tr td:nth-child(1) p');
          }
          await snapshot(page);
        });

        for (let i = 1; i <= 3; i++) {
          it('control button', async () => {
            await page.hover(`.table-${type}:nth-child(${i})`);
            await page.waitForSelector('.ProseMirror table .hoveredCell');
            await snapshot(page);
            await page.click(`.table-${type}:nth-child(${i}) button`);
            await snapshot(page);
          });
          it(`add ${type} button at ${i} index`, async () => {
            const buttonSelector = `.table-${type}:nth-child(${i}) span[aria-label="Add ${type}"]`;
            await page.hover(`.table-${type}:nth-child(${i})>div`);
            await page.waitForSelector(buttonSelector);
            await snapshot(page);
            await page.click(buttonSelector);
            await page.click(`table td:nth-child(1) p`);
            await snapshot(page);
          });
          it(`remove ${type} button at ${i} index`, async () => {
            const removeButtonSelector = `span[aria-label="Remove ${type}"]`;
            await page.click(`.table-${type}:nth-child(${i}) button`);
            await page.hover(removeButtonSelector);
            await page.waitForSelector('.table-container .danger');
            await snapshot(page);
            await page.click(removeButtonSelector);
            await page.waitForSelector('.table-container .danger', {
              hidden: true,
            });
            await page.click(`table td:nth-child(1)`);
            await snapshot(page);
          });
        }
      });
    });
  });

  describe('Re-sizing', () => {
    let page;
    beforeEach(async () => {
      // @ts-ignore
      page = global.page;
      await page.setViewport({ width: 1920, height: 1080 });
      await initEditor(page, 'table-flexi-resizing');
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

    it(`snaps back to layout width after column removal`, async () => {
      await snapshot(page);
      await page.click(`.table-column:nth-child(1) button`);
      await page.click(`span[aria-label="Remove column"]`);
      await snapshot(page);
    });

    it('overflow table', async () => {
      await snapshot(page);
      await resizeColumn(page, { colIdx: 2, amount: 500, row: 2 });
      await snapshot(page);

      // Scroll to the end of col we are about to resize
      // Its in overflow.
      await page.evaluate(() => {
        const element = document.querySelector('.table-wrapper') as HTMLElement;

        if (element) {
          element.scrollTo(element.offsetWidth, 0);
        }
      });

      await resizeColumn(page, { colIdx: 2, amount: -550, row: 2 });

      // Scroll back so we can see the result of our resize.
      await page.evaluate(() => {
        const element = document.querySelector('.table-wrapper') as HTMLElement;

        if (element) {
          element.scrollTo(0, 0);
        }
      });

      await snapshot(page);
    });

    // TODO This test can be merged with column adding above once this is the main table re-sizing.
    it('Add a column', async () => {
      await snapshot(page);
      const buttonSelector = `.table-column:nth-child(1) span[aria-label="Add column"]`;
      await page.hover(`.table-column:nth-child(1)>div`);
      await page.waitForSelector(buttonSelector);
      await page.click(buttonSelector);
      await snapshot(page);
    });
  });
});
