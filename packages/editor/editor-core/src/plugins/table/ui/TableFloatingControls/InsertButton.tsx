import * as React from 'react';
import { SyntheticEvent } from 'react';
import { injectIntl, InjectedIntlProps } from 'react-intl';
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

const getInsertLineHeight = (tableRef: HTMLElement) => {
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
            title={formatMessage(
              type === 'row'
                ? tableMessages.insertRow
                : tableMessages.insertColumn,
            )}
            className={ClassName.CONTROLS_INSERT_BUTTON}
            onMouseDown={onMouseDown}
          >
            <svg className={ClassName.CONTROLS_BUTTON_ICON}>
              <path
                d="M10 4a1 1 0 0 1 1 1v4h4a1 1 0 0 1 0 2h-4v4a1 1 0 0 1-2 0v-4H5a1 1 0 1 1 0-2h4V5a1 1 0 0 1 1-1z"
                fill="currentColor"
                fillRule="evenodd"
              />
            </svg>
          </button>
        </div>
        <div
          className={ClassName.CONTROLS_INSERT_LINE}
          style={
            type === 'row'
              ? { width: getInsertLineWidth(tableRef) }
              : { height: getInsertLineHeight(tableRef) }
          }
        />
      </>
    )}
    <div className={ClassName.CONTROLS_INSERT_MARKER} />
  </div>
);

export default injectIntl(InsertButton);
