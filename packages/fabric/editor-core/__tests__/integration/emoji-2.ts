import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

const __baseUrl__ = 'http://localhost:9000';
const messageEditor = `${__baseUrl__}/examples/fabric/editor-core/message-renderer`;
const editable = `[contenteditable="true"]`;
const emojiTypeAhead = '.ak-emoji-typeahead';
const decisions = 'span[aria-label="Decision"]';
BrowserTestCase(
  'user should be able to use emoji inside blockquote',
  { skip: ['edge', 'ie'] },
  async client => {
    const browser = await new Page(client);
    await browser.goto(messageEditor);
    await browser.type(editable, ['> this is inside blockquote :a:']);
    await browser.waitForSelector('[data-emoji-short-name=":a:"]');
    expect(await browser.isExisting('[data-emoji-short-name=":a:"]')).toBe(
      true,
    );
  },
);

BrowserTestCase(
  'user should be able to use emoji inside bulletList',
  async client => {
    const browser = await new Page(client);
    await browser.goto(messageEditor);
    await browser.type(editable, ['* this is inside list :a: ']);
    await browser.waitForSelector('[data-emoji-short-name=":a:"]');
    expect(await browser.isExisting('[data-emoji-short-name=":a:"]')).toBe(
      true,
    );
  },
);

BrowserTestCase(
  'user should be able to use emoji inside orderedList',
  { skip: ['edge'] },
  async client => {
    const browser = await new Page(client);
    await browser.goto(messageEditor);
    await browser.type(editable, ['1. this is inside list :a:']);
    await browser.waitForSelector('[data-emoji-short-name=":a:"]');
    expect(await browser.isExisting('[data-emoji-short-name=":a:"]')).toBe(
      true,
    );
  },
);

BrowserTestCase(
  'user should be able to navigate between emojis',
  { skip: ['edge', 'ie', 'safari', 'firefox'] },
  async client => {
    const browser = await new Page(client);
    await browser.goto(messageEditor);
    await browser.waitForSelector(editable);
    await browser.type(editable, [
      'this ',
      ':a: ',
      ':a: ',
      ':a: ',
      'ArrowLeft',
      'ArrowLeft',
      'this is more text',
    ]);
    // tslint:disable-next-line:no-construct
    const output = new String(await browser.getHTML('p'));
    const actual = output.replace(/class=\"(\w+)\"/gi, 'class="test-name"');
    const expected = `<p>this <span shortname=":a:" id="1f170" text="🅰" contenteditable="false"><span class="test-name"><span data-emoji-id="1f170" data-emoji-short-name=":a:" data-emoji-text="🅰"><span class="test-name" aria-label=":a:"><span><span class="emoji-common-emoji-sprite" style="background-image: url(&quot;https://pf-emoji-service--cdn.us-east-1.prod.public.atl-paas.net/standard/551c9814-1d37-4573-819d-afab3afeaf32/64x64/symbols.png&quot;); background-position: 47.0588% 18.75%; background-size: 1800% 1700%; width: 20px; height: 20px;">&nbsp;</span></span></span></span></span></span> <span shortname=":a:" id="1f170" text="🅰" contenteditable="false"><span class="test-name"><span data-emoji-id="1f170" data-emoji-short-name=":a:" data-emoji-text="🅰"><span class="test-name" aria-label=":a:"><span><span class="emoji-common-emoji-sprite" style="background-image: url(&quot;https://pf-emoji-service--cdn.us-east-1.prod.public.atl-paas.net/standard/551c9814-1d37-4573-819d-afab3afeaf32/64x64/symbols.png&quot;); background-position: 47.0588% 18.75%; background-size: 1800% 1700%; width: 20px; height: 20px;">&nbsp;</span></span></span></span></span></span> this is more text<span shortname=":a:" id="1f170" text="🅰" contenteditable="false"><span class="test-name"><span data-emoji-id="1f170" data-emoji-short-name=":a:" data-emoji-text="🅰"><span class="test-name" aria-label=":a:"><span><span class="emoji-common-emoji-sprite" style="background-image: url(&quot;https://pf-emoji-service--cdn.us-east-1.prod.public.atl-paas.net/standard/551c9814-1d37-4573-819d-afab3afeaf32/64x64/symbols.png&quot;); background-position: 47.0588% 18.75%; background-size: 1800% 1700%; width: 20px; height: 20px;">&nbsp;</span></span></span></span></span></span> </p>`;
    expect(actual).toContain(expected);
  },
);

BrowserTestCase(
  'user should be able remove emoji on backspace',
  { skip: ['ie', 'edge', 'safari', 'firefox'] },
  async client => {
    const emojiId = `[data-emoji-short-name=":smile:"]`;
    const browser = await new Page(client);
    await browser.goto(messageEditor);
    await browser.waitForSelector(editable);
    await browser.type(editable, ['this ', ':smile:']);
    await browser.waitForSelector(emojiId);
    await browser.type(editable, ['Backspace', 'Backspace']);
    expect(await browser.isExisting(emojiId)).toBe(false);
  },
);

BrowserTestCase(
  'user should be able to click on the emoji button and select emoji',
  async client => {
    const emojiButton = '[aria-label="Insert emoji (:)"]';
    const sweatSmile = '[aria-label=":sweat_smile:"]';
    const browser = await new Page(client);
    await browser.goto(messageEditor);
    await browser.waitForSelector(editable);
    await browser.waitForSelector(emojiButton);
    await browser.click(emojiButton);
    await browser.waitForSelector(sweatSmile);
    await browser.click(sweatSmile);
    expect(
      await browser.isExisting('[data-emoji-short-name=":sweat_smile:"]'),
    ).toBe(true);
  },
);

BrowserTestCase(
  'user should be able to select emoji inside task-decisions',
  { skip: ['safari'] },
  async client => {
    const browser = await new Page(client);
    await browser.goto(messageEditor);
    await browser.waitForSelector(editable);
    await browser.type(editable, '<>  ');
    await browser.waitForSelector(decisions);
    await browser.type(editable, ['this ', ':smile']);
    await browser.waitForSelector(emojiTypeAhead);
    await browser.waitForSelector('.ak-emoji-typeahead-list');
    await browser.isVisible('span=:smile:');
    await browser.click('span=:smile:');
    expect(await browser.isExisting('[data-emoji-short-name=":smile:"]')).toBe(
      true,
    );
  },
);

BrowserTestCase(
  'user should be able to change text with emoji into decisions',
  async client => {
    const createDecisions = '[aria-label="Create decision"]';
    const browser = await new Page(client);
    await browser.goto(messageEditor);
    await browser.waitForSelector(editable);
    await browser.type(editable, ['this ', ':smile:']);
    await browser.waitForSelector(createDecisions);
    await browser.click(createDecisions);
    await browser.waitForSelector(decisions);
    await browser.isExisting(decisions);
    expect(await browser.isExisting('[data-emoji-short-name=":smile:"]')).toBe(
      true,
    );
  },
);
