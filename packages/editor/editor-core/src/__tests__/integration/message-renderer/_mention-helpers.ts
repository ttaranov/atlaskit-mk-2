import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';

export const messageEditor = getExampleUrl(
  'editor',
  'editor-core',
  'message-renderer',
);
export const editable = `.ProseMirror`;
export const picker = '.fabric-editor-typeahead';
export const lozenge = '[data-mention-id="0"]';

export const insertMention = async (browser, query: string) => {
  await browser.type(editable, '@');
  await browser.waitForSelector(picker);
  await browser.type(editable, query);
  await browser.type(editable, 'Return');
};

export const insertMentionUsingClick = async (browser, mentionId: string) => {
  await browser.type(editable, '@');
  await browser.waitForSelector(picker);
  await browser.isVisible(`div[data-mention-id="${mentionId}"`);
  await browser.click(`div[data-mention-id="${mentionId}"`);
};
