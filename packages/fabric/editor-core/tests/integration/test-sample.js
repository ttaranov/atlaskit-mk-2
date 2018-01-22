// @flow
// eslint-disable-next-line
import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
// eslint-disable-next-line
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

const messageEditor = `${
  global.__baseUrl__
}/examples/fabric/editor-core/message`;
const editable = `[contenteditable="true"]`;
const codeClass = '[class="code"]';
const enter = 'Enter';
const space = 'Space';

BrowserTestCase(
  'format tests on message editor',
  { skip: ['edge'] },
  async client => {
    const sample = await new Page(client);
    await sample.goto(messageEditor);
    const title = await sample.getTitle();
    // eslint-disable-next-line
    expect(title).toBe('Atlaskit by Atlassian');

    //if code
    await sample.setValue(editable, '`this`');
    await sample.addValue(editable, enter);
    const code = await sample.getText(codeClass);
    // eslint-disable-next-line
    expect(code).toBe('this');

    //if bold
    await sample.setValue(editable, '__bold__');
    await sample.addValue(editable, enter);
    const strong = await sample.getText('strong');
    // eslint-disable-next-line
    expect(strong).toBe('bold');

    //if italics
    await sample.setValue(editable, '_italics_');
    await sample.addValue(editable, space);
    const italics = await sample.getText('em');
    // eslint-disable-next-line
    expect(italics).toBe('italics');
  },
);
