import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

const __baseUrl__ = 'http://localhost:9000';
const messageEditor = `${__baseUrl__}/examples/fabric/editor-core/message-renderer`;
const editable = `[contenteditable="true"]`;
const emojiTypeAhead = '.ak-emoji-typeahead';
const decisions = 'span[aria-label="Decision"]';

BrowserTestCase(
  'user should be able to see emoji if typed the name in full',
  { skip: ['edge'] },
  async client => {
    const browser = await new Page(client);
    await browser.goto(messageEditor);
    const emoji = ':grinning:';
    await browser.waitForSelector(editable);
    await browser.type(editable, [emoji]);
    await browser.waitForSelector('span[shortname=":grinning:"]');
    expect(await browser.isExisting('[shortname=":grinning:"]')).toBe(true);
    expect(
      await browser.isExisting('[data-emoji-short-name=":grinning:"]'),
    ).toBe(true);
    const emojiSprite = await browser.getElementSize(
      '.emoji-common-emoji-sprite',
    );
    expect(await emojiSprite[0].width).toBe(20);
    expect(await emojiSprite[0].height).toBe(20);
    expect(await emojiSprite[1].width).toBe(40);
    expect(await emojiSprite[1].height).toBe(40);
  },
);

BrowserTestCase(
  'user should be able to see emoji when typed into heading',
  { skip: ['edge', 'ie'] },
  async client => {
    const browser = await new Page(client);
    await browser.goto(messageEditor);
    await browser.waitForSelector(editable);
    await browser.type(editable, ['# heading', ' :) ']);
    await browser.waitForSelector('[shortname=":slight_smile:"]');
    expect(await browser.isExisting('[shortname=":slight_smile:"]')).toBe(true);
    expect(
      await browser.isExisting('[data-emoji-short-name=":slight_smile:"]'),
    ).toBe(true);
  },
);

BrowserTestCase(
  'user should not be able to see emoji inside inline code',
  async client => {
    const browser = await new Page(client);
    await browser.goto(messageEditor);
    await browser.waitForSelector(editable);
    await browser.type(editable, ['this is code', '`:)`']);
    expect(
      await browser.isExisting('[data-emoji-short-name=":slight_smile:"]'),
    ).toBe(false);
  },
);

BrowserTestCase(
  'user should see emoji typeahead',
  { skip: ['edge'] },
  async client => {
    const browser = await new Page(client);
    await browser.goto(messageEditor);
    await browser.waitForSelector(editable);
    await browser.type(editable, ['this ', ':smile']);
    await browser.waitForSelector(emojiTypeAhead);
    expect(await browser.isExisting(emojiTypeAhead)).toBe(true);
  },
);
