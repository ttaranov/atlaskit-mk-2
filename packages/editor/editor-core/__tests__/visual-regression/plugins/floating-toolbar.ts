import {
  removeOldProdSnapshots,
  getExampleUrl,
} from '@atlaskit/visual-regression/helper';
import { imageSnapshotFolder } from '../_utils';

describe('Snapshot Test: Floating toolbar', () => {
  beforeAll(async () => {
    removeOldProdSnapshots(imageSnapshotFolder);
  });

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
    const image = await page.screenshot();
    // @ts-ignore
    expect(image).toMatchProdImageSnapshot();
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

    it('should render custom component', async () => {
      await page.click(`button[aria-label="Yellow dropdown"]`);
    });
  });
});
