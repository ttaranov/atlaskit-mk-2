// @flow
import { globals } from '../../../../../jest.config';
import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

const messageEditor = `${
  globals.__baseUrl__
}/examples/fabric/editor-core/message-renderer`;
const editable = `[contenteditable="true"]`;

BrowserTestCase(
  'user should be able to see emoji if typed the name in full',
  { skip: ['edge', 'ie', 'safari'] },
  async client => {
    const browser = await new Page(client);
    await browser.goto(messageEditor);
    const emoji = ':grinning:';
    await browser.type(editable, [emoji]);
    expect(await browser.isExisting('[shortname=":grinning:"]')).toBe(true);
    expect(
      await browser.isExisting('[data-emoji-short-name=":grinning:"]'),
    ).toBe(true);
    //add expect to validate the size of emoji here
  },
);

BrowserTestCase(
  'user should be able to see emoji when typed with bold',
  { skip: ['edge', 'ie', 'safari'] },
  async client => {
    const sample = await new Page(client);
    await sample.goto(messageEditor);
    const emoji = ' :)';
    await sample.type(editable, ['**bold**', emoji, ' ']);
    expect(await sample.isExisting('span[shortname=":slight_smile:"]')).toBe(
      true,
    );
    expect(
      await sample.isExisting('[data-emoji-short-name=":slight_smile:"]'),
    ).toBe(true);
    //add expect to validate the size of emoji
  },
);

BrowserTestCase(
  'user should not be able to see emoji inside inline code',
  { skip: ['edge', 'ie', 'safari'] },
  async client => {
    const sample = await new Page(client);
    await sample.goto(messageEditor);
    await sample.type(editable, ['`:)`', ' ']);
    expect(await sample.isExisting('span[shortname=":slight_smile:"]')).toBe(
      false,
    );
    expect(
      await sample.isExisting('[data-emoji-short-name=":slight_smile:"]'),
    ).toBe(false);
  },
);

//TO-DO below usecases
// BrowserTestCase(
//   'user should see emoji typeahead and select an emoji',
//   { skip: ['edge', 'ie', 'safari'] },
//   async client => {
//     const sample = await new Page(client);
//     await sample.goto(messageEditor);
//     await sample.type(editable, [':smile']);
//     await sample.waitForSelector('.ak-emoji-typeahead');
//     expect(await sample.isExisting('.ak-emoji-typeahead')).toBe(true);
//   }
// );

// BrowserTestCase(
//   'user should be able to use emoji inside task-decisions',
//   { skip: ['edge', 'ie', 'safari'] },
//   async client => {
//     const sample = await new Page(client);
//     await sample.goto(messageEditor);
//     await sample.type(editable, [':smile']);
//     await sample.waitForSelector('.ak-emoji-typeahead');
//     expect(await sample.isExisting('.ak-emoji-typeahead')).toBe(true);
//   }
// );

// BrowserTestCase(
//   'user should be able to use emoji inside blockquote',
//   { skip: ['edge', 'ie', 'safari'] },
//   async client => {
//     const sample = await new Page(client);
//     await sample.goto(messageEditor);
//     await sample.type(editable, [':smile']);
//     await sample.waitForSelector('.ak-emoji-typeahead');
//     expect(await sample.isExisting('.ak-emoji-typeahead')).toBe(true);
//   }
// );

// BrowserTestCase(
//   'user should be able to use emoji inside of a list,
//   { skip: ['edge', 'ie', 'safari'] },
//   async client => {
//     const sample = await new Page(client);
//     await sample.goto(messageEditor);
//     await sample.type(editable, [':smile']);
//     await sample.waitForSelector('.ak-emoji-typeahead');
//     expect(await sample.isExisting('.ak-emoji-typeahead')).toBe(true);
//   }
// );
