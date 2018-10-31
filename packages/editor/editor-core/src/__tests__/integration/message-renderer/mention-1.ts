import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import {
  getDocFromElement,
  editable,
  insertMention,
  mentionPicker,
} from '../_helpers';

import { messageEditor, lozenge } from './_message-renderer-helpers';

/*
 * Safari does not understand webdriver keyboard actions so a
 * number of tests have been skipped until move to snapshots.
 *
 * The remaining skipped tests for IE11/Edge are bugs that should be fixed for those browsers.
*/

BrowserTestCase(
  'mention-1.ts: user can see mention inside blockquote',
  { skip: ['safari', 'ie'] },
  async client => {
    const browser = new Page(client);
    await browser.goto(messageEditor);
    await browser.waitForSelector(editable);
    await browser.type(editable, '> ');
    await browser.type(editable, 'this is inside blockquote ');
    await insertMention(browser, 'Carolyn');
    await browser.waitForSelector(lozenge);
    const doc = await browser.$eval(editable, getDocFromElement);
    expect(doc).toMatchDocSnapshot();
  },
);

BrowserTestCase(
  'mention-1.ts: user can see mention inside bulletList',
  { skip: ['safari', 'ie'] },
  async client => {
    const browser = new Page(client);
    await browser.goto(messageEditor);
    await browser.waitForSelector(editable);
    await browser.type(editable, '* ');
    await browser.waitForSelector('ul');
    await browser.type(editable, 'this is inside list ');
    await insertMention(browser, 'Carolyn');
    await browser.waitForSelector(lozenge);
    const doc = await browser.$eval(editable, getDocFromElement);
    expect(doc).toMatchDocSnapshot();
  },
);

BrowserTestCase(
  'mention-1.ts: user can see mention inside orderedList',
  { skip: ['safari', 'ie'] },
  async client => {
    const browser = new Page(client);
    await browser.goto(messageEditor);
    await browser.waitForSelector(editable);
    await browser.type(editable, '1. ');
    await browser.waitForSelector('ol');
    await browser.type(editable, 'this is inside list ');
    await insertMention(browser, 'Carolyn');
    await browser.waitForSelector(lozenge);
    const doc = await browser.$eval(editable, getDocFromElement);
    expect(doc).toMatchDocSnapshot();
  },
);

BrowserTestCase(
  'mention-1.ts: user can see mention inside decision',
  { skip: ['ie', 'safari'] },
  async client => {
    const browser = new Page(client);
    await browser.goto(messageEditor);
    await browser.waitForSelector(editable);
    await browser.type(editable, '<> ');
    await insertMention(browser, 'Carolyn');
    await browser.waitForSelector(lozenge);
    const doc = await browser.$eval(editable, getDocFromElement);
    expect(doc).toMatchDocSnapshot();
  },
);

BrowserTestCase(
  'mention-1.ts: user can see mention inside action',
  { skip: ['ie', 'safari'] },
  async client => {
    const browser = new Page(client);
    await browser.goto(messageEditor);
    await browser.waitForSelector(editable);
    await browser.type(editable, '[] ');
    await insertMention(browser, 'Carolyn');
    await browser.waitForSelector(lozenge);
    const doc = await browser.$eval(editable, getDocFromElement);
    expect(doc).toMatchDocSnapshot();
  },
);

BrowserTestCase(
  'mention-1.ts: user can navigate picker using keyboard',
  { skip: ['ie', 'safari'] },
  async client => {
    const browser = new Page(client);
    await browser.goto(messageEditor);
    await browser.waitForSelector(editable);
    await browser.type(editable, '@');
    await browser.waitForSelector(mentionPicker);
    await browser.type(editable, 'ArrowDown');
    await browser.type(editable, 'Enter');
    const doc = await browser.$eval(editable, getDocFromElement);
    expect(doc).toMatchDocSnapshot();
  },
);
