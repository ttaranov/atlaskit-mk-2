// @flow
'use strict';

const Selenium = require('selenium-standalone');
const util = require('util');

/*
This file contains the logic to start and stop the selenium server
*/

const install = util.promisify(Selenium.install);
const start = util.promisify(Selenium.start);

let child;

// Add selenium config to override default
// Update chromedriver to run on Chrome65
const seleniumConfig = {
  drivers: {
    chrome: {
      version: '2.36',
      arch: process.arch,
    },
    firefox: {
      version: '0.19.1',
      arch: process.arch,
    },
  },
};

async function startSelenium() {
  await install(seleniumConfig);
  child = await start(seleniumConfig);
  console.log('Started selenium server');
}

function stopSelenium() {
  if (child) {
    console.log('Stopping selenium server');
    child.kill();
  }
}

module.exports = { startSelenium, stopSelenium };
