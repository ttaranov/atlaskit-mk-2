'use strict';
//increase test timeout
//@flow
jasmine.DEFAULT_TIMEOUT_INTERVAL = 90e3;
const webdriverio = require('webdriverio');
let clients /*: Array<?Object>*/ = [];

process.env.TEST_ENV === 'browserstack'
  ? (clients = setBrowserStackClients())
  : (clients = setLocalClients());

function BrowserTestCase(...args /*:Array<any> */) {
  const testcase = args.shift();
  const tester = args.pop();
  const skipForBrowser = args.length > 0 ? args.shift() : null;

  describe(testcase, () => {
    beforeAll(async function() {
      for (let client of clients) {
        if (client) {
          if (client.isReady) continue;
          await client.driver.init();
          client.isReady = true;
        }
      }
    });

    for (let client of clients) {
      if (client) testRun(testcase, tester, client.driver, skipForBrowser);
    }

    afterAll(async function() {
      for (let client of clients) {
        if (client) {
          await client.driver.end();
          client.isReady = false;
        }
      }
    });
  });
}

/*::
type Tester<Object> = (opts: Object, done?: () => void) => ?Promise<mixed>;
*/

function testRun(
  testCase /*: string*/,
  tester /*: Tester<Object>*/,
  client /*: Object*/,
  skipBrowser /*: ?{skip:Array<string>}*/,
) {
  let testFn;
  let skipForBrowser;
  const browserName = client.desiredCapabilities.browserName;
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
  if (client && tester && tester.length > 1) {
    callbk = done => tester(client, done);
  } else {
    callbk = () => tester(client);
  }
  testFn(browserName, callbk);
}

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
        // chromeOptions: {
        //   args: ['--headless', '--disable-gpu'],
        // },
      },
    };
    const driver = webdriverio.remote(option);
    clis.push({ driver: driver, isReady: false });
  });
  return clis;
}

function setBrowserStackClients() {
  const launchers = {
    chrome: {
      os: 'Windows',
      browserName: 'Chrome',
      browser_version: '63.0',
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
      browser_version: '16',
      resolution: '1440x900',
    },
  };

  let clis = [];

  Object.keys(launchers).forEach(key => {
    const option = {
      desiredCapabilities: {
        os: launchers[key].os,
        browserName: launchers[key].browserName,
        browser_version: launchers[key].browser_version,
        project: 'Atlaskit MK2',
        build: process.env.BITBUCKET_BRANCH || '1',
        'browserstack.local': true,
        'browserstack.debug': true,
        project: 'Atlaskit MK-2 Webdriver Tests',
      },
      host: 'hub.browserstack.com',
      port: 80,
      user: process.env.BROWSERSTACK_USERNAME,
      key: process.env.BROWSERSTACK_KEY,
    };
    let driver = webdriverio.remote(option);
    clis.push({ driver: driver, isReady: false });
  });
  return clis;
}

module.exports = { BrowserTestCase };
