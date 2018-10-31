import { getExampleUrl } from '@atlaskit/visual-regression/helper';
import {
  initEditor,
  insertTable,
  getSelectorForTableCell,
  insertMenuSelector,
  selectByTextAndClick,
  snapshot,
} from '../_utils';

describe('Snapshot Test: Floating toolbar', () => {
  let page;
  beforeAll(async () => {
    // @ts-ignore
    page = global.page;
    const url = getExampleUrl(
      'editor',
      'editor-core',
      'floating-toolbar',
      // @ts-ignore
      global.__BASEURL__,
    );
    await page.goto(url);
    await page.waitForSelector('#examples');
    await page.waitFor(0);
    const testToolbar = '[aria-label="Floating Toolbar"]';
    await page.waitForSelector(testToolbar);
  });

  afterEach(async () => {
    await snapshot(page);
  });

  describe('Buttons', () => {
    it('should render buttons', () => {});

    it('should render tooltip on hover', async () => {
      await page.hover(`button[aria-label="Green button"]`);
      await page.waitFor(1000);
    });
  });

  describe('Buttons with Separators', () => {
    it('should render buttons and separators', async () => {
      await page.click(
        '.toolsDrawer button[aria-label="buttons-with-separators"]',
      );
    });

    it('should render tooltip on hover', async () => {
      await page.hover(`button[aria-label="Green button"]`);
      await page.waitFor(1000);
    });
  });

  describe('Dropdowns', () => {
    it('should render dropdown trigger', async () => {
      await page.click('.toolsDrawer button[aria-label="dropdowns"]');
    });

    it('should render tooltip on hover', async () => {
      await page.hover(`button[aria-label="Green dropdown"]`);
      await page.waitFor(1000);
    });

    it('should render dropdown menu', async () => {
      await page.click(`button[aria-label="Green dropdown"]`);
    });

    // TODO investigate why this is acting up
    it.skip('should render custom component', async () => {
      await page.click(`button[aria-label="Yellow dropdown"]`);
    });
  });
});

describe('Floating toolbar: Toolbar resolution', () => {
  let page;
  beforeAll(async () => {
    // @ts-ignore
    page = global.page;
    await initEditor(page, 'full-page');
    await insertTable(page);
  });

  afterEach(async () => {
    await snapshot(page);
  });

  describe('Atom Nodes', () => {
    it('should render the table toolbar', async () => {
      const endCellSelector = getSelectorForTableCell({ row: 2, cell: 3 });
      await page.click(endCellSelector);
    });

    it('should render the block extension toolbar', async () => {
      const endCellSelector = getSelectorForTableCell({ row: 2, cell: 3 });
      await page.click(insertMenuSelector);
      await selectByTextAndClick({
        page,
        tagName: 'span',
        text: 'Block macro (EH)',
      });
      await page.click(`${endCellSelector} .extensionView-content-wrap`);
    });

    it('should render the inline extension toolbar', async () => {
      const endCellSelector = getSelectorForTableCell({ row: 2, cell: 2 });
      await page.click(endCellSelector);
      await page.click(insertMenuSelector);
      await selectByTextAndClick({
        page,
        tagName: 'span',
        text: 'Inline macro (EH)',
      });
      await page.click(`${endCellSelector} .inlineExtensionView-content-wrap`);
    });
  });
});
