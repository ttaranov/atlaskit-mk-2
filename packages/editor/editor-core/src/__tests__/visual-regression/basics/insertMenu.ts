import {
  setTests,
  testsByAppearance,
  initEditor,
  clearEditor,
  selectByTextAndClick,
  snapshot,
} from '../_utils';

// add some comments to run test
// TODO: ED-5551 - Unskip when cleaning tests
describe.skip('Snapshot Test: For all insertMenu items', () => {
  setTests('insertMenu');
  Object.keys(testsByAppearance).forEach(appearance => {
    const tests = testsByAppearance[appearance];
    let page;

    describe(appearance, () => {
      beforeAll(async () => {
        // @ts-ignore
        page = global.page;
        await initEditor(page, appearance);
      });

      beforeEach(async () => {
        await clearEditor(page);
      });

      afterEach(async () => {
        await snapshot(page);
      });

      tests.forEach(test => {
        it(`${test.name} in ${appearance}`, async () => {
          // click on a toolbar icon or dropdown menu
          if (test.clickSelector) {
            await page.click(test.clickSelector);
          }
          // click on a menu item
          if (test.menuItemSelector) {
            await page.click(test.menuItemSelector);
          }
          // select a menu item by inner text and click
          if (test.menuItemText) {
            await selectByTextAndClick({
              page,
              tagName: test.tagName || 'span',
              text: test.menuItemText,
            });
          }

          if (test.nodeSelector) {
            await page.waitForSelector(test.nodeSelector);
            if (test.content) {
              await page.click(test.nodeSelector);
              await page.keyboard.type(test.content);
            }
          }
        });
      });
    });
  });
});
