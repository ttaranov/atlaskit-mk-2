import { editorUrl } from '../_helpers';

export const messageEditor = `${editorUrl}=message-renderer`;
export const editable = `.ProseMirror`;
export const typeahead = '.ak-emoji-typeahead';

export const insertEmoji = async (browser, query: string) => {
  await browser.type(editable, ':');
  await browser.waitForSelector(typeahead);
  await browser.type(editable, [query, ':']);
};

export let emojiItem = function(emojiShortName: string): string {
  return `span[shortname=":${emojiShortName}:"]`;
};
