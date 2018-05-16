const assert = require('assert');
const debug = require('debug');
const EventEmitter = require('events');
const puppeteer = require('puppeteer');

const TIMEOUT_MS = 120 * 1000;

class Browser {
  constructor(tabsCount, preload) {
    this.tabs = [];
    this.resolvers = [];

    this._loadTabs(tabsCount, preload);
  }

  async _loadTabs(tabsCount, preload) {
    this.browserObj = await puppeteer.launch({ headless: true });
    let tabsReady = 0;

    const onTabReady = tab => {
      tabsReady += 1;
      this.release(tab);
    };

    for (let i = 0; i < tabsCount; i++) {
      const tab = new Tab(this, i + 1, preload);
      tab.once('ready', onTabReady.bind(this, tab));
    }
  }

  getTab() {
    if (this.tabs.length) {
      const tab = this.tabs.pop();
      return Promise.resolve(tab);
    }

    return new Promise(resolve => this.resolvers.push(resolve));
  }

  release(tab) {
    if (this.resolvers.length) {
      const resolve = this.resolvers.shift();
      resolve(tab);
    } else {
      this.tabs.push(tab);
    }
  }

  close() {
    this.browserObj.close();
  }
}

class Tab extends EventEmitter {
  constructor(browser, id, preload) {
    super();

    this.browser = browser;
    this.id = id;
    this.preload = preload;
    this.log = debug(`tab-${id}`);

    this._setPageObject();
  }

  async _setPageObject() {
    const { browserObj } = this.browser;
    let isReady = false;

    this.log(`Open new page object`);
    this.pageObject = await browserObj.newPage();

    if (this.preload) {
      const { cookies, url, selectors, viewport } = this.preload;

      if (url) {
        this.log(`Preload ${url}`);
        await this.pageObject.goto(url, {
          waitUntil: 'networkidle0',
          timeout: TIMEOUT_MS,
        });
        this.log(`Done loading ${url}`);

        if (await this.findPageSelectors()) {
          isReady = true;
        } else {
          try {
            await this.reload();
            isReady = true;
          } catch (err) {
            // pass
          }
        }
      } else {
        isReady = true;
      }

      if (viewport) {
        this.pageObject.setViewport(viewport);
      }

      if (cookies) {
        for (const cookie of cookies) {
          await this.pageObject.setCookie(cookie);
        }
      }
    } else {
      isReady = true;
    }

    if (isReady) {
      this.emit('ready');
    } else {
      // page is broken
      this.pageObject.close();
    }
  }

  async findPageSelectors(selectors = []) {
    if (!selectors.length) {
      assert(this.preload, 'Preload option has not been set for Tab object');
    }

    const findSelectors = selectors.length ? selectors : this.preload.selectors;

    for (const selector of findSelectors) {
      const element = await this.pageObject.$(selector);

      if (!element) {
        this.log(`Couldn't find page element by selector: ${selector}`);
        return false;
      }
    }

    return true;
  }

  release() {
    this.browser.release(this);
  }

  async reload() {
    assert(this.preload, 'Preload option has not been set for Tab object');

    const { url, selectors } = this.preload;
    await this.pageObject.reload({
      waitUntil: 'networkidle0',
      timeout: TIMEOUT_MS,
    });

    assert(
      await this.findPageSelectors(),
      'Could not find some of the page elements after reload',
    );
  }
}

exports.Browser = Browser;
