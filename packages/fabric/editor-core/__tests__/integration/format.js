// @flow
// eslint-disable-next-line
import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
// eslint-disable-next-line
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

const messageEditor = `${
  global.__baseUrl__
}/examples/fabric/editor-core/message`;
const editable = `[contenteditable="true"]`;
const enter = 'Enter';
const space = 'Space';

BrowserTestCase(
  'format tests on message editor',
  { skip: ['edge', 'ie', 'safari'] },
  async client => {
    const sample = await new Page(client);
    await sample.goto(messageEditor);
    const title = await sample.title();
    // eslint-disable-next-line
    expect(title).toBe('Atlaskit by Atlassian');

    const markdown = '[link](https://hello.com)';
    const input = 'link';
    await sample.type(editable, [markdown, enter]);
    // eslint-disable-next-line
    expect(await sample.getText('a')).toContain(input);
  },
);

BrowserTestCase(
  'format tests on message editor',
  { skip: ['edge', 'ie', 'safari'] },
  async client => {
    const sample = await new Page(client);
    await sample.goto(messageEditor);
    //if bold
    await sample.type(editable, ['__bold__', enter]);
    // eslint-disable-next-line
    expect(await sample.getText('strong')).toContain('bold');

    //if bold
    await sample.type(editable, ['**starbold**', enter]);
    // eslint-disable-next-line
    expect(await sample.getText('strong')).toContain('starbold');
  },
);

BrowserTestCase(
  'format tests on message editor',
  { skip: ['edge', 'ie', 'safari'] },
  async client => {
    const sample = await new Page(client);
    await sample.goto(messageEditor);
    //if bold
    await sample.type(editable, ['_italics_', enter]);
    // eslint-disable-next-line
    expect(await sample.getText('em')).toContain('italics');

    //if bold
    await sample.type(editable, ['*italicsstar*', enter]);
    // eslint-disable-next-line
    expect(await sample.getText('em')).toContain('italicsstar');
  },
);

BrowserTestCase(
  'format tests on message editor',
  { skip: ['edge', 'ie', 'safari', 'firefox'] },
  async client => {
    const sample = await new Page(client);
    await sample.goto(messageEditor);
    //inline code
    await sample.type(editable, ['`this`', space]);
    // eslint-disable-next-line
    expect(await sample.getText('[class="code"]')).toBe('this');
  },
);
