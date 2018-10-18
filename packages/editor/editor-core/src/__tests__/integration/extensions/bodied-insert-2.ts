import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import {
  getDocFromElement,
  fullpage,
  editable,
  insertBlockMenuItem,
} from '../_helpers';

import { messages as BlockMessages } from '../../../plugins/insert-block/ui/ToolbarInsertBlock';
import { messages as ListMessages } from '../../../plugins/lists/ui/ToolbarLists';

[
  ListMessages.unorderedList.defaultMessage,
  ListMessages.orderedList.defaultMessage,
  'action',
  'table',
].forEach(node => {
  BrowserTestCase(
    `bodied-insert-2.ts: Bodied Extension: Insert ${node}`,
    { skip: ['edge', 'ie'] },
    async client => {
      const page = new Page(client);
      await page.goto(fullpage.path);
      await page.waitForSelector(fullpage.placeholder);
      await page.click(fullpage.placeholder);
      await insertBlockMenuItem(page, 'Bodied macro (EH)');

      if (node.endsWith('list')) {
        await page.click(`span[aria-label="${node}"]`);
      } else if (node === 'action') {
        await page.click(
          `span[aria-label="${BlockMessages.action.defaultMessage}"]`,
        );
      } else if (node === 'table') {
        await page.click(
          `span[aria-label="${BlockMessages.table.defaultMessage}"]`,
        );
        await page.waitForSelector('table td p');
      }

      const doc = await page.$eval(editable, getDocFromElement);
      expect(doc).toMatchDocSnapshot();
    },
  );
});
