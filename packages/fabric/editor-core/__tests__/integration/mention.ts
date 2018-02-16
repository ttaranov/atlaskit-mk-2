// @flow
import { globals } from '../../../../../jest.config';
import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

const messageEditor = `${
  globals.__baseUrl__
}/examples/fabric/editor-core/message-renderer`;
const editable = `[contenteditable="true"]`;

BrowserTestCase(
  'user should see mention picker if they type "@"',
  { skip: ['edge', 'ie', 'safari', 'firefox'] },
  async client => {
    const browser = await new Page(client);
    await browser.goto(messageEditor);
    await browser.type(editable, '@');
    await browser.waitForSelector('.ak-mention-picker');
    expect(await browser.isExisting('[data-mention-query="true"]')).toBe(true);
    expect(await browser.isExisting('.ak-mention-picker')).toBe(true);
  },
);

BrowserTestCase(
  'user should see space after mention',
  { skip: ['edge', 'ie', 'safari', 'firefox'] },
  async client => {
    const browser = await new Page(client);
    await browser.goto(messageEditor);
    await browser.type(editable, ['@Summer', 'Enter']);
    await browser.waitForSelector('span=@Summer');
    expect(await browser.getText('p')).toContain('@Summer  ');
  },
);

BrowserTestCase(
  'users with same first name should not be selected if space',
  { skip: ['edge', 'ie', 'safari', 'firefox'] },
  async client => {
    const browser = await new Page(client);
    await browser.goto(messageEditor);
    await browser.type(editable, ['@', 'alica ']);
    await browser.waitForSelector('.ak-mention-picker');
    await browser.isVisible('[data-mention-name=awoods]');
    await browser.waitForSelector('[data-mention-name=Fatima]');
    await browser.isVisible('[data-mention-name=Fatima]');
    await browser.click('[data-mention-name=Fatima]');
    await browser.waitForSelector('span=@Jasmine');
    expect(await browser.isExisting('span=@Jasmine')).toBe(true);
  },
);

BrowserTestCase(
  'users should be selected on enter',
  { skip: ['edge', 'ie', 'safari', 'firefox'] },
  async client => {
    const browser = await new Page(client);
    await browser.goto(messageEditor);
    await browser.type(editable, ['@', 'alica ', 'Enter']);
    expect(await browser.isExisting('span=@awoods')).toBe(true);
  },
);

BrowserTestCase(
  'user selecting from picker renders mention node and closes picker',
  { skip: ['edge', 'ie', 'safari', 'firefox'] },
  async client => {
    const browser = await new Page(client);
    await browser.goto(messageEditor);
    await browser.type(editable, '@');
    await browser.waitForSelector('[data-mention-id="0"]');
    await browser.click('[data-mention-id="0"]');
    expect(await browser.isExisting('.ak-mention-picker')).toBe(false);
    expect(await browser.isExisting('span=@Carolyn')).toBe(true);
  },
);

BrowserTestCase(
  'user should be able to add mentions inside action',
  { skip: ['edge', 'ie', 'safari', 'firefox'] },
  async client => {
    const browser = await new Page(client);
    await browser.goto(messageEditor);
    await browser.type(editable, ['[] ', '@all', 'Enter']);
    await browser.waitForSelector('[type="checkbox"]');
    await browser.waitForSelector('span=@all');
    expect(await browser.isExisting('span=@all')).toBe(true);
  },
);
