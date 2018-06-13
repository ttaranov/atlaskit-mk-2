import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';

const fullPageEditor = getExampleUrl('editor', 'editor-core', 'full-page');
const editorSelector = '.ProseMirror';
const enterArr: string[] = [];
for (let i = 0; i < 40; i++) {
  enterArr.push('a');
  enterArr.push('Enter');
}

BrowserTestCase(
  'Extensions floating toolbar should be visible even after extension scrolls',
  { skip: ['edge', 'ie', 'safari'] },
  async client => {
    const dropdownMenu = '[aria-label="Open or close insert block dropdown"]';

    const bodiedExtensionItem = '.bodied-macro';

    const extensionOptions = '[aria-label="Extension options"]';

    const browser = await new Page(client);

    await browser.goto(fullPageEditor);
    await browser.waitForSelector(editorSelector);
    await browser.click(editorSelector);
    await browser.type(editorSelector, enterArr);
    await browser.click(dropdownMenu);
    await browser.click(bodiedExtensionItem);
    await browser.type(editorSelector, enterArr);
    expect(await browser.isExisting(extensionOptions)).toBe(true);
    expect(await browser.isVisible(extensionOptions)).toBe(true);
  },
);
