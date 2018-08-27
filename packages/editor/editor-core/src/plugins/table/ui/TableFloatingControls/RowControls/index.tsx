import * as React from 'react';
import { Component } from 'react';
import { EditorView } from 'prosemirror-view';
import { isRowSelected, isTableSelected } from 'prosemirror-utils';
import {
  RowInner,
  RowContainer,
  RowControlsButtonWrap,
  HeaderButton,
} from './styles';
import InsertRowButton from './InsertRowButton';
import { findRowSelection, TableSelection, getLineMarkerWidth } from '../utils';
import DeleteRowButton from './DeleteRowButton';

export interface Props {
  editorView: EditorView;
  tableRef: HTMLElement;
  isTableHovered: boolean;
  selectRow: (row: number) => void;
  insertRow: (row: number) => void;
  deleteSelectedRows: () => void;
  hoverRows: (rows: number[], danger?: boolean) => void;
  dangerRows?: number[];
  hoveredRows?: number[];
  clearHoverSelection: () => void;
  isTableInDanger?: boolean;
}

export default class RowControls extends Component<Props, any> {
  static defaultProps = {
    dangerRows: [],
    hoveredRows: [],
  };

  createDeleteRowButton(selection, offsetHeight, selectionHeight) {
    const selectedRowIdxs: number[] = [];
    for (let i = 0; i < selection.count; i++) {
      selectedRowIdxs.push(selection.startIdx! + i);
    }

    return (
      <DeleteRowButton
        key="delete"
        onClick={this.props.deleteSelectedRows}
        onMouseEnter={() => {
          this.props.hoverRows(selectedRowIdxs, true);
        }}
        onMouseLeave={() => this.props.hoverRows(selectedRowIdxs)}
        style={{
          top: offsetHeight + selectionHeight / 2 + 2,
        }}
      />
    );
  }

  createDeleteRowButtonForSelection(selection: TableSelection, rows) {
    // find the offset before
    let selectionGroupOffset = 0;
    let selectionGroupHeight = 0;
    for (let i = 0; i < selection.startIdx!; i++) {
      selectionGroupOffset += (rows[i] as HTMLElement).offsetHeight;
    }

    // find the height of the selected rows
    for (let i = selection.startIdx!; i <= selection.endIdx!; i++) {
      selectionGroupHeight += (rows[i] as HTMLElement).offsetHeight;
    }

    return this.createDeleteRowButton(
      selection,
      selectionGroupOffset,
      selectionGroupHeight,
    );
  }

  private classNamesForRow(i, len) {
    const classNames = ['table-row'];
    const {
      editorView: { state },
      isTableHovered,
      isTableInDanger,
      dangerRows,
    } = this.props;

    if (
      isTableHovered ||
      isRowSelected(i)(state.selection) ||
      this.props.hoveredRows!.indexOf(i) !== -1
    ) {
      classNames.push('active');
    }

    if ((dangerRows || []).indexOf(i) !== -1 || isTableInDanger) {
      classNames.push('danger');
    }

    // since we can't use :last selector with class name selector (.table-row),
    // create a class-based selector instead
    if (i === len - 1) {
      classNames.push('last');
    }

    return classNames;
  }

  render() {
    const {
      editorView: { state },
      tableRef,
    } = this.props;
    if (!tableRef) {
      return null;
    }
    const tbody = tableRef.querySelector('tbody');
    if (!tbody) {
      return null;
    }

    const rows = tbody.getElementsByTagName('tr');
    const nodes: any = [];
    let prevRowHeights = 0;

    const selection = findRowSelection(state, rows);

    for (let i = 0, len = rows.length; i < len; i++) {
      const onlyThisRowSelected =
        selection.inSelection(i) &&
        !isTableSelected(state.selection) &&
        !selection.hasMultipleSelection;

      nodes.push(
        <RowControlsButtonWrap
          key={i}
          className={this.classNamesForRow(i, len).join(' ')}
          style={{
            height: (rows[i] as HTMLElement).offsetHeight + 1,
          }}
        >
          {/* tslint:disable:jsx-no-lambda */}
          <HeaderButton
            onClick={() => this.props.selectRow(i)}
            onMouseOver={() => this.props.hoverRows([i])}
            onMouseOut={() => this.props.clearHoverSelection()}
          />
          {/* tslint:enable:jsx-no-lambda */}
          {!(
            selection.hasMultipleSelection && selection.frontOfSelection(i)
          ) ? (
            <InsertRowButton
              onClick={() => this.props.insertRow(i + 1)}
              lineMarkerWidth={getLineMarkerWidth(
                tableRef,
                (tableRef.parentNode as HTMLElement).scrollLeft,
              )}
            />
          ) : null}
        </RowControlsButtonWrap>,
        onlyThisRowSelected
          ? this.createDeleteRowButton(
              selection,
              prevRowHeights,
              (rows[i] as HTMLElement).offsetHeight,
            )
          : null,
      );

      prevRowHeights += (rows[i] as HTMLElement).offsetHeight;
    }

    // in the case for a multiple selection, draw a single button at the end instead
    if (selection.hasMultipleSelection && !isTableSelected(state.selection)) {
      nodes.push(this.createDeleteRowButtonForSelection(selection, rows));
    }

    return (
      <RowContainer>
        <RowInner>{nodes}</RowInner>
      </RowContainer>
    );
  }
}
