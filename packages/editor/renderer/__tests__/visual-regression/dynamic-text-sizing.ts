import {
  removeOldProdSnapshots,
  getExampleUrl,
} from '@atlaskit/visual-regression/helper';

// @ts-ignore
export const imageSnapshotFolder = require('path').resolve(
  // @ts-ignore
  __dirname,
  `__image_snapshots__`,
);

export const snapshot = async page => {
  const image = await page.screenshot();
  // @ts-ignore
  expect(image).toMatchProdImageSnapshot();
};

describe('Snapshot Test: Dynamic Text Sizing', () => {
  let page;
  beforeAll(async () => {
    removeOldProdSnapshots(imageSnapshotFolder);
    const url = getExampleUrl(
      'editor',
      'renderer',
      'dynamic-text-sizing',
      // @ts-ignore
      global.__BASEURL__,
    );
    // @ts-ignore
    page = global.page;

    await page.goto(url);
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
