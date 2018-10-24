// @flow
'use strict';
const ChromeDriverLauncher = require('wdio-chromedriver-service/launcher');
const util = require('util');

/*
* Next steps: 
* - Create our own chromedriver launcher
* - Pass it the config.
* - Remove selenium and clean the package.json

/*
* util module to support 
*   a. install chrome-driver
*   b. start and stop chrome driver server
* more about: XXXXX
*/
let child;

const chromeConfig = {
  port: '9000',
  path: '/',
  services: ['chromedriver'],
  chromeDriverArgs: ['--port=9000'],
  chromeDriverLogs: './',
};

async function startChromeServer() {
  child = new ChromeDriverLauncher(chromeConfig);
  console.log('Started chrome server');
}

function stopChromeServer() {
  if (child) {
    console.log('Stopping chrome server');
    child.kill();
  }
}

module.exports = { startChromeServer, stopChromeServer };
