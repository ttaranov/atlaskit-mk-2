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

describe('Snapshot Test: table', () => {
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
        await insertTable(page);
      });

      if (appearance === 'full-page') {
        ['wide', 'full-width'].forEach(layout => {
          it(`${layout} layout`, async () => {
            const buttonSelector = `span[aria-label="Change layout to ${layout.replace(
              '-',
              ' ',
            )}"]`;
            await page.click(buttonSelector);
            await page.waitForSelector(
              `.ProseMirror table[data-layout="${layout}"]`,
            );
            await snapshot(page);
          });
        });
        it(`remove row buttons in full width layout mode`, async () => {
          const buttonSelector = `span[aria-label="Change layout to full width"]`;
          await page.click(buttonSelector);
          await page.waitForSelector(
            `.ProseMirror table[data-layout="full-width"]`,
          );
          await page.click(`.table-row:nth-child(1) button`);
          await page.hover(`span[aria-label="Remove row"]`);
          await page.waitForSelector('.ProseMirror table .danger');
          await snapshot(page);
        });

        it('table with scroll', async () => {
          const buttonSelector = `.table-column:nth-child(1) span[aria-label="Add column"]`;
          for (let k = 0; k < 3; k++) {
            await page.hover(`.table-column:nth-child(1)>div`);
            await page.waitForSelector(buttonSelector);
            await page.click(buttonSelector);
          }
          await page.click('table tr td:nth-child(1) p');
          await page.evaluate(() => {
            document.querySelector(
              '.ProseMirror .table-wrapper',
            )!.scrollLeft = 3;
          });
          await snapshot(page);
          await page.evaluate(() => {
            document.querySelector(
              '.ProseMirror .table-wrapper',
            )!.scrollLeft = 150;
          });
          await snapshot(page);
          await page.evaluate(() => {
            document.querySelector(
              '.ProseMirror .table-wrapper',
            )!.scrollLeft = 300;
          });
          await snapshot(page);
        });
      }

      it('trash icon', async () => {
        const buttonSelector = 'span[aria-label="Remove table"]';
        await page.hover(buttonSelector);
        await page.waitForSelector('.ProseMirror table td.danger');
        await snapshot(page);
        await page.click(buttonSelector);
        await snapshot(page);
      });

      ['row', 'column'].forEach(type => {
        it(`5 ${type}s added`, async () => {
          const buttonSelector = `.table-${type}:nth-child(1) span[aria-label="Add ${type}"]`;
          for (let k = 0; k < 5; k++) {
            await page.hover(`.table-${type}:nth-child(1)>div`);
            await page.waitForSelector(buttonSelector);
            await page.click(buttonSelector);
          }
          if (type === 'row') {
            await page.click('table tr:nth-child(1) p');
          } else {
            await page.click('table tr td:nth-child(1) p');
          }
          await snapshot(page);
        });

        for (let i = 1; i <= 3; i++) {
          it('control button', async () => {
            await page.hover(`.table-${type}:nth-child(${i})`);
            await page.waitForSelector('.ProseMirror table .hoveredCell');
            await snapshot(page);
            await page.click(`.table-${type}:nth-child(${i}) button`);
            await snapshot(page);
          });
          it(`add ${type} button`, async () => {
            const buttonSelector = `.table-${type}:nth-child(${i}) span[aria-label="Add ${type}"]`;
            await page.hover(`.table-${type}:nth-child(${i})>div`);
            await page.waitForSelector(buttonSelector);
            await snapshot(page);
            await page.click(buttonSelector);
            await page.click(`table td:nth-child(1) p`);
            await snapshot(page);
          });
          it(`remove ${type} button`, async () => {
            const removeButtonSelector = `span[aria-label="Remove ${type}"]`;
            await page.click(`.table-${type}:nth-child(${i}) button`);
            await page.hover(removeButtonSelector);
            await page.waitForSelector('.table-container .danger');
            await snapshot(page);
            await page.click(removeButtonSelector);
            await page.waitForSelector('.table-container .danger', {
              hidden: true,
            });
            await page.click(`table td:nth-child(1)`);
            await snapshot(page);
          });
        }
      });
    });
  });
});
