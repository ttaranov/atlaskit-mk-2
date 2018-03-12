// @flow
'use strict';

const Selenium = require('selenium-standalone');
const util = require('util');

const install = util.promisify(Selenium.install);
const start = util.promisify(Selenium.start);

let child;

const seleniumConfig = {
  version: '3.0.7',
  drivers: {
    chrome: {
      version: '2.36',
      arch: process.arch,
      baseURL: 'https://chromedriver.storage.googleapis.com',
    },
    firefox: {
      version: '0.19.1',
      arch: process.arch,
      baseURL: 'https://github.com/mozilla/geckodriver/releases',
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
