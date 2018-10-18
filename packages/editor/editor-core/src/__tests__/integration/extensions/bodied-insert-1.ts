import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import {
  getDocFromElement,
  fullpage,
  editable,
  insertBlockMenuItem,
} from '../_helpers';

import { messages as InsertMessages } from '../../../plugins/insert-block/ui/ToolbarInsertBlock';
import { messages as BlockTypeMessages } from '../../../plugins/block-type/types';

[
  BlockTypeMessages.codeblock.defaultMessage,
  BlockTypeMessages.panel.defaultMessage,
  InsertMessages.decision.defaultMessage,
].forEach(node => {
  BrowserTestCase(
    `bodied-insert-1.ts: Bodied Extension: Insert ${node}`,
    { skip: ['edge', 'ie'] },
    async client => {
      const page = new Page(client);
      await page.goto(fullpage.path);
      await page.waitForSelector(fullpage.placeholder);
      await page.click(fullpage.placeholder);

      await insertBlockMenuItem(page, 'Bodied macro (EH)');
      await insertBlockMenuItem(page, node);

      const doc = await page.$eval(editable, getDocFromElement);
      expect(doc).toMatchDocSnapshot();
    },
  );
});
