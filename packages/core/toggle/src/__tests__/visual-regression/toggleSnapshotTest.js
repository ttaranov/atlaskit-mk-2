// @flow
import {
  getExamplesFor,
  getExampleUrl,
  takeScreenShot,
  removeOldProdSnapshots,
} from '@atlaskit/visual-regression/helper';

const path = require('path');

const imageSnapshotFolder = path.resolve(__dirname, `__image_snapshots__`);
const examples = getExamplesFor('toggle');

describe('Snapshot Test', () => {
  beforeAll(async () => {
    removeOldProdSnapshots(imageSnapshotFolder);
  });

  examples.forEach(example => {
    it(`${example.exampleName}-should match production example`, async () => {
      const url = getExampleUrl(
        example.team,
        example.package,
        example.exampleName,
        global.__BASEURL__,
      );
      const image = await takeScreenShot(global.page, url);
      //$FlowFixMe
      expect(image).toMatchProdImageSnapshot();
    });
  });
});
