import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import {
  getDocFromElement,
  insertMention,
  editable,
  mentionPicker,
} from '../_helpers';

import {
  messageEditor,
  lozenge as mentionId,
} from './_message-renderer-helpers';
import { messages } from '../../../plugins/insert-block/ui/ToolbarInsertBlock';

/*
 * Safari does not understand webdriver keyboard actions so a
 * number of tests have been skipped until move to snapshots.
 *
 * The remaining skipped tests for IE11/Edge are bugs that should be fixed for those browsers.
*/

BrowserTestCase(
  'mention-3.ts: user can click ToolbarMentionPicker and see mention',
  { skip: ['ie'] },
  async client => {
    const mentionButton = `[aria-label="${messages.mention.defaultMessage}"]`;
    const browser = new Page(client);
    await browser.goto(messageEditor);
    await browser.waitForSelector(editable);
    await browser.waitForSelector(mentionButton);
    await browser.click(mentionButton);
    await browser.waitForSelector(mentionId);
    await browser.click(mentionId);
    const doc = await browser.$eval(editable, getDocFromElement);
    expect(doc).toMatchDocSnapshot();
  },
);

// IE still has mentionQuery true at this point
BrowserTestCase(
  'mention-3.ts: should not insert on space if multiple exact nickname match',
  { skip: ['ie'] },
  async client => {
    const browser = new Page(client);
    await browser.goto(messageEditor);
    await browser.waitForSelector(editable);
    await browser.type(editable, '@');
    await browser.waitForSelector(mentionPicker);
    await browser.type(editable, 'gill');
    await browser.isVisible('[data-mention-name=pgill]');
    await browser.isVisible('[data-mention-name=jjackson]');
    await browser.type(editable, ' some');
    await browser.type(editable, ' text ');
    const doc = await browser.$eval(editable, getDocFromElement);
    expect(doc).toMatchDocSnapshot();
  },
);

BrowserTestCase(
  'mention-3.ts: inserted if space on single match',
  { skip: ['ie'] },
  async client => {
    const browser = new Page(client);
    await browser.goto(messageEditor);
    await browser.waitForSelector(editable);
    await browser.type(editable, '@');
    await browser.waitForSelector(mentionPicker);
    await browser.type(editable, 'Carolyn');
    // Wait until there is only one mention left in picker.
    await browser.browser.waitUntil(async () => {
      const mentionsInPicker = await browser.$$(
        `${mentionPicker} [data-mention-name]`,
      );
      return mentionsInPicker.value.length === 1;
    });
    await browser.type(editable, ' text ');
    const doc = await browser.$eval(editable, getDocFromElement);
    expect(doc).toMatchDocSnapshot();
  },
);

BrowserTestCase(
  'mention-3.ts: user should not see mention inside inline code',
  // TODO: Fix unknown character on BS
  { skip: ['safari', 'ie'] },
  async client => {
    const browser = new Page(client);
    await browser.goto(messageEditor);
    await browser.waitForSelector(editable);
    await browser.type(editable, '`this is inline code ');
    await insertMention(browser, 'Carolyn');
    await browser.type(editable, '`');
    const doc = await browser.$eval(editable, getDocFromElement);
    expect(doc).toMatchDocSnapshot();
  },
);

BrowserTestCase(
  'mention-3.ts: user should not see mention inside a code block',
  // TODO: Fix unknown character on BS
  { skip: ['safari', 'ie'] },
  async client => {
    const browser = new Page(client);
    await browser.goto(messageEditor);
    await browser.waitForSelector(editable);
    await browser.type(editable, '```');
    await browser.waitForSelector('pre');
    await browser.type(editable, ['this is a code block ', '@Caro']);
    await browser.type(editable, 'Return');
    const doc = await browser.$eval(editable, getDocFromElement);
    expect(doc).toMatchDocSnapshot();
  },
);

BrowserTestCase(
  'mention-3.ts: users with same first name should not be selected if space',
  { skip: ['ie'] },
  async client => {
    const browser = new Page(client);
    await browser.goto(messageEditor);
    await browser.waitForSelector(editable);
    await browser.type(editable, '@');
    await browser.waitForSelector(mentionPicker);
    await browser.type(editable, 'alica');
    await browser.isVisible('[data-mention-name=awoods]');
    await browser.isVisible('[data-mention-name=Fatima]');
    await browser.type(editable, ' some');
    await browser.type(editable, ' text');
    const doc = await browser.$eval(editable, getDocFromElement);
    expect(doc).toMatchDocSnapshot();
  },
);
