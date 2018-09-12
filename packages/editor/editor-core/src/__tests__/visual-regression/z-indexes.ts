import { removeOldProdSnapshots } from '@atlaskit/visual-regression/helper';

import { imageSnapshotFolder, initEditor, clearEditor } from './_utils';

const insertTable = async page => {
  await page.click('span[aria-label="Insert table"]');
  await page.waitForSelector('table td p');
};

const snapshot = async page => {
  const image = await page.screenshot();
  // @ts-ignore
  expect(image).toMatchProdImageSnapshot();
};

const blockFormattingDropdown = 'span[aria-label="Change formatting"]';
const removeTablePopup = 'span[aria-label="Remove table"]';
const dropList = 'div[data-role="droplistContent"]';
const insertBlockDropdown =
  'span[aria-label="Open or close insert block dropdown"]';
const popupPresent = 'div[data-editor-popup="true"]';
const emojiButton = 'span[aria-label="Insert emoji"]';
const emojiPicker = 'div[data-emoji-picker-container="true"]';
const mentionButton = 'span[aria-label="Add mention"]';
const mentionPicker = 'span[data-mention-query="true"]';

describe('Snapshot Test: z-indexes', () => {
  beforeAll(async () => {
    removeOldProdSnapshots(imageSnapshotFolder);
  });

  ['full-page', 'comment'].forEach(appearance => {
    let page;

    describe(`${appearance}`, () => {
      beforeAll(async () => {
        // @ts-ignore
        page = global.page;
        await initEditor(page, appearance);
      });

      beforeEach(async () => {
        await clearEditor(page);
      });

      it('should always position table trash icon below dropdowns from main menu', async () => {
        await insertTable(page);
        await page.waitForSelector(removeTablePopup);
        await page.click(blockFormattingDropdown);
        await page.waitForSelector(dropList);
        await page.click(insertBlockDropdown);
        await page.waitForSelector(dropList);
        await snapshot(page);
      });

      it('should always position table trash icon below emoji picker', async () => {
        await insertTable(page);
        await page.waitForSelector(removeTablePopup);
        await page.click(emojiButton);
        await page.waitForSelector(emojiPicker);
        await page.click(mentionButton);
        await page.waitForSelector(mentionPicker);
        await snapshot(page);
      });

      it('should always position code block language picker below dropdowns from main menu', async () => {
        await insertTable(page);
        await page.keyboard.type('```');
        await page.waitForSelector(popupPresent);
        await page.click(insertBlockDropdown);
        await page.waitForSelector(dropList);
        await snapshot(page);
      });
    });
  });
});
