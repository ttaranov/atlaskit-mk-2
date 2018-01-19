//@flow

const browserstack = require('browserstack-local');
const bsLocal = new browserstack.Local();
const bsKey = process.env.BROWSERSTACK_KEY;

async function startBrowserStack() {
  return new Promise((resolve, reject) => {
    bsLocal.start({ key: bsKey }, error => {
      if (error) {
        return reject(error);
      }
      setTimeout(() => resolve(), 1000);
    });
  });
}

function stopBrowserStack() {
  console.log('Disconnecting from BrowserStack');
  bsLocal.stop(() => {});
}

module.exports = { startBrowserStack, stopBrowserStack };
