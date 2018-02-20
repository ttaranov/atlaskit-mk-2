// @flow
import { globals } from '../../../../../jest.config';
import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

const messageEditor = `${
  globals.__baseUrl__
}/examples/fabric/editor-core/message-renderer`;
const editable = `[contenteditable="true"]`;
const picker = '.ak-mention-picker';
const lozenge = 'span=@Carolyn';

const insertMention = async (browser, query: string) => {
  await browser.type(editable, '@');
  await browser.waitForSelector(picker);
  await browser.type(editable, query);
  await browser.type(editable, 'Enter');
};

// BrowserTestCase(
//   'user should see mention picker if they type "@"',
//   async client => {
//     const browser = await new Page(client);
//     await browser.goto(messageEditor);
//     await browser.type(editable, '@');
//     await browser.waitForSelector(picker);
//     expect(await browser.isExisting('[data-mention-query="true"]')).toBe(true);
//     expect(await browser.isExisting(picker)).toBe(true);
//   },
// );

BrowserTestCase(
  'escape should close mention picker',
  // { skip: ['safari'] },
  async client => {
    const browser = await new Page(client);
    await browser.goto(messageEditor);
    await browser.type(editable, '@');
    await browser.waitForSelector(picker);
    await browser.type(editable, 'Escape');
    expect(await browser.isExisting(picker)).toBe(false);
  },
);

// BrowserTestCase(
//   'user should be able to click on ToolbarMentionPicker and click to select a mention',
//   // { skip: ['edge', 'ie', 'safari'] },
//   async client => {
//     const mentionButton = '[aria-label="Add mention"]';
//     const mentionId = '[data-mention-id="0"]';
//     const browser = await new Page(client);
//     await browser.goto(messageEditor);
//     await browser.waitForSelector(editable);
//     await browser.waitForSelector(mentionButton);
//     await browser.click(mentionButton);
//     await browser.waitForSelector(mentionId);
//     await browser.click(mentionId);
//     expect(await browser.isExisting(picker)).toBe(false);
//     expect(await browser.isExisting(lozenge)).toBe(true);
//   },
// );

BrowserTestCase(
  'user can navigate picker using keyboard',
  // { skip: ['edge', 'ie', 'safari'] },
  async client => {
    const browser = await new Page(client);
    await browser.goto(messageEditor);
    await browser.type(editable, '@');
    await browser.waitForSelector(picker);
    await browser.type(editable, ['ArrowDown', 'Enter']);
    expect(await browser.isExisting(picker)).toBe(false);
    expect(await browser.isExisting('span=@Kaitlyn Prouty')).toBe(true);
  },
);

// BrowserTestCase(
//   'user should be able to use mention inside blockquote',
//   // { skip: ['edge', 'ie', 'safari'] },
//   async client => {
//     const browser = await new Page(client);
//     await browser.goto(messageEditor);
//     await browser.type(editable, ['> ', 'this is inside blockquote ']);
//     await insertMention(browser, 'Carolyn');
//     await browser.waitForSelector(lozenge);
//     expect(await browser.isExisting(lozenge)).toBe(true);
//   },
// );

// BrowserTestCase(
//   'user should be able to use mention inside bulletList',
//   // { skip: ['edge', 'ie', 'safari'] },
//   async client => {
//     const browser = await new Page(client);
//     await browser.goto(messageEditor);
//     await browser.type(editable, ['* ', 'this is inside list ']);
//     await insertMention(browser, 'Carolyn');
//     await browser.waitForSelector(lozenge);
//     expect(await browser.isExisting(lozenge)).toBe(true);
//   },
// );

// BrowserTestCase(
//   'user should be able to use emoji inside orderedList',
//   // { skip: ['edge', 'ie', 'safari'] },
//   async client => {
//     const browser = await new Page(client);
//     await browser.goto(messageEditor);
//     await browser.type(editable, ['1. ', 'this is inside list ']);
//     await insertMention(browser, 'Carolyn');
//     await browser.waitForSelector(lozenge);
//     expect(await browser.isExisting(lozenge)).toBe(true);
//   },
// );

BrowserTestCase(
  'user should be able to add mentions inside decision',
  // { skip: ['edge', 'ie', 'safari'] },
  async client => {
    const browser = await new Page(client);
    await browser.goto(messageEditor);
    await browser.type(editable, '<> ');
    await insertMention(browser, 'Carolyn');
    await browser.waitForSelector(lozenge);
    expect(await browser.isExisting(picker)).toBe(false);
    expect(await browser.isExisting(lozenge)).toBe(true);
  },
);

BrowserTestCase(
  'user should be able to add mentions inside action',
  // { skip: ['edge', 'ie', 'safari'] },
  async client => {
    const browser = await new Page(client);
    await browser.goto(messageEditor);
    await browser.type(editable, '[] ');
    await insertMention(browser, 'Carolyn');
    await browser.waitForSelector(lozenge);
    expect(await browser.isExisting(lozenge)).toBe(true);
  },
);

// BrowserTestCase(
//   'user should not be able to see mention inside a code block',
//   // { skip: ['edge', 'ie', 'safari'] },
//   async client => {
//     const browser = await new Page(client);
//     await browser.goto(messageEditor);
//     await browser.waitForSelector(editable);
//     await browser.type(editable, ['```this is a code block ', '@Caro', 'Enter']);
//     expect(await browser.isExisting(picker)).toBe(false);
//     expect(await browser.isExisting(lozenge)).toBe(false);
//   },
// );

// BrowserTestCase(
//   'user should not be able to see mention inside inline code',
//   // { skip: ['edge', 'ie', 'safari'] },
//   async client => {
//     const browser = await new Page(client);
//     await browser.goto(messageEditor);
//     await browser.waitForSelector(editable);
//     await browser.type(editable, '`this is inline code ');
//     await insertMention(browser, 'Carolyn');
//     await browser.type(editable, '`');
//     expect(await browser.isExisting(picker)).toBe(false);
//     expect(await browser.isExisting(lozenge)).toBe(false);
//   },
// );

BrowserTestCase(
  'Mention inserted if exact unique nickname match ',
  // { skip: ['edge', 'ie', 'safari'] },
  async client => {
    const browser = await new Page(client);
    await browser.goto(messageEditor);
    await browser.type(editable, '@Carolyn');
    await browser.waitForSelector(picker);
    await browser.type(editable, ' text ');
    expect(await browser.isExisting(lozenge)).toBe(true);
  },
);

BrowserTestCase(
  'user should see space after mention',
  // { skip: ['edge', 'ie', 'safari'] },
  async client => {
    const browser = await new Page(client);
    await browser.goto(messageEditor);
    await insertMention(browser, 'Summer');
    await browser.waitForSelector('span=@Summer');
    expect(await browser.getText('p')).toContain('@Summer  ');
  },
);

BrowserTestCase(
  'user should be able remove mention on backspace',
  // { skip: ['edge', 'ie', 'safari'] },
  async client => {
    const browser = await new Page(client);
    await browser.goto(messageEditor);
    await browser.waitForSelector(editable);
    await insertMention(browser, 'Carolyn');
    await insertMention(browser, 'Summer');
    await insertMention(browser, 'Amber');
    await browser.type(editable, ['Backspace', 'Backspace']);
    await browser.waitForSelector(lozenge);
    expect(await browser.isExisting('span=@Summer')).toBe(true);
    expect(await browser.isExisting('span=@Amber')).toBe(false);
  },
);

BrowserTestCase(
  '@ <space> should not invoke mentions picker',
  // { skip: ['edge', 'ie', 'safari'] },
  async client => {
    const browser = await new Page(client);
    await browser.goto(messageEditor);
    await browser.waitForSelector(editable);
    await browser.type(editable, '@ Carolyn');
    expect(await browser.isExisting(picker)).toBe(false);
  },
);

// BrowserTestCase(
//   'text@ should not invoke mentions picker',
//   // { skip: ['edge', 'ie', 'safari'] },
//   async client => {
//     const browser = await new Page(client);
//     await browser.goto(messageEditor);
//     await browser.waitForSelector(editable);
//     await browser.type(editable, 'test@');
//     expect(await browser.isExisting(picker)).toBe(false);
//   },
// );

BrowserTestCase(
  'users with same first name should not be selected if space',
  // { skip: ['edge', 'ie', 'safari'] },
  async client => {
    const browser = await new Page(client);
    await browser.goto(messageEditor);
    await browser.waitForSelector(editable);
    await browser.type(editable, '@');
    await browser.waitForSelector(picker);
    await browser.type(editable, 'alica');
    await browser.isVisible('[data-mention-name=awoods]');
    await browser.isVisible('[data-mention-name=Fatima]');
    await browser.type(editable, ' some');
    await browser.type(editable, ' text');
    expect(await browser.isExisting('span=@awoods')).toBe(false);
  },
);

BrowserTestCase(
  'insert on space if unique exact nickname match, with multiple results',
  // { skip: ['edge', 'ie', 'safari'] },
  async client => {
    const browser = await new Page(client);
    await browser.goto(messageEditor);
    await browser.waitForSelector(editable);
    await browser.type(editable, '@');
    await browser.waitForSelector(picker);
    await browser.type(editable, 'penelope');
    await browser.isVisible('[data-mention-name=pgill]');
    await browser.isVisible('[data-mention-name=plim]');
    await browser.type(editable, ' some');
    await browser.type(editable, ' text');
    expect(await browser.isExisting('span=@penelope')).toBe(true);
  },
);

BrowserTestCase(
  'should not insert on space if multiple exact nickname match',
  // { skip: ['edge', 'ie', 'safari'] },
  async client => {
    const browser = await new Page(client);
    await browser.goto(messageEditor);
    await browser.waitForSelector(editable);
    await browser.type(editable, '@');
    await browser.waitForSelector(picker);
    await browser.type(editable, 'gill');
    await browser.isVisible('[data-mention-name=pgill]');
    await browser.isVisible('[data-mention-name=jjackson]');
    await browser.type(editable, ' some');
    await browser.type(editable, ' text');
    expect(await browser.isExisting('span=@gill')).toBe(false);
  },
);
