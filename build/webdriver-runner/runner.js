'use strict';
// @flow

/*
* Setup webdriver clients depending on environment on which the test is run against.
* BrowserTestCase is customized wrapper over jest-test-runner handling test setup, execution and 
* teardown for webdriver tests .
*/

// increase default jasmine timeout not to fail on webdriver tests as tests run can
// take a while depending on the number of threads executing.

// increase this time out to handle queuing on browserstack
jasmine.DEFAULT_TIMEOUT_INTERVAL = 1200e3;

const webdriverio = require('webdriverio');
const uniqIdentifierStamp = process.env.LOCAL_IDENTIFIER || '';
const commit = process.env.BITBUCKET_COMMIT
  ? process.env.BITBUCKET_COMMIT + uniqIdentifierStamp
  : process.env.USER
    ? process.env.USER + uniqIdentifierStamp
    : uniqIdentifierStamp;
let clients /*: Array<?Object>*/ = [];
let skipForBrowser /*:?Object */ = {};

process.env.TEST_ENV === 'browserstack'
  ? (clients = setBrowserStackClients())
  : (clients = setLocalClients());

function BrowserTestCase(...args /*:Array<any> */) {
  const testcase = args.shift();
  const tester = args.pop();
  const skipForBrowser = args.length > 0 ? args.shift() : null;

  describe(testcase, () => {
    const clientRunners = [];

    for (const client of clients) {
      let s;
      let e;
      const clientLauncher = {
        get start() {
          if (!s) {
            s = launchClient();
          }
          return s;
        },
        get end() {
          if (!e) {
            e = endClient();
          }
          return e;
        },
      };
      const launchClient = async () => {
        if (client) {
          const browserName /*: string */ =
            client.driver.desiredCapabilities.browserName;

          if (skipForBrowser && skipForBrowser[browserName]) {
            if (client.isReady) {
              client.isReady = false;
              await client.driver.end();
            }
            return;
          }
          if (client.isReady) return;
          client.isReady = true;
          await client.driver.init();
        }
      };
      const endClient = async () => {
        if (client) {
          client.isReady = false;
          await client.driver.end();
        }
      };

      if (client) {
        clientRunners.push(async (fn, ...args) => {
          let skipBrowser;
          const browserName = client.driver.desiredCapabilities.browserName;
          // TODO: get the test file name
          client.driver.desiredCapabilities.name = `Test Suite With: (${testcase}) - ${browserName}`;

          if (skipForBrowser) {
            skipForBrowser.skip.forEach(browser => {
              if (browser.match(browserName)) {
                skipBrowser = true;
              }
            });
          }

          if (skipBrowser) {
            return;
          }

          await clientLauncher.start;
          try {
            await fn(client.driver, ...args);
          } catch (err) {
            const err2 = new Error(`Browser: ${browserName} -- ${err.message}`);
            err2.stack = err.stack;
            throw err2;
          }
        });
      }
    }

    testRun(testcase, async (...args) => {
      await Promise.all(clientRunners.map(f => f(tester, ...args)));
    });
  });
}

afterAll(async function() {
  await Promise.all(
    clients.map(async client => {
      if (!client) return;
      await client.driver.end();
    }),
  );
});

/*::
type Tester<Object> = (opts?: Object, done?: () => void) => ?Promise<mixed>;
*/
function testRun(
  testCase /*: {name:string, skip?:boolean ,only?:boolean}*/,
  tester /*: Tester<Object>*/,
) {
  let testFn;

  if (testCase.only) {
    testFn = test.only;
  } else if (testCase.skip) {
    testFn = test.skip;
  } else {
    testFn = test;
  }

  let callback;
  if (tester && tester.length > 1) {
    callback = done => tester(done);
  } else {
    callback = () => tester();
  }
  testFn('all browsers', callback);
}

function setLocalClients() {
  const isHeadless = process.env.HEADLESS !== 'false';
  const launchers = {
    chrome: {
      browserName: 'chrome',
      chromeOptions: isHeadless
        ? { args: ['--headless', '--disable-gpu'] }
        : { args: [] },
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

  const browserOption = [];
  for (const key of Object.keys(launchers)) {
    const option = { desiredCapabilities: launchers[key] };
    browserOption.push({ driver: webdriverio.remote(option) });
  }
  return browserOption;
}

function setBrowserStackClients() {
  const launchers = {
    chrome: {
      os: 'Windows',
      os_version: '10',
      browserName: 'Chrome',
      browser_version: '67.0',
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

  let clis = [];
  if (!process.env.BITBUCKET_BRANCH && process.env.USER) {
    process.env.BITBUCKET_BRANCH = process.env.USER + '_local_run';
  }

  Object.keys(launchers).forEach(key => {
    const option = {
      desiredCapabilities: {
        os: launchers[key].os,
        os_version: launchers[key].os_version,
        browserName: launchers[key].browserName,
        browser_version: launchers[key].browser_version,
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
    };
    let driver = webdriverio.remote(option);
    clis.push({ driver: driver, isReady: false });
  });
  return clis;
}

module.exports = { BrowserTestCase };
