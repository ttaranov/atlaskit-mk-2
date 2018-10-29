import { selectByTextAndClick } from '../_utils';

import { messages as insertBlockMessages } from '../../../plugins/insert-block/ui/ToolbarInsertBlock';
import { TableCssClassName as ClassName } from '../../../plugins/table/types';
import commonMessages from '../../../messages';

type CellSelectorOpts = {
  row: number;
  cell?: number;
  cellType?: 'td' | 'th';
};

export const getSelectorForCell = ({
  row,
  cell,
  cellType = 'td',
}: CellSelectorOpts) => {
  const rowSelector = `table tr:nth-child(${row})`;
  if (!cell) {
    return rowSelector;
  }

  return `${rowSelector} > ${cellType}:nth-child(${cell})`;
};

export const clickInContextMenu = async (page, title) => {
  const contextMenuTriggerSelector = `.${ClassName.CONTEXTUAL_MENU_BUTTON}`;
  await page.waitForSelector(contextMenuTriggerSelector);
  await page.click(contextMenuTriggerSelector);
  await selectByTextAndClick({ page, tagName: 'span', text: title });
};

export const selectTableDisplayOption = async (page, optionSelector) => {
  await page.click('span[aria-label="Table display options"]');
  await page.click(optionSelector);
};

export const setTableLayout = async (page, layout) => {
  const layoutSelector = {
    default: commonMessages.layoutFixedWidth.defaultMessage,
    wide: commonMessages.layoutWide.defaultMessage,
    'full-width': commonMessages.layoutFullWidth.defaultMessage,
  };
  const buttonSelector = `div[aria-label="Table floating controls"] span[aria-label="${
    layoutSelector[layout]
  }"]`;
  await page.click(buttonSelector);
  await page.waitForSelector(`.ProseMirror table[data-layout="${layout}"]`);
};

export const insertTable = async page => {
  await page.click(
    `span[aria-label="${insertBlockMessages.table.defaultMessage}"]`,
  );
  await page.waitForSelector('table td p');
};

export const insertRow = async (page, atIndex = 1) => {
  await insertRowOrColumn(page, 'row', atIndex);
};

export const insertColumn = async (page, atIndex = 1) => {
  await insertRowOrColumn(page, 'column', atIndex);
};

export const insertRowOrColumn = async (
  page,
  type: 'row' | 'column',
  atIndex: number,
) => {
  const buttonSelector = `.pm-table-${type}-controls__button-wrap:nth-child(${atIndex}) .pm-table-controls__insert-column`;
  await page.hover(
    `.pm-table-${type}-controls__button-wrap:nth-child(${atIndex}) > .pm-table-controls__insert-column`,
  );
  await page.waitForSelector(buttonSelector);
  await page.click(buttonSelector);
};

export const focusTable = async page => {
  await page.click('table td p');
};
