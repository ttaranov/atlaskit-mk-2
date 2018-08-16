import { removeOldProdSnapshots } from '@atlaskit/visual-regression/helper';
import { imageSnapshotFolder, initEditor, clearEditor } from '../_utils';

const snapshot = async page => {
  const image = await page.screenshot();
  // @ts-ignore
  expect(image).toMatchProdImageSnapshot();
};

const codeBlock = 'div[class="code-block"]';
const gapCursorLeftRef = 'span[class="ProseMirror-gapcursor-left"]';
// const removeTablePopup = 'span[aria-label="Remove table"]';
// const dropList = 'div[data-role="droplistContent"]';
// const insertBlockDropdown =
//   'span[aria-label="Open or close insert block dropdown"]';
// const gapCursorRightRef = 'span[class="ProseMirror-gapcursor-right"]';
// const popupLabel = 'div[aria-label="Popup"]';
// const popupPresent = 'div[data-editor-popup="true"]';
// const emojiButton = 'span[aria-label="Insert emoji"]';
// const emojiPicker = 'div[data-emoji-picker-container="true"]';
// const mentionButton = 'span[aria-label="Add mention"]';
// const mentionPicker = 'span[data-mention-query="true"]';

describe('Snapshot Test: gap-cursor', () => {
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

      it('should be visible for blockquote', async () => {
        await page.keyboard.type('```');
        await page.waitForSelector(codeBlock);
        await page.click(codeBlock);
        await page.keyboard.down('ArrowLeft');
        await page.keyboard.up('ArrowLeft');
        await page.waitForSelector(gapCursorLeftRef);
        await snapshot(page);
      });
    });
  });
});

// await page.keyboard.down('Shift');
