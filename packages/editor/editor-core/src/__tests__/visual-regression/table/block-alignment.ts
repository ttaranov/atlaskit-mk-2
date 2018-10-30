import {
  initEditor,
  clearEditor,
  getSelectorForTableCell,
  insertTable,
  snapshot,
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
    const content = ['[] ', '<> ', '``` ', '/panel '];
    for (let i = 1; i < 5; i++) {
      const selector = `${getSelectorForTableCell({ row: 2, cell: i })} p`;
      await page.click(selector);
      await page.type(selector, content[i - 1], { delay: 100 });
    }

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
