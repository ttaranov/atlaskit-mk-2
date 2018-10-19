import { initEditor, snapshot } from './_utils';

describe('Snapshot Test: Dynamic Text Sizing', () => {
  let page;
  beforeAll(async () => {
    // @ts-ignore
    page = global.page;
    await initEditor(page, 'full-page-with-dynamic-text-sizing');
  });

  [
    { width: 1440, height: 3000 },
    { width: 1120, height: 3000 },
    { width: 1000, height: 3000 },
  ].forEach(size => {
    it(`should correctly render ${size.width}`, async () => {
      await page.setViewport(size);
      await page.waitFor(100);
      await snapshot(page);
    });
  });
});
