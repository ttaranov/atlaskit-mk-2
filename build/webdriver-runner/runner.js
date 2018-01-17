'use strict';
const webdriverio = require('webdriverio');
const CHROME_BINARY =
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 120e3;

let clients = [];

function setLocalClients() {
  const launchers = {
    chrome: {
      browserName: 'chrome',
    },
    firefox: {
      browserName: 'firefox',
    },
  };
  let clis = [];
  Object.keys(launchers).forEach(key => {
    const option = {
      desiredCapabilities: {
        browserName: launchers[key].browserName,
        //Disable headless here to run on real browsers
        chromeOptions: {
          args: ['--headless', '--disable-gpu'],
        },
      },
    };
    const client = webdriverio.remote(option);
    clis.push({ client: client, isReady: false });
  });
  return clis;
}

function setBrowserStackClients() {
  const launchers = {
    chrome: {
      os: 'Windows',
      browserName: 'Chrome',
      browser_version: '62.0',
      resolution: '1440x900',
    },
    firefox: {
      os: 'Windows',
      browserName: 'firefox',
      browser_version: '57',
      resolution: '1440x900',
    },
    ie: {
      os: 'Windows',
      browserName: 'ie',
      browser_version: '11',
      resolution: '1440x900',
    },
    safari: {
      os: 'OS X',
      browserName: 'safari',
      browser_version: '10.1',
      resolution: '1920x1080',
    },
    edge: {
      os: 'Windows',
      browserName: 'edge',
      browser_version: '15',
      resolution: '1440x900',
    },
  };

  let clis = [];

  Object.keys(launchers).forEach(key => {
    const option = {
      desiredCapabilities: {
        os: launchers[key].os,
        browser: launchers[key].browserName,
        browser_version: launchers[key].browser_version,
        project: 'Atlaskit MK2',
        build: process.env.BUILD_NUMBER || '1',
        'browserstack.local': true,
        project: 'Atlaskit MK-2 Webdriver Tests',
      },
      host: 'hub.browserstack.com',
      port: 80,
      user: process.env.BROWSERSTACK_USER || 'tongli2',
      key: process.env.BROWSERSTACK_KEY || 'FxSSGEnzpd4FSXtvHxtL',
    };
    let client = webdriverio.remote(option);
    clis.push({ client: client, isReady: false });
  });
  return clis;
}

process.env.TEST_ENV === 'browserstack'
  ? (clients = setBrowserStackClients())
  : (clients = setLocalClients());

function BrowserTestCase(testcase, tester, skipForBrowser) {
  describe(testcase, () => {
    beforeAll(async function() {
      for (let i in clients) {
        if (clients[i].isReady) continue;
        await clients[i].client.init();
        clients[i].isReady = true;
      }
    });

    for (let i in clients) {
      testRun(testcase, tester, clients[i].client, skipForBrowser);
    }

    afterAll(async function() {
      for (let i in clients) {
        await clients[i].client.end();
        clients[i].isReady = false;
      }
    });
  });
}

function testRun(testCase, tester, client, skipBrowser) {
  let testFn;
  let skipForBrowser;
  let browserName = client.desiredCapabilities.browserName;
  client.desiredCapabilities.name = testCase;

  if (skipBrowser) {
    skipBrowser.skip.forEach(browser => {
      if (browser.match(browserName)) {
        console.log(`skipping - '${testCase}' on browser:${browserName}`);
        skipForBrowser = true;
      }
    });
  }

  if (testCase.only) {
    testFn = test.only;
  } else if (testCase.skip) {
    testFn = test.skip;
  } else if (skipForBrowser) {
    testFn = test.skip;
  } else {
    testFn = test;
  }
  let callbk;
  if (tester.length > 1) {
    callbk = done => tester(client, done);
  } else {
    callbk = () => tester(client);
  }
  testFn(browserName, callbk);
}

module.exports = { BrowserTestCase };
