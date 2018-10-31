import { initEditor, snapshot, insertBlockMenuItem } from './_utils';
import { messages } from '../../plugins/block-type/types';
import commonMessages from '../../messages';

const wideBreakoutButtonQuery = `div[aria-label="CodeBlock floating controls"] [aria-label="${
  commonMessages.layoutWide.defaultMessage
}"]`;
const fullWidthBreakoutButtonQuery = `div[aria-label="CodeBlock floating controls"] [aria-label="${
  commonMessages.layoutFullWidth.defaultMessage
}"]`;

describe('Snapshot Test: Breakout', () => {
  let page;
  beforeAll(async () => {
    // @ts-ignore
    page = global.page;
    await initEditor(page, 'full-page');
  });

  it('should correctly render code block with wide breakout mode', async () => {
    await insertBlockMenuItem(page, messages.codeblock.defaultMessage);
    await page.waitForSelector(wideBreakoutButtonQuery);
    await page.click(wideBreakoutButtonQuery);
    await snapshot(page);
  });

  it('should correctly render code block with full-width breakout mode', async () => {
    await insertBlockMenuItem(page, messages.codeblock.defaultMessage);
    await page.waitForSelector(fullWidthBreakoutButtonQuery);
    await page.click(fullWidthBreakoutButtonQuery);
    await snapshot(page);
  });
});
