const Selenium = require('selenium-standalone');
const seleniumInstallArgs = {};
const seleniumArgs = {};
let process;

function startSelenium() {
  return installSelenium(seleniumInstallArgs).then(
    () =>
      new Promise((resolve, reject) =>
        Selenium.start(seleniumArgs, (err, child) => {
          if (err) {
            return reject(err);
          }
          console.log('Starting selenium server');
          process = child;
          resolve();
        }),
      ),
  );
}

function installSelenium(seleniumInstallArgs) {
  return new Promise((resolve, reject) =>
    Selenium.install(seleniumInstallArgs, err => {
      if (err) {
        return reject(err);
      }
      resolve();
    }),
  );
}

function stopSelenium() {
  if (process) {
    console.log('Stopping selenium server');
    process.kill();
  }
}

module.exports = { startSelenium, stopSelenium };
