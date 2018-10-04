import * as React from 'react';
import { Component } from 'react';
import { isRowSelected } from 'prosemirror-utils';
import { NumberedRow } from './NumberedRow';
import { EditorState } from 'prosemirror-state';
import { TableCssClassName as ClassName } from '../../../types';

export interface Props {
  state: EditorState;
  tableRef: HTMLElement;
  tableActive?: boolean;
  isTableHovered?: boolean;
  hoverRows: (rows: number[], danger?: boolean) => void;
  dangerRows?: number[];
  hoveredRows: number[];
  clearHoverSelection: () => void;
  selectRow: (row: number) => void;
  hasHeaderRow?: boolean;
  isTableInDanger?: boolean;
}

export default class NumberColumn extends Component<Props, any> {
  render() {
    const {
      tableRef,
      isTableHovered,
      state,
      hasHeaderRow,
      isTableInDanger,
      tableActive,
      hoverRows,
      clearHoverSelection,
      selectRow,
      dangerRows,
    } = this.props;

    const tbody = tableRef.querySelector('tbody');
    if (!tbody) {
      return null;
    }

    const rows = Array.from(tbody.getElementsByTagName('tr'));

    const numberRows: JSX.Element[] = [];
    for (let i = 0, len = rows.length; i < len; i++) {
      numberRows.push(
        <NumberedRow
          key={`wrapper-${i}`}
          row={i}
          rowElements={rows}
          tableActive={tableActive}
          isRowActive={
            isTableHovered ||
            isRowSelected(i)(state.selection) ||
            this.props.hoveredRows.indexOf(i) !== -1
          }
          isRowDanger={(dangerRows || []).indexOf(i) !== -1 || isTableInDanger}
          selectRow={selectRow}
          hoverRows={hoverRows}
          clearHoverSelection={clearHoverSelection}
        >
          {hasHeaderRow ? (i > 0 ? i : null) : i + 1}
        </NumberedRow>,
      );
    }
    return <div className={ClassName.NUMBERED_COLUMN}>{numberRows}</div>;
  }
}
