import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

import {
  editable,
  getDocFromElement,
  fullpage,
  quickInsert,
  clipboardHelper,
  clipboardInput,
  copyAsHTMLButton,
  copyAsPlaintextButton,
  insertBlockMenuItem,
} from '../_helpers';
import { insertMentionUsingClick } from '../message-renderer/_mention-helpers';
import { messages as insertBlockMessages } from '../../../plugins/insert-block/ui/ToolbarInsertBlock';

// Panels in extensions is tested in bodied-insert-1.ts

BrowserTestCase(
  'Insert via quick insert',
  { skip: ['edge', 'ie', 'safari'] },
  async client => {
    const browser = new Page(client);

    await browser.goto(fullpage.path);
    await browser.waitForSelector(editable);
    await browser.click(editable);
    await quickInsert(browser, 'Panel');

    await browser.type(editable, 'this text should be in the panel');

    const doc = await browser.$eval(editable, getDocFromElement);
    expect(doc).toMatchDocSnapshot();
  },
);

BrowserTestCase(
  'Insert via toolbar menu',
  { skip: ['edge', 'ie', 'safari'] },
  async client => {
    const browser = new Page(client);

    await browser.goto(fullpage.path);
    await browser.waitForSelector(editable);
    await browser.click(editable);

    await insertBlockMenuItem(browser, 'Panel');

    await browser.type(editable, 'this text should be in the panel');

    const doc = await browser.$eval(editable, getDocFromElement);
    expect(doc).toMatchDocSnapshot();
  },
);

BrowserTestCase(
  'Changes the type to Error',
  { skip: ['edge', 'ie', 'safari'] },
  async client => {
    const browser = new Page(client);

    await browser.goto(fullpage.path);

    await browser.waitForSelector(fullpage.placeholder);
    await browser.click(fullpage.placeholder);
    await quickInsert(browser, 'Panel');

    await browser.type(editable, 'this text should be in the panel');

    // Change panel type to Error
    const selector = `[aria-label="Error"]`;
    await browser.click(selector);

    const doc = await browser.$eval(editable, getDocFromElement);
    expect(doc).toMatchDocSnapshot();
  },
);

BrowserTestCase(
  'Insert link by typing Markdown',
  { skip: ['edge', 'ie', 'safari'] },
  async client => {
    const browser = new Page(client);

    await browser.goto(fullpage.path);

    await browser.waitForSelector(fullpage.placeholder);
    await browser.click(fullpage.placeholder);

    await quickInsert(browser, 'Panel');

    await browser.type(editable, '[Atlassian](https://www.atlassian.com/)');

    const doc = await browser.$eval(editable, getDocFromElement);
    expect(doc).toMatchDocSnapshot();
  },
);

// Cannot paste rich text in IE/Edge
BrowserTestCase(
  'Paste rich text',
  { skip: ['ie', 'safari', 'edge'] },
  async client => {
    const browser = new Page(client);
    await browser.goto(clipboardHelper);
    await browser.isVisible(clipboardInput);
    await browser.type(
      clipboardInput,
      '<p>this is a link <a href="http://www.google.com">www.google.com</a></p><p>more elements with some <strong>format</strong></p><p>some addition<em> formatting</em></p>',
    );
    await browser.click(copyAsHTMLButton);

    await browser.goto(fullpage.path);
    await browser.waitForSelector(editable);

    await browser.click(editable);
    await quickInsert(browser, 'Panel');

    await browser.paste(editable);

    const doc = await browser.$eval(editable, getDocFromElement);
    expect(doc).toMatchDocSnapshot();
  },
);

BrowserTestCase(
  'Paste plain text',
  { skip: ['ie', 'safari', 'edge'] },
  async client => {
    const browser = new Page(client);
    await browser.goto(clipboardHelper);
    await browser.isVisible(clipboardInput);
    await browser.type(
      clipboardInput,
      'this is a link http://www.google.com more elements with some **format** some addition *formatting*',
    );
    await browser.click(copyAsPlaintextButton);

    await browser.goto(fullpage.path);
    await browser.waitForSelector(editable);

    await browser.click(editable);
    await quickInsert(browser, 'Panel');

    await browser.paste(editable);
    const doc = await browser.$eval(editable, getDocFromElement);
    expect(doc).toMatchDocSnapshot();
  },
);

BrowserTestCase(
  'can insert mention into panel using click',
  { skip: ['ie', 'safari', 'edge'] },
  async client => {
    const browser = new Page(client);

    await browser.goto(fullpage.path);
    await browser.waitFor(editable);
    await browser.click(editable);
    await quickInsert(browser, 'Panel');

    await insertMentionUsingClick(browser, '0');
    const doc = await browser.$eval(editable, getDocFromElement);
    expect(doc).toMatchDocSnapshot();
  },
);

BrowserTestCase(
  'Table floating toolbar should be visible even after table scrolls',
  { skip: ['edge', 'ie', 'safari'] },
  async client => {
    const insertTableMenu = `[aria-label="${
      insertBlockMessages.table.defaultMessage
    }"]`;
    const tableControls = '[aria-label="Table floating controls"]';

    const browser = new Page(client);

    await browser.goto(fullpage.path);
    await browser.waitForSelector(editable);
    await browser.click(editable);
    await browser.click(insertTableMenu);
    await browser.waitForSelector(tableControls);

    await quickInsert(browser, 'Panel');

    // type some text
    await browser.type(editable, 'this text should be in the panel');

    // click on Error label
    const selector = `[aria-label="Error"]`;
    await browser.click(selector);

    const doc = await browser.$eval(editable, getDocFromElement);
    expect(doc).toMatchDocSnapshot();
    expect(await browser.isExisting(tableControls)).toBe(false);
    expect(await browser.isVisible(tableControls)).toBe(false);
  },
);
