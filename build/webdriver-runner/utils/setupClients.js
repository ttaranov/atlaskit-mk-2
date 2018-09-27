'use strict';
// @flow

const webdriverio = require('webdriverio');
const uniqIdentifierStamp = process.env.LOCAL_IDENTIFIER || '';
const commit = process.env.BITBUCKET_COMMIT
  ? process.env.BITBUCKET_COMMIT + uniqIdentifierStamp
  : process.env.USER
    ? process.env.USER + uniqIdentifierStamp
    : uniqIdentifierStamp;

if (!process.env.BITBUCKET_BRANCH && process.env.USER) {
  process.env.BITBUCKET_BRANCH = process.env.USER + '_local_run';
}

function setBrowserStackClients() /*: Array<?Object>*/ {
  const launchers = {
    chrome: {
      os: 'Windows',
      os_version: '10',
      browserName: 'chrome',
      browser_version: '69.0',
      resolution: '1440x900',
    },
    firefox: {
      os: 'Windows',
      os_version: '10',
      browserName: 'firefox',
      browser_version: '61.0',
      resolution: '1440x900',
    },
    ie: {
      os: 'Windows',
      os_version: '10',
      browserName: 'ie',
      browser_version: '11',
      resolution: '1440x900',
    },
    safari: {
      os: 'OS X',
      os_version: 'Sierra',
      browserName: 'safari',
      browser_version: '10.1',
      resolution: '1920x1080',
    },
    edge: {
      os: 'Windows',
      os_version: '10',
      browserName: 'edge',
      browser_version: '16',
      resolution: '1440x900',
    },
  };
  const launchKeys = Object.keys(launchers);
  const options = launchKeys.map(launchKey => {
    const option = {
      desiredCapabilities: {
        os: launchers[launchKey].os,
        os_version: launchers[launchKey].os_version,
        browserName: launchers[launchKey].browserName,
        browser_version: launchers[launchKey].browser_version,
        project: 'Atlaskit MK-2 Webdriver Tests',
        build: process.env.BITBUCKET_BRANCH,
        'browserstack.local': true,
        'browserstack.debug': true,
        'browserstack.idleTimeout': 300,
        'browserstack.localIdentifier': commit,
      },
      host: 'hub.browserstack.com',
      port: 80,
      user: process.env.BROWSERSTACK_USERNAME,
      key: process.env.BROWSERSTACK_KEY,
      waitforTimeout: 3000,
    };
    const driver = webdriverio.remote(option);
    return { driver: driver, isReady: false };
  });
  return options;
}

function setLocalClients() /*: Array<?Object>*/ {
  const isHeadless = process.env.HEADLESS !== 'false';
  const launchers = {
    chrome: {
      browserName: 'chrome',
      chromeOptions: isHeadless ? { args: ['--headless'] } : { args: [] },
    },
    firefox: {
      browserName: 'firefox',
      'moz:firefoxOptions': isHeadless ? { args: ['-headless'] } : { args: [] },
    },
  };

  // Keep only chrome for watch mode
  if (process.env.WATCH === 'true') {
    delete launchers.firefox;
  }

  const launchKeys = Object.keys(launchers);
  const options = launchKeys.map(key => {
    const driver = webdriverio.remote({ desiredCapabilities: launchers[key] });
    return { driver: driver, isReady: false };
  });
  return options;
}

module.exports = { setLocalClients, setBrowserStackClients };
