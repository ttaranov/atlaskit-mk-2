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

process.env.TEST_ENV === 'browserstack'
  ? (clients = setBrowserStackClients())
  : (clients = setLocalClients());

const launchClient = async client => {
  if (
    client &&
    (client.isReady ||
      (client.driver.requestHandler && client.driver.requestHandler.sessionID))
  ) {
    return;
  }

  client.isReady = true;
  return await client.driver.init();
};

const endSession = async client => {
  if (client && client.isReady) {
    client.isReady = false;
    await client.driver.end();
  }
};

afterAll(async function() {
  await Promise.all(clients.map(endSession));
});

function BrowserTestCase(...args /*:Array<any> */) {
  const testName = args.shift();
  const testFn = args.pop();
  const skipForBrowser = args.length > 0 ? args.shift() : { skip: [] };

  describe(testName, () => {
    let testsToRun = [];

    for (const client of clients) {
      if (!client) {
        continue;
      }

      const browserName = client.driver.desiredCapabilities.browserName.toLowerCase();

      if (skipForBrowser.skip.includes(browserName)) {
        continue;
      }

      testsToRun.push(async (fn, ...args) => {
        client.driver.desiredCapabilities.name = testName;
        await launchClient(client);
        try {
          await fn(client.driver, ...args);
        } catch (err) {
          console.error(
            `[Browser: ${browserName}]\n[Test: ${testName}]\n${err.message}`,
          );
          throw err;
        }
      });
    }

    testRun(testName, async (...args) => {
      await Promise.all(testsToRun.map(f => f(testFn, ...args)));
    });
  });
}

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
  testFn('', callback);
}

module.exports = { BrowserTestCase };
