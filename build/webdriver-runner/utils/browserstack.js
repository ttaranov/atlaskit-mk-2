//@flow

const browserstack = require('browserstack-local');
const bsLocal = new browserstack.Local();
const bsKey = process.env.BROWSERSTACK_KEY;
const branch = process.env.BITBUCKET_BRANCH
  ? process.env.BITBUCKET_BRANCH
  : process.env.USER;

const local = branch ? branch + now() : now();
const localIdentifier = local.replace(' ', '_');

function now() {
  const today = new Date();
  return (
    today.toLocaleDateString() +
    ':' +
    today.getHours() +
    today.getMinutes()
  ).toString();
}

async function startBrowserStack() {
  return new Promise((resolve, reject) => {
    bsLocal.start({ key: bsKey, localIdentifier: localIdentifier }, error => {
      if (error) {
        return reject(error);
      }
      resolve();
      console.log(
        `Connected to browserstack with identifier: ${localIdentifier}`,
      );
    });
  });
}

function stopBrowserStack() {
  console.log('Disconnecting from BrowserStack');
  bsLocal.stop(() => {});
}

module.exports = { startBrowserStack, stopBrowserStack, localIdentifier };
