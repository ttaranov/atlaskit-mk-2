import { initEditor, clearEditor, insertTable, snapshot } from '../_utils';
import { selectTableDisplayOption } from './_table-utils';

describe('Snapshot Test: table floating toolbar', () => {
  ['full-page'].forEach(appearance => {
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

      it('table display options', async () => {
        const headerRowOptionSelector =
          'div[data-role="droplistContent"] span[role="button"]:nth-of-type(1)';
        const headerColumnOptionSelector =
          'div[data-role="droplistContent"] span[role="button"]:nth-of-type(2)';
        const numberedColumnOptionSelector =
          'div[data-role="droplistContent"] span[role="button"]:nth-of-type(3)';

        // Remove default header row styling
        await selectTableDisplayOption(page, headerRowOptionSelector);
        await snapshot(page);
        // Add header row and column options
        await selectTableDisplayOption(page, headerColumnOptionSelector);
        await selectTableDisplayOption(page, headerRowOptionSelector);
        await snapshot(page);
        // Add numbered column
        await selectTableDisplayOption(page, numberedColumnOptionSelector);
        await snapshot(page);
        // Remove header column style
        await selectTableDisplayOption(page, headerColumnOptionSelector);
        await snapshot(page);
        // Remove header row style
        await selectTableDisplayOption(page, headerRowOptionSelector);
        await snapshot(page);
        // Re-add header column style
        await selectTableDisplayOption(page, headerColumnOptionSelector);
        await snapshot(page);
        // Remove header column style and numbered columns
        await selectTableDisplayOption(page, headerColumnOptionSelector);
        await selectTableDisplayOption(page, numberedColumnOptionSelector);
        await snapshot(page);
      });
    });
  });
});
