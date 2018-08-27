//@flow
'use strict';
/*
* Visual-regression snapshot test helper with util functions to do 
* all the things ;)
*/

const glob = require('glob');
const path = require('path');
const fs = require('fs-extra');
const pageSelector = '#examples';

async function takeScreenShot(page /*:any*/, url /*:string*/) {
  await page.goto(url);
  await page.waitForSelector(pageSelector);
  return page.screenshot();
}

async function takeElementScreenShot(page /*:any*/, selector /*:string*/) {
  let element = await page.$(selector);
  return element.screenshot();
}

//function to check if image snapshot dir exists and delete it
function removeOldProdSnapshots(snapshotDir /*: string */) {
  if (process.env.PROD === 'true' && fs.existsSync(snapshotDir)) {
    fs.removeSync(snapshotDir);
  }
}

// get all examples from the code sync
function getAllExamplesSync() /*: Array<Object> */ {
  return glob
    .sync('**/packages/**/examples/*.+(js|ts|tsx)', {
      ignore: '**/node_modules/**',
    })
    .map(file => {
      const reverseExamplePath = file.split('/').reverse();
      return {
        team: reverseExamplePath[3],
        package: reverseExamplePath[2],
        exampleName: reverseExamplePath[0]
          .replace('.js', '')
          .replace('.tsx', '')
          .replace(/^\d+\-\s*/, ''),
      };
    });
}

function getExamplesFor(pkgName /*: string */) /*: Array<Object> */ {
  return getAllExamplesSync().filter(obj => obj.package === pkgName);
}

// construct example urls for a given example
const baseUrl = 'http://localhost:9000';
const getExampleUrl = (
  group: string,
  packageName: string,
  exampleName: string = '',
  environment: string = baseUrl,
) =>
  `${environment}/examples.html?groupId=${group}&packageId=${packageName}&exampleId=${exampleName}`;

module.exports = {
  getExamplesFor,
  removeOldProdSnapshots,
  takeScreenShot,
  takeElementScreenShot,
  getExampleUrl,
};
