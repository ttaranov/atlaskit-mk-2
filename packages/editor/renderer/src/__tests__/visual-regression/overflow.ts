import {
  getExampleUrl,
  takeScreenShot,
} from '@atlaskit/visual-regression/helper';

describe('Snapshot Test: Overflow shadows', () => {
  let page;
  const url = getExampleUrl(
    'editor',
    'renderer',
    'overflow',
    // @ts-ignore
    global.__BASEURL__,
  );

  beforeAll(async () => {
    // @ts-ignore
    page = global.page;
    await page.goto(url);
    await page.setViewport({ width: 1280, height: 1080 });
  });

  it(`should render right shadows`, async () => {
    const image = await takeScreenShot(page, url);
    // @ts-ignore
    expect(image).toMatchProdImageSnapshot();
  });
});
