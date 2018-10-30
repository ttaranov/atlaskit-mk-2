import {
  initEditor,
  clearEditor,
  getSelectorForTableCell,
  insertTable,
  snapshot,
  insertBlockMenuItem,
  insertMedia,
  setupMediaMocksProviders,
} from '../_utils';

import { setTableLayout, insertColumn, focusTable } from './_table-utils';

describe('Snapshot Test: table block alignment', () => {
  let page;

  beforeAll(async () => {
    // @ts-ignore
    page = global.page;
    await initEditor(page, 'full-page-with-toolbar');
  });

  beforeEach(async () => {
    await page.setViewport({ width: 1280, height: 960 });
    await clearEditor(page);
    await setupMediaMocksProviders(page);
    await insertTable(page);
    await insertColumn(page);
    await setTableLayout(page, 'wide');
    await focusTable(page);
  });

  test('Block elements should align at the top of the cell', async () => {
    // Setup block elements in table.
    let cellSelectors: string[] = [];
    for (let i = 1; i < 5; i++) {
      cellSelectors.push(`${getSelectorForTableCell({ row: 2, cell: i })} p`);
    }
    // Action
    await page.click(cellSelectors[0]);
    await page.type(cellSelectors[0], '[] ', {
      delay: 100,
    });
    // Decision
    await page.click(cellSelectors[1]);
    await page.type(cellSelectors[1], '<> ', {
      delay: 100,
    });
    // Code block
    await page.click(cellSelectors[2]);
    await page.type(cellSelectors[2], '``` ', {
      delay: 100,
    });

    // Panel
    await page.click(cellSelectors[3]);
    await insertBlockMenuItem(page, 'Panel');

    // Text to align to
    await page.click(getSelectorForTableCell({ row: 3, cell: 1 }));
    await page.type(
      getSelectorForTableCell({ row: 3, cell: 1 }),
      'Alignment text, to align block elems to.',
      { delay: 100 },
    );

    // Image
    await page.click(getSelectorForTableCell({ row: 3, cell: 2 }));
    await insertMedia(page);
    await page.waitForSelector('.img-wrapper');

    await snapshot(page);
  });
});
