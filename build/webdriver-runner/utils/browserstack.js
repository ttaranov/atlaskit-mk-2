const browserstack = require('browserstack-local');
const bsLocal = new browserstack.Local();

function startBrowserStack() {
  return new Promise(function(resolve, reject) {
    bsLocal.start({ key: process.env.BROWSERSTACK_KEY }, error => {
      if (error) {
        reject(error);
        return;
      }
      resolve(() => console.log('Connected to BrowserStack'));
    });
  });
}

function stopBrowserStack() {
  console.log('Disconnecting from BrowserStack');
  bsLocal.stop(() => {});
}

module.exports = { startBrowserStack, stopBrowserStack };
