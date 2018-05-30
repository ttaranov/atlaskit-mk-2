//@flow
'use strict';
/*
* Visual-regression snapshot test helper with util functions to do 
* all the things ;)
*/
const fs = require('fs-extra');
const glob = require('glob');
const path = require('path');

//revisit this
const snapshotDir = `${__dirname}/__image_snapshots__/`;
const pageSelector = '#examples';
const TEST_TIMEOUT = 60000;
const testBrowser = {
  // run test in headless mode
  headless: true,
  slowMo: 100,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
};
const puppeteer = require('puppeteer');
const { toMatchImageSnapshot } = require('jest-image-snapshot');

async function takeScreenShot(page /*:any*/, url /*:string*/) {
  await page.goto(url);
  await page.waitForSelector(pageSelector);
  return page.screenshot();
}

//function to check if image snapshot dir exists and delete it
async function removePreviousSnapshots(snapshotDir /*: string */) {
  if (process.env.PROD === 'true') {
    if (fs.existsSync(snapshotDir)) fs.removeSync(snapshotDir);
  }
}

// create custom snapshot configuration object
async function createCustomSnapshot(filename /*: string */) {
  const customConfig = { threshold: 0.1 };
  const customObj = {};
  customObj.customDiffConfig = customConfig;
  customObj.customSnapshotIdentifier = filename;
  customObj.noColors = true;
  return customObj;
}

// get all examples from the code sync
function getAllExamplesSync() /*: Array<Object> */ {
  const files = glob.sync('**/packages/**/examples/*.+(js|ts|tsx)', {
    ignore: '**/node_modules/**',
  });
  const examplesArr = [];
  const examples = files.forEach(file => {
    const reverseExamplePath = file.split('/').reverse();
    examplesArr.push({
      team: reverseExamplePath[3],
      package: reverseExamplePath[2],
      example: reverseExamplePath[0]
        .replace('.js', '')
        .replace(/^\d+\-\s*/, ''),
    });
  });
  return examplesArr;
}

function getExamplesFor(pkgName /*: string */) /*: Array<Object> */ {
  const examples = getAllExamplesSync().filter(obj => obj.package === pkgName);
  return examples;
}

module.exports = {
  createCustomSnapshot,
  getExamplesFor,
  removePreviousSnapshots,
  takeScreenShot,
  puppeteer,
  testBrowser,
  toMatchImageSnapshot,
  TEST_TIMEOUT,
};
