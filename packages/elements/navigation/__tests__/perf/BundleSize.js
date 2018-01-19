// @flow
/* eslint-disable */
const bytes = require('bytes');
const fs = require('fs');
const path = require('path');
// $FlowFixMe
const sourceTrace = require('source-trace');
// This threshold corresponds to 5% of the latest bundle value
const thresholdBundle = 3300;

let threshold;

/* eslint-disable */
// TODO: Fix bundle size test to work in ak mk 2 repo.
describe.skip('Bundle', () => {
  beforeAll(async () => {
    const data = sourceTrace(path.resolve(__dirname, '..', '..', '..', 'src'));
    const stats = data.map(d => fs.statSync(d).size);
    const sum = stats.reduce((prev, curr) => prev + curr, 0);
    threshold = bytes(sum).includes('MB')
      ? Number(bytes(sum).replace('MB', '')) * 1000
      : Number(
          bytes(sum)
            .replace('kB', '')
            .trim(),
        );
  });

  test(`should be less than the bundle threshold ${thresholdBundle} kb`, () => {
    expect(threshold).toBeLessThanOrEqual(thresholdBundle);
  });
});
