import {
  getExampleUrl,
  takeScreenShot,
} from '@atlaskit/visual-regression/helper';

describe('Snapshot Test: Dynamic Text Sizing', () => {
  let page;
  [
    { width: 1440, height: 3000 },
    { width: 1120, height: 3000 },
    { width: 1000, height: 3000 },
  ].forEach(size => {
    it(`should correctly render ${size.width}`, async () => {
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
      await page.setViewport(size);
      await page.waitFor(100);
      const image = await takeScreenShot(page, url);
      // @ts-ignore
      expect(image).toMatchProdImageSnapshot();
    });
  });
});
