'use strict';
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
    beforeEach(async function() {
      for (let client of clients) {
        if (client) {
          const browserName = client.driver.desiredCapabilities.browserName;
          if (skipForBrowser && skipForBrowser[browserName]) {
            if (client.isReady) {
              client.isReady = false;
              await client.driver.end();
            }
            continue;
          }
          if (client.isReady) continue;
          client.isReady = true;
          await client.driver.init();
        }
      }
    });

    for (let client of clients) {
      if (client) {
        testRun(testcase, tester, client.driver, skipForBrowser);
      }
    }
  });
}

afterAll(async function() {
  for (let client of clients) {
    if (client) {
      client.isReady = false;
      await client.driver.end();
    }
  }
});

/*::
type Tester<Object> = (opts: Object, done?: () => void) => ?Promise<mixed>;
*/

function testRun(
  testCase /*: {name:string, skip?:boolean ,only?:boolean}*/,
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
    client.end();
  } else {
    testFn = test;
  }

  let callback;
  if (client && tester && tester.length > 1) {
    callback = done => tester(client, done);
  } else {
    callback = () => tester(client);
  }
  testFn(browserName, callback);
}

function setLocalClients() {
  const launchers = {
    chrome: {
      browserName: 'chrome',
      // Disable headless here to run on real browsers
      chromeOptions: {
        args: ['--headless', '--disable-gpu'],
      },
    },
    safari: {
      browserName: 'safari',
    },
    firefox: {
      browserName: 'firefox',
      'moz:firefoxOptions': {
        args: ['-headless'],
      },
    },
  };

  return Object.keys(launchers).map(key => {
    const option = {
      desiredCapabilities: launchers[key],
    };
    return { driver: webdriverio.remote(option) };
  });
}

function setBrowserStackClients() {
  const launchers = {
    chrome: {
      os: 'Windows',
      browserName: 'Chrome',
      browser_version: '64.0',
      resolution: '1440x900',
    },
    firefox: {
      os: 'Windows',
      browserName: 'firefox',
      browser_version: '58',
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
  if (!process.env.BITBUCKET_BRANCH && process.env.USER) {
    process.env.BITBUCKET_BRANCH = process.env.USER + '_local';
  }

  Object.keys(launchers).forEach(key => {
    const option = {
      desiredCapabilities: {
        os: launchers[key].os,
        browserName: launchers[key].browserName,
        browser_version: launchers[key].browser_version,
        project: 'Atlaskit MK2',
        build: process.env.BITBUCKET_BRANCH,
        'browserstack.local': true,
        'browserstack.debug': true,
        'browserstack.idleTimeout': 300,
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
