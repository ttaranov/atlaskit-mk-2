import { removeOldProdSnapshots } from '@atlaskit/visual-regression/helper';

import { imageSnapshotFolder, initEditor, clearEditor } from './_utils';

const snapshot = async page => {
  const image = await page.screenshot();
  // @ts-ignore
  expect(image).toMatchProdImageSnapshot();
};

describe('Snapshot Test: Gap cursor', () => {
  let page;

  beforeAll(async () => {
    removeOldProdSnapshots(imageSnapshotFolder);
    // @ts-ignore
    page = global.page;
    await initEditor(page, 'full-page');
    await page.addStyleTag({
      content:
        '.ProseMirror-gapcursor span::after { animation: none !important; }',
    });
  });

  beforeEach(async () => {
    await page.setViewport({ width: 1920, height: 1080 });
    await clearEditor(page);
  });

  [
    'table',
    'codeblock',
    'panel',
    'action',
    'decision',
    'block extension',
    'columns',
  ].forEach(node => {
    ['Left', 'Right'].forEach(side => {
      it(`should render gap cursor for node ${node} on the ${side} side`, async () => {
        await page.type('.ProseMirror p', `/${node}`);
        await page.waitFor('div[aria-label="Popup"] span[role="button"]');
        await page.click('div[aria-label="Popup"] span[role="button"]');
        if (node === 'table' && side === 'Right') {
          await page.keyboard.down(`ArrowDown`);
          await page.keyboard.down(`ArrowDown`);
          await page.keyboard.down(`ArrowDown`);
        }
        await page.keyboard.down(`Arrow${side}`);
        await page.waitForSelector('.ProseMirror-gapcursor');
        await snapshot(page);
      });
    });
  });
});
