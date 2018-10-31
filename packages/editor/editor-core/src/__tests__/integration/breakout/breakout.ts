import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import {
  getDocFromElement,
  fullpage,
  editable,
  insertBlockMenuItem,
} from '../_helpers';

import { messages } from '../../../plugins/block-type/types';
import commonMessages from '../../../messages';

const wideBreakoutButtonQuery = `div[aria-label="CodeBlock floating controls"] [aria-label="${
  commonMessages.layoutWide.defaultMessage
}"]`;
const fullWidthBreakoutButtonQuery = `div[aria-label="CodeBlock floating controls"] [aria-label="${
  commonMessages.layoutFullWidth.defaultMessage
}"]`;
const centerBreakoutButtonQuery = `div[aria-label="CodeBlock floating controls"] [aria-label="${
  commonMessages.layoutFixedWidth.defaultMessage
}"]`;

BrowserTestCase(
  'breakout: should be able to switch to wide mode',
  { skip: [] },
  async client => {
    const page = new Page(client);
    await page.goto(fullpage.path);
    await page.waitForSelector(fullpage.placeholder);
    await page.click(fullpage.placeholder);

    await insertBlockMenuItem(page, messages.codeblock.defaultMessage);

    // Switch to wide breakout mode
    await page.waitForSelector(wideBreakoutButtonQuery);
    await page.click(wideBreakoutButtonQuery);
    expect(await page.$eval(editable, getDocFromElement)).toMatchDocSnapshot();
  },
);

BrowserTestCase(
  'breakout: should be able to switch to full-width mode',
  { skip: [] },
  async client => {
    const page = new Page(client);
    await page.goto(fullpage.path);
    await page.waitForSelector(fullpage.placeholder);
    await page.click(fullpage.placeholder);

    await insertBlockMenuItem(page, messages.codeblock.defaultMessage);

    // Switch to full-width breakout mode
    await page.waitForSelector(fullWidthBreakoutButtonQuery);
    await page.click(fullWidthBreakoutButtonQuery);
    expect(await page.$eval(editable, getDocFromElement)).toMatchDocSnapshot();
  },
);

BrowserTestCase(
  'breakout: should be able to switch to center mode back',
  { skip: [] },
  async client => {
    const page = new Page(client);
    await page.goto(fullpage.path);
    await page.waitForSelector(fullpage.placeholder);
    await page.click(fullpage.placeholder);

    await insertBlockMenuItem(page, messages.codeblock.defaultMessage);

    // Switch to wide breakout mode
    await page.waitForSelector(wideBreakoutButtonQuery);
    await page.click(wideBreakoutButtonQuery);

    // Disable breakout
    await page.click(centerBreakoutButtonQuery);
    expect(await page.$eval(editable, getDocFromElement)).toMatchDocSnapshot();
  },
);
