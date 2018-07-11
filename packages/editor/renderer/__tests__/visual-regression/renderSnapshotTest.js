// @flow
import {
  getExampleUrl,
  removeOldProdSnapshots,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

const path = require('path');

const imageSnapshotFolder = path.resolve(__dirname, `__image_snapshots__`);

describe('Snapshot Test', () => {
  beforeAll(async () => {
    removeOldProdSnapshots(imageSnapshotFolder);
  });

  it('The renderer should match prod', async () => {
    const url = getExampleUrl(
      'editor',
      'renderer',
      'basic',
      global.__BASEURL__,
    );

    await global.page.goto(url);
    const image = await takeElementScreenShot(global.page, '#RendererOutput');
    //$FlowFixMe
    expect(image).toMatchProdImageSnapshot();
  });
});
