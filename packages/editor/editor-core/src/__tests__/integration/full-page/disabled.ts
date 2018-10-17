import * as assert from 'assert';
import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

import { fullpageDisabled } from '../_helpers';

async function assertThrowsAsync(fn, regExp) {
  let f = () => {};
  try {
    await fn();
  } catch (e) {
    f = () => {
      throw e;
    };
  } finally {
    assert.throws(f, regExp);
  }
}

BrowserTestCase(
  "disabled.ts: Shouldn't be able to click in the disabled editor",
  { skip: ['edge', 'ie', 'firefox', 'safari'] },
  async client => {
    const browser = new Page(client);
    await browser.goto(fullpageDisabled.path);
    await browser.waitForSelector(fullpageDisabled.placeholder);

    await assertThrowsAsync(
      async () => await browser.click(fullpageDisabled.placeholder),
      err => err.message.includes('Element is not clickable at point'),
    );
  },
);

BrowserTestCase(
  "disabled.ts: Shouldn't be able to click in a panel",
  { skip: ['edge', 'ie', 'firefox', 'safari'] },
  async client => {
    const browser = new Page(client);
    await browser.goto(fullpageDisabled.path);
    await browser.waitForSelector(fullpageDisabled.placeholder);

    await assertThrowsAsync(
      async () => await browser.click('.ak-editor-panel__content'),
      err => err.message.includes('Element is not clickable at point'),
    );
  },
);

BrowserTestCase(
  "disabled.ts: Shouldn't be able to click in a table",
  { skip: ['edge', 'ie', 'firefox', 'safari'] },
  async client => {
    const browser = new Page(client);
    await browser.goto(fullpageDisabled.path);
    await browser.waitForSelector(fullpageDisabled.placeholder);

    await assertThrowsAsync(
      async () => await browser.click('.pm-table-cell-nodeview-content-dom'),
      err => err.message.includes('Element is not clickable at point'),
    );
  },
);
