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
