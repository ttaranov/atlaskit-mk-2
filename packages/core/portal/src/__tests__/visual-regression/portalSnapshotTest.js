// @flow
import {
  getExamplesFor,
  getExampleUrl,
  takeScreenShot,
  removeOldProdSnapshots,
} from '@atlaskit/visual-regression/helper';

const path = require('path');

const imageSnapshotFolder = path.resolve(__dirname, `__image_snapshots__`);
const examples = getExamplesFor('portal');

describe('Snapshot Test', () => {
  beforeAll(async () => {
    removeOldProdSnapshots(imageSnapshotFolder);
  });

  const stackingExample = examples.find(
    ({ exampleName }) => exampleName.indexOf('stacking-context') > -1,
  );

  if (!stackingExample) {
    throw Error('unable to find stacking context example');
  }

  it(`Portal stacking context should match prod`, async () => {
    const url = getExampleUrl(
      stackingExample.team,
      stackingExample.package,
      stackingExample.exampleName,
      global.__BASEURL__,
    );
    const image = await takeScreenShot(global.page, url);
    //$FlowFixMe
    expect(image).toMatchProdImageSnapshot();
  });
});
