//@flow

/*
* util module to support connect and disconnect from browserstack.
*/

const browserstack = require('browserstack-local');
const bsLocal = new browserstack.Local();

const uniqIdentifierStamp = process.env.LOCAL_IDENTIFIER || '';
const bsKey = process.env.BROWSERSTACK_KEY;
const commit = process.env.BITBUCKET_COMMIT
  ? process.env.BITBUCKET_COMMIT + uniqIdentifierStamp
  : process.env.USER
    ? process.env.USER + uniqIdentifierStamp
    : uniqIdentifierStamp;

async function startBrowserStack() {
  return new Promise((resolve, reject) => {
    bsLocal.start({ key: bsKey, localIdentifier: commit }, error => {
      if (error) {
        return reject(error);
      }
      resolve();
      if (commit)
        console.log(`Connected to browserstack with identifier: ${commit}`);
    });
  });
}

function stopBrowserStack() {
  console.log('Disconnecting from BrowserStack');
  bsLocal.stop(() => {});
}

module.exports = { startBrowserStack, stopBrowserStack };
