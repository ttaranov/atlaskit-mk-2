// @flow
/* The goal of this test is to monitor the number of $FlowFixMe we have in our repo */
const glob = require('glob');
const path = require('path');
const fs = require('fs-extra');
// TODO: To discuss this threshold
const threshold = 205;
let occurence = 0;

// get all FlowFixMe from the code sync
function getAllFlowFixMe() /*: number */ {
  glob
    .sync('**/packages/**/*.+(js)', {
      ignore: '**/node_modules/**',
    })
    .forEach(file => {
      const content = fs.readFileSync(process.cwd() + '/' + file, 'utf-8');
      occurence += (content.match(/FlowFixMe/g) || []).length;
    });
  return occurence;
}

describe('$FlowFixMe', () => {
  it(`should be less than ${threshold}`, async () => {
    const flowFixMeOcurrences = getAllFlowFixMe();
    expect(flowFixMeOcurrences).toBeLessThan(threshold);
  });
});
