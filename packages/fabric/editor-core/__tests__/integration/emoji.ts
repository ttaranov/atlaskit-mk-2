// @flow
import { globals } from '../../../../../jest.config';
import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import { render } from 'enzyme';

const messageEditor = `${
  globals.__baseUrl__
}/examples/fabric/editor-core/message-renderer`;
const editable = `[contenteditable="true"]`;
const emojiTypeAhead = '.ak-emoji-typeahead';

BrowserTestCase(
  'user should be able to see emoji if typed the name in full',
  { skip: ['edge', 'ie', 'safari', 'firefox'] },
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
  { skip: ['edge', 'ie', 'safari', 'firefox'] },
  async client => {
    const browser = await new Page(client);
    await browser.goto(messageEditor);
    await browser.waitForSelector(editable);
    await browser.type(editable, ['# heading', ' :)', ' is heading']);
    await browser.waitForSelector('span[shortname=":slight_smile:"]');

    expect(await browser.isExisting('span[shortname=":slight_smile:"]')).toBe(
      true,
    );
    expect(
      await browser.isExisting('span[data-emoji-short-name=":slight_smile:"]'),
    ).toBe(true);
  },
);

BrowserTestCase(
  'user should not be able to see emoji inside inline code',
  { skip: ['edge', 'ie', 'safari', 'chrome'] },
  async client => {
    const browser = await new Page(client);
    await browser.goto(messageEditor);
    await browser.waitForSelector(editable);
    await browser.type(editable, ['this is code', '`:)`']);
    expect(await browser.isExisting('span[shortname=":slight_smile:"]')).toBe(
      false,
    );
    expect(
      await browser.isExisting('[data-emoji-short-name=":slight_smile:"]'),
    ).toBe(false);
  },
);

//TO-DO below usecases
BrowserTestCase(
  'user should see emoji typeahead',
  { skip: ['edge', 'ie', 'safari', 'firefox'] },
  async client => {
    const browser = await new Page(client);
    await browser.goto(messageEditor);
    await browser.waitForSelector(editable);
    await browser.type(editable, ['this ', ':smile']);
    await browser.waitForSelector(emojiTypeAhead);
    expect(await browser.isExisting('.ak-emoji-typeahead')).toBe(true);
  },
);

BrowserTestCase(
  'user should be able to use emoji inside blockquote',
  { skip: ['edge', 'ie', 'safari', 'firefox'] },
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
  'user should be able to navigate between emojis',
  { skip: ['edge', 'ie', 'safari', 'firefox'] },
  async client => {
    const browser = await new Page(client);
    await browser.goto(messageEditor);
    await browser.waitForSelector(editable);
    await browser.type(editable, [
      'this ',
      ':a:',
      ':a:',
      ':a:',
      'ArrowLeft',
      'ArrowLeft',
      'this is more text',
    ]);
    await browser.waitForSelector('[data-emoji-short-name=":a:"]');
    const output = new String(await browser.getHTML('p'));
    const actual = output.replace(/class=\"(\w+)\"/gi, 'class="test-name"');
    const expected = `<p>this <span shortname=":a:" id="1f170" text="🅰" contenteditable="false"><span class="test-name"><span data-emoji-id="1f170" data-emoji-short-name=":a:" data-emoji-text="🅰"><span class="test-name" aria-label=":a:"><span><span class="emoji-common-emoji-sprite" style="background-image: url(&quot;https://pf-emoji-service--cdn.us-east-1.prod.public.atl-paas.net/standard/551c9814-1d37-4573-819d-afab3afeaf32/64x64/symbols.png&quot;); background-position: 47.0588% 18.75%; background-size: 1800% 1700%; width: 20px; height: 20px;">&nbsp;</span></span></span></span></span></span> <span shortname=":a:" id="1f170" text="🅰" contenteditable="false"><span class="test-name"><span data-emoji-id="1f170" data-emoji-short-name=":a:" data-emoji-text="🅰"><span class="test-name" aria-label=":a:"><span><span class="emoji-common-emoji-sprite" style="background-image: url(&quot;https://pf-emoji-service--cdn.us-east-1.prod.public.atl-paas.net/standard/551c9814-1d37-4573-819d-afab3afeaf32/64x64/symbols.png&quot;); background-position: 47.0588% 18.75%; background-size: 1800% 1700%; width: 20px; height: 20px;">&nbsp;</span></span></span></span></span></span> this is more text<span shortname=":a:" id="1f170" text="🅰" contenteditable="false"><span class="test-name"><span data-emoji-id="1f170" data-emoji-short-name=":a:" data-emoji-text="🅰"><span class="test-name" aria-label=":a:"><span><span class="emoji-common-emoji-sprite" style="background-image: url(&quot;https://pf-emoji-service--cdn.us-east-1.prod.public.atl-paas.net/standard/551c9814-1d37-4573-819d-afab3afeaf32/64x64/symbols.png&quot;); background-position: 47.0588% 18.75%; background-size: 1800% 1700%; width: 20px; height: 20px;">&nbsp;</span></span></span></span></span></span> </p>`;
    expect(actual).toContain(expected);
  },
);

// BrowserTestCase(
//   'user should be able to click on the emoji button',
//   { skip: ['edge', 'ie', 'safari'] },
//   async client => {
//     const sample = await new Page(client);
//     await sample.goto(messageEditor);
//     await sample.type(editable, [':smile']);
//     await sample.waitForSelector('.ak-emoji-typeahead');
//     expect(await sample.isExisting('.ak-emoji-typeahead')).toBe(true);
//   }
// );
