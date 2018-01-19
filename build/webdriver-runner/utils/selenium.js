// @flow
'use strict';

const Selenium = require('selenium-standalone');
const util = require('util');

const install = util.promisify(Selenium.install);
const start = util.promisify(Selenium.start);

let child;

async function startSelenium() {
  await install({});
  child = await start({});
  console.log('Started selenium server');
}

function stopSelenium() {
  if (child) {
    console.log('Stopping selenium server');
    child.kill();
  }
}

module.exports = { startSelenium, stopSelenium };
