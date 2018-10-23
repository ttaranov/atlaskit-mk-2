import { initEditor, clearEditor, snapshot } from './_utils';

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

  [
    'table',
    // 'code block', //TODO :enable test after bug is fixed
    'panel',
    'action',
    'decision',
    // 'block extension', //TODO :enable test after bug is fixed
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
        if (node === 'columns' && side === 'Right') {
          await page.keyboard.down(`ArrowRight`);
        }
        await page.keyboard.down(`Arrow${side}`);
        await page.waitForSelector('.ProseMirror-gapcursor');
        await snapshot(page);
      });
    });
  });
});
