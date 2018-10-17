import * as React from 'react';
import { SyntheticEvent } from 'react';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import AddIcon from '@atlaskit/icon/glyph/editor/add';
import { akEditorTableNumberColumnWidth } from '@atlaskit/editor-common';
import { TableCssClassName as ClassName } from '../../types';
import { tableToolbarSize } from '../styles';
import tableMessages from '../messages';
import { closestElement } from '../../../../utils/';

export interface ButtonProps {
  type: 'row' | 'column';
  tableRef: HTMLElement;
  index: number;
  showInsertButton: boolean;
  onMouseDown: (event: SyntheticEvent<HTMLButtonElement>) => void;
}

const getInsertLineheight = (tableRef: HTMLElement) => {
  return tableRef.offsetHeight + tableToolbarSize;
};

const getToolbarSize = (tableRef: HTMLElement): number => {
  const parent = closestElement(tableRef, `.${ClassName.TABLE_CONTAINER}`);
  if (parent) {
    return parent.querySelector(`.${ClassName.NUMBERED_COLUMN}`)
      ? tableToolbarSize + akEditorTableNumberColumnWidth - 1
      : tableToolbarSize;
  }

  return tableToolbarSize;
};

const getInsertLineWidth = (tableRef: HTMLElement) => {
  const { parentElement, offsetWidth } = tableRef;
  const parentOffsetWidth = parentElement!.offsetWidth;
  const { scrollLeft } = parentElement!;
  const diff = offsetWidth - parentOffsetWidth;
  const toolbarSize = getToolbarSize(tableRef);
  return Math.min(
    offsetWidth + toolbarSize,
    parentOffsetWidth + toolbarSize - Math.max(scrollLeft - diff, 0),
  );
};

const InsertButton = ({
  onMouseDown,
  index,
  tableRef,
  showInsertButton,
  type,
  intl: { formatMessage },
}: ButtonProps & InjectedIntlProps) => (
  <div
    data-index={index}
    className={`${ClassName.CONTROLS_INSERT_BUTTON_WRAP} ${
      type === 'row'
        ? ClassName.CONTROLS_INSERT_ROW
        : ClassName.CONTROLS_INSERT_COLUMN
    }`}
  >
    {showInsertButton && (
      <>
        <div className={ClassName.CONTROLS_INSERT_BUTTON_INNER}>
          <button
            type="button"
            className={ClassName.CONTROLS_INSERT_BUTTON}
            onMouseDown={onMouseDown}
          >
            <span className={ClassName.CONTROLS_BUTTON_ICON}>
              <AddIcon
                label={formatMessage(
                  type === 'row'
                    ? tableMessages.insertRow
                    : tableMessages.insertColumn,
                )}
              />
            </span>
          </button>
        </div>
        <div
          className={ClassName.CONTROLS_INSERT_LINE}
          style={
            type === 'row'
              ? { width: getInsertLineWidth(tableRef) }
              : { height: getInsertLineheight(tableRef) }
          }
        />
      </>
    )}
    <div className={ClassName.CONTROLS_INSERT_MARKER} />
  </div>
);

export default injectIntl(InsertButton);
