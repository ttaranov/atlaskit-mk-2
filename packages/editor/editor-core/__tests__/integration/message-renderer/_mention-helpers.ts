import { editorUrl } from '../_helpers';

export const messageEditor = `${editorUrl}=message-renderer`;
export const editable = `.ProseMirror`;
export const picker = '.ak-mention-picker';
export const lozenge = 'span[data-mention-id="0"][text="@Carolyn"]';

export const insertMention = async (browser, query: string) => {
  await browser.type(editable, '@');
  await browser.waitForSelector(picker);
  await browser.type(editable, query);
  await browser.type(editable, 'Return');
};
