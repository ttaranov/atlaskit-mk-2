import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import { getDocFromElement, editorUrl } from '../_helpers';

const messageEditor = `${editorUrl}=message`;
const editorSelector = '.ProseMirror';

BrowserTestCase(
  'user should be able to create link using markdown',
  { skip: ['edge', 'ie'] },
  async client => {
    const sample = await new Page(client);
    await sample.goto(messageEditor);
    const title = await sample.title();
    expect(title).toBe('Atlaskit by Atlassian');
    await sample.waitForSelector(editorSelector);
    await sample.type(editorSelector, '[link](https://hello.com) ');

    await sample.waitForSelector('a');
    const doc = await sample.$eval(editorSelector, getDocFromElement);
    expect(doc).toMatchDocSnapshot();
  },
);

BrowserTestCase(
  'user should be able to format bold and italics with markdown',
  { skip: ['edge', 'ie'] },
  async client => {
    const sample = await new Page(client);
    await sample.goto(messageEditor);
    await sample.waitForSelector(editorSelector);
    await sample.type(
      editorSelector,
      '__bold__ _italics_ **starbold** *italicsstar* ',
    );

    await sample.waitForSelector('strong');
    const doc = await sample.$eval(editorSelector, getDocFromElement);
    expect(doc).toMatchDocSnapshot();
  },
);

BrowserTestCase(
  'user should be able to write inline code',
  { skip: ['edge', 'ie'] },
  async client => {
    const sample = await new Page(client);
    await sample.goto(messageEditor);
    await sample.waitForSelector(editorSelector);
    await sample.type(editorSelector, '`this` ');

    await sample.waitForSelector('pre');
    const doc = await sample.$eval(editorSelector, getDocFromElement);
    expect(doc).toMatchDocSnapshot();
  },
);
