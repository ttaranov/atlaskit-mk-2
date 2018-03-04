//TODO :move this to a new npm-pkg
const webdriverio = require('webdriverio');

export default class Page {
  constructor(client) {
    this.browser = client;
  }
  // Navigation
  goto(url) {
    return this.browser.url(url);
  }

  title() {
    return this.browser.getTitle();
  }

  $(selector) {
    return this.browser.element(selector);
  }

  $$(selector) {
    return this.browser.elements(selector);
  }

  type(selector, text) {
    return this.browser.addValue(selector, text);
  }

  click(selector) {
    return this.browser.click(selector);
  }
  keys(value) {
    return this.browser.keys(value);
  }

  // Get
  getProperty(selector, cssProperty) {
    return this.browser.getCssProperty(selector, cssProperty);
  }

  url() {
    return this.browser.getUrl();
  }
  // Protocol
  goBack() {
    return this.browser.back();
  }
  close() {
    return this.browser.close();
  }

  // To be replaced by those puppeeter fucntions
  //  keyboard.down('KeyA');
  //  keyboard.press('KeyA');
  //  keyboard.up('Shift');

  //will need to have wrapper for these once moved to puppeteer
  getText(selector) {
    // replace with await page.evaluate(() => document.querySelector('p').textContent)
    // for puppteer
    return this.browser.getText(selector);
  }
  isEnabled(selector) {
    return this.browser.isEnabled(selector);
  }
  isVisible(selector) {
    return this.browser.isVisible(selector);
  }
  log(type) {
    return this.browser.log(type);
  }
  paste(selector) {
    let keys;
    if (this.browser.desiredCapabilities.os === 'Windows') {
      keys = ['Control', 'v'];
    } else if (this.browser.desiredCapabilities.browserName === 'chrome') {
      // Workaround for https://bugs.chromium.org/p/chromedriver/issues/detail?id=30
      keys = ['Shift', 'Insert'];
    } else {
      keys = ['Shift', 'Insert'];
    }
    return this.browser.setValue(selector, keys);
  }
  getProsemirrorNode(selector) {
    const json = this.browser.selectorExecute(selector, function(elements) {
      const result = elements[0];
      return result.pmViewDesc.node.toJSON();
    });
    return json;
  }
  // Wait
  waitForSelector(selector) {
    return this.browser.waitForExist(selector);
  }
  waitFor(selector, ms, reverse) {
    return this.browser.waitForVisible(selector, ms, reverse);
  }
  // Window
  setViewPort(size, type) {
    return this.browser.setViewPort(size, type);
  }
}
//TODO: Maybe wrapping all functions?
async function wrapper(fn) {
  return fn;
}
