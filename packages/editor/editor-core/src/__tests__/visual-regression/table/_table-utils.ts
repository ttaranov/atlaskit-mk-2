import { selectByTextAndClick, getSelectorForTableCell } from '../_utils';

import { messages as insertBlockMessages } from '../../../plugins/insert-block/ui/ToolbarInsertBlock';
import { TableCssClassName as ClassName } from '../../../plugins/table/types';
import { messages as ToolbarMessages } from '../../../plugins/table/toolbar';
import commonMessages from '../../../messages';

type ResizeColumnOpts = {
  colIdx: number;
  amount: number;
  // Useful if a row has a colspan and you need resize a col it spans over.
  row?: number;
};

export const getSelectorForTableControl = (type, atIndex?: number) => {
  let selector = `.pm-table-${type}-controls__button-wrap`;
  if (atIndex) {
    selector += `:nth-child(${atIndex})`;
  }

  return selector;
};

export const clickInContextMenu = async (page, title) => {
  const contextMenuTriggerSelector = `.${ClassName.CONTEXTUAL_MENU_BUTTON}`;
  await page.waitForSelector(contextMenuTriggerSelector);
  await page.click(contextMenuTriggerSelector);
  await selectByTextAndClick({ page, tagName: 'span', text: title });
};

export const selectTableDisplayOption = async (page, optionSelector) => {
  await page.click(
    `span[aria-label="${ToolbarMessages.tableOptions.defaultMessage}"]`,
  );
  await page.click(optionSelector);
};

export const setTableLayout = async (page, layout) => {
  const layoutSelector = {
    default: commonMessages.layoutFixedWidth.defaultMessage,
    wide: commonMessages.layoutWide.defaultMessage,
    'full-width': commonMessages.layoutFullWidth.defaultMessage,
  };
  const getButtonSelector = layout =>
    `div[aria-label="${layoutSelector[layout]}"] .${
      ClassName.LAYOUT_BUTTON
    } button`;

  if (layout === 'wide') {
    await page.click(getButtonSelector(layout));
  } else if (layout === 'full-width') {
    await page.click(getButtonSelector('wide'));
    await page.waitForSelector(`.ProseMirror table[data-layout="wide"]`);
    await page.click(getButtonSelector(layout));
  }

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

export const insertRowOrColumn = async (page, type, atIndex: number) => {
  let buttonWrapSelector = ClassName.ROW_CONTROLS_BUTTON_WRAP;
  let insertSelector = ClassName.CONTROLS_INSERT_ROW;
  if (type === 'column') {
    buttonWrapSelector = ClassName.COLUMN_CONTROLS_BUTTON_WRAP;
    insertSelector = ClassName.CONTROLS_INSERT_COLUMN;
  }

  const buttonSelector = `.${buttonWrapSelector}:nth-child(${atIndex}) .${insertSelector}`;
  await page.hover(buttonSelector);
  await page.waitForSelector(buttonSelector);
  await page.click(buttonSelector);
};

export const deleteRow = async (page, atIndex = 1) => {
  await deleteRowOrColumn(page, 'row', atIndex);
};

export const deleteColumn = async (page, atIndex = 1) => {
  await deleteRowOrColumn(page, 'column', atIndex);
};

export const deleteRowOrColumn = async (page, type, atIndex) => {
  let typeWrapperSelector = ClassName.ROW_CONTROLS_WRAPPER;
  if (type === 'column') {
    typeWrapperSelector = ClassName.COLUMN_CONTROLS_WRAPPER;
  }

  const controlSelector = `.${typeWrapperSelector} .${
    ClassName.CONTROLS_BUTTON
  }:nth-child(${atIndex})`;
  const deleteButtonSelector = `.${ClassName.CONTROLS_DELETE_BUTTON_WRAP} .${
    ClassName.CONTROLS_DELETE_BUTTON
  }`;
  await page.click(controlSelector);
  await page.hover(deleteButtonSelector);
  await page.waitForSelector(deleteButtonSelector);
  await page.click(deleteButtonSelector);
};

export const focusTable = async page => {
  await page.click('table td p');
};

const getCellBoundingRect = async (page, selector) => {
  return await page.evaluate(selector => {
    const element = document.querySelector(selector);
    const { x, y, width, height } = element.getBoundingClientRect();
    return { left: x, top: y, width, height, id: element.id };
  }, selector);
};

export const resizeColumn = async (
  page,
  { colIdx, amount, row = 1 }: ResizeColumnOpts,
) => {
  let cell = await getCellBoundingRect(
    page,
    getSelectorForTableCell({ row, cell: colIdx }),
  );

  const columnEndPosition = cell.left + cell.width;

  // Move to the right edge of the cell.
  await page.mouse.move(columnEndPosition, cell.top);

  // Resize
  await page.mouse.down();
  await page.mouse.move(columnEndPosition + amount, cell.top);
  await page.mouse.up();
};

export const getInsertClass = type => {
  if (type === 'row') {
    return ClassName.CONTROLS_INSERT_ROW;
  }

  return ClassName.CONTROLS_INSERT_COLUMN;
};
