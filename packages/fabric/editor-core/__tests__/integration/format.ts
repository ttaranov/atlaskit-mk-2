// @flow
import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

const __baseUrl__ = `http://localhost:9000`;
const messageEditor = `${__baseUrl__}/examples/fabric/editor-core/message`;
const editable = `[contenteditable="true"]`;
const enter = 'Enter';

// BrowserTestCase(
//   'user should be able to create link using markdown',
//   { skip: ['edge'] },
//   async client => {
//     const sample = await new Page(client);
//     await sample.goto(messageEditor);
//     const title = await sample.title();
//     expect(title).toBe('Atlaskit by Atlassian');
//     const markdown = '[link](https://hello.com) ';
//     await sample.waitForSelector(editable);
//     await sample.type(editable, [markdown, enter]);
//     await sample.waitForSelector('a');
//     const editableContent = await sample.validatePMNode();
//     expect(editableContent.value).toMatchSnapshot();
//   },
// );

BrowserTestCase(
  'user should be able to format bold and italics with markdown',
  { skip: ['edge'] },
  async client => {
    const sample = await new Page(client);
    await sample.goto(messageEditor);
    await sample.waitForSelector(editable);
    await sample.type(editable, ['__bold__ ', '_italics_ ', enter]);
    await sample.type(editable, ['**starbold** ', '*italicsstar*', enter]);
    await sample.waitForSelector('strong');
    await sample.waitForSelector('em');
    const editableContent = await sample.validatePMNode();
    expect(editableContent.value).toMatchSnapshot();
    // expect(await sample.getText('strong')).toContain('bold');
    // expect(await sample.getText('strong')).toContain('starbold');
    // expect(await sample.getText('em')).toContain('italics');
    // expect(await sample.getText('em')).toContain('italicsstar');
  },
);

// BrowserTestCase(
//   'user should be able to write inline code',
//   { skip: ['edge'] },
//   async client => {
//     const sample = await new Page(client);
//     await sample.goto(messageEditor);
//     await sample.waitForSelector(editable);
//     await sample.type(editable, ['`this` ']);
//     await sample.waitForSelector('[class="code"]');
//     expect(await sample.getText('[class="code"]')).toBe('this');
//   },
// );
