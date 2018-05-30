// @flow
import {
  createCustomSnapshot,
  getExamplesFor,
  removePreviousSnapshots,
  takeScreenShot,
  testBrowser,
  puppeteer,
  toMatchImageSnapshot,
  TEST_TIMEOUT,
} from '@atlaskit/visual-regression/helper';
import { getExampleUrl } from '@atlaskit/visual-regression/example';

const path = require('path');

const allExamples = getExamplesFor('button');
const imageSnapshotFolder = path.resolve(__dirname, `__image_snapshots__`);
expect.extend({ toMatchImageSnapshot });

let browser;
let page;

describe('Snapshot Test', () => {
  beforeAll(async () => {
    removePreviousSnapshots(imageSnapshotFolder);
    browser = await puppeteer.launch(testBrowser);
    page = await browser.newPage();
  }, TEST_TIMEOUT);

  afterAll(async () => {
    await browser.close();
  });

  allExamples.forEach(examples => {
    it(`${examples.package} > ${
      examples.example
    } - should be the same as prod`, async () => {
      const url = getExampleUrl(
        examples.team,
        examples.package,
        examples.example,
        global.__BASEURL__,
      );
      const image = await takeScreenShot(page, url);
      const buttonExamples = await createCustomSnapshot(examples.example);
      //$FlowFixMe
      expect(image).toMatchImageSnapshot(buttonExamples);
    });
  });
});
