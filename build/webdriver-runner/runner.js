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
const setBrowserStackClients = require('./utils/setupClients')
  .setBrowserStackClients;
const setLocalClients = require('./utils/setupClients').setLocalClients;
let clients /*: Array<?Object>*/ = [];
let skipForBrowser /*:?Object */ = {};

process.env.TEST_ENV === 'browserstack'
  ? (clients = setBrowserStackClients())
  : (clients = setLocalClients());

afterAll(function() {
  clients.forEach(async client => {
    if (client.isReady) {
      client.isReady = false;
      await client.driver.end();
    }
  });
});

function BrowserTestCase(...args /*:Array<any> */) {
  const testcase = args.shift();
  const tester = args.pop();
  const skipForBrowser = args.length > 0 ? args.shift() : null;
  const testCase = process.env.TEST_CASE ? process.env.TEST_CASE : testcase;
  describe(testcase, async () => {
    const unskippedTests = [];

    for (const client of clients) {
      let started;
      // set up client
      const launchClient = async () => {
        if (client) {
          const browserName /*: string */ =
            client.driver.desiredCapabilities.browserName;

          if (skipForBrowser && skipForBrowser[browserName]) {
            if (client.isReady) {
              client.isReady = false;
              return client.driver.end();
            }
          }
          if (client.isReady) return;
          client.isReady = true;
          await client.driver.init();
        }
      };

      const clientLauncher = {
        get start() {
          if (!started) {
            started = launchClient();
          }
          return started;
        },
      };

      if (client) {
        let skipBrowser;
        const browserName = client.driver.desiredCapabilities.browserName;
        if (skipForBrowser) {
          skipForBrowser.skip.forEach(browser => {
            if (browser.match(browserName)) {
              skipBrowser = true;
            }
          });
        }

        // add tests into only if the test is not skipped for the current browser
        if (!skipBrowser) {
          unskippedTests.push(async (fn, ...args) => {
            client.driver.desiredCapabilities.name = testcase;
            await clientLauncher.start;
            try {
              await fn(client.driver);
            } catch (err) {
              throw err;
            }
          });
        }
      }
    }

    testRun(testcase, async () => {
      await Promise.all(unskippedTests.map(f => f(tester, ...args)));
    });
  });
}

/*::
type Tester<Object> = (opts: Object, done?: () => void) => ?Promise<mixed>;
*/
function testRun(
  testCase /*: {name:string, skip?:boolean ,only?:boolean}*/,
  tester /*: Tester*/,
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
  testFn('', callback);
}

module.exports = { BrowserTestCase };
