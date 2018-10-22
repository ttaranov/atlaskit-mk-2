import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
import { getDocFromElement } from '../_helpers';

const messageEditor = getExampleUrl('editor', 'editor-core', 'message');
const editorSelector = '.ProseMirror';

BrowserTestCase(
  'format.ts: user should be able to create link using markdown',
  { skip: ['edge', 'ie'] },
  async client => {
    const sample = new Page(client);
    await sample.goto(messageEditor);
    await sample.waitForSelector(editorSelector);
    await sample.type(editorSelector, '[link](https://hello.com) ');

    await sample.waitForSelector('a');
    const doc = await sample.$eval(editorSelector, getDocFromElement);
    expect(doc).toMatchDocSnapshot();
  },
);

BrowserTestCase(
  'format.ts: user should be able to format bold and italics with markdown',
  { skip: ['edge', 'ie'] },
  async client => {
    const sample = new Page(client);
    await sample.goto(messageEditor);
    await sample.waitForSelector(editorSelector);
    await sample.type(editorSelector, '__bold__ ');
    await sample.type(editorSelector, '_italics_ ');
    await sample.type(editorSelector, '**starbold** ');
    await sample.type(editorSelector, '*italicsstar* ');

    await sample.waitForSelector('strong');
    const doc = await sample.$eval(editorSelector, getDocFromElement);
    expect(doc).toMatchDocSnapshot();
  },
);

BrowserTestCase(
  'format.ts: user should be able to write inline code',
  { skip: ['edge', 'ie'] },
  async client => {
    const sample = new Page(client);
    await sample.goto(messageEditor);
    await sample.waitForSelector(editorSelector);
    await sample.type(editorSelector, '`');
    await sample.type(editorSelector, 'this');
    await sample.type(editorSelector, '`');

    await sample.waitForSelector('pre');
    const doc = await sample.$eval(editorSelector, getDocFromElement);
    expect(doc).toMatchDocSnapshot();
  },
);
