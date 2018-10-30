import {
  initEditor,
  clearEditor,
  snapshot,
  changeSelectedNodeLayout,
} from './_utils';
import commonMessages from '../../messages';

const nodeLabel = node => {
  switch (node) {
    case 'code':
      return 'code block';
    case 'bodied':
      return 'bodied extension';
    default:
      return node;
  }
};

describe('Snapshot Test: Gap cursor', () => {
  let page;

  beforeAll(async () => {
    // @ts-ignore
    page = global.page;
    await initEditor(page, 'full-page');
  });

  beforeEach(async () => {
    await clearEditor(page);
  });

  ['table', 'code', 'panel', 'action', 'decision', 'bodied', 'columns'].forEach(
    node => {
      ['Left', 'Right'].forEach(side => {
        it(`should render gap cursor for node ${nodeLabel(
          node,
        )} on the ${side} side`, async () => {
          await page.type('.ProseMirror p', `/${node}`);
          await page.waitFor('div[aria-label="Popup"] span[role="button"]');
          await page.click('div[aria-label="Popup"] span[role="button"]');
          if (node === 'table' && side === 'Right') {
            await page.keyboard.down(`ArrowDown`);
            await page.keyboard.down(`ArrowDown`);
            await page.keyboard.down(`ArrowDown`);
          }
          if (node === 'columns' && side === 'Right') {
            await page.keyboard.down(`ArrowRight`);
          }
          await page.keyboard.down(`Arrow${side}`);
          await page.waitForSelector('.ProseMirror-gapcursor');
          await snapshot(page);
        });
      });
    },
  );

  ['table', 'bodied'].forEach(node => {
    [
      commonMessages.layoutWide.defaultMessage,
      commonMessages.layoutFullWidth.defaultMessage,
    ].forEach(layout => {
      ['Left', 'Right'].forEach(side => {
        it(`should render gap cursor in ${layout} layout for node ${nodeLabel(
          node,
        )} on the ${side} side`, async () => {
          await page.setViewport({ width: 1920, height: 1080 });
          await page.type('.ProseMirror p', `/${node}`);
          await page.waitFor('div[aria-label="Popup"] span[role="button"]');
          await page.click('div[aria-label="Popup"] span[role="button"]');
          await changeSelectedNodeLayout(page, layout);
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
});
