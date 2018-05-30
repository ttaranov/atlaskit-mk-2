import * as React from 'react';
import { Component } from 'react';
import { EditorView } from 'prosemirror-view';
import { isRowSelected, selectRow, isTableSelected } from 'prosemirror-utils';
import {
  RowInner,
  RowContainer,
  RowControlsButtonWrap,
  HeaderButton,
} from './styles';
import InsertRowButton from './InsertRowButton';
import { Command } from '../../../../../types';
import { getLineMarkerWidth, findRowSelection, TableSelection } from '../utils';
import DeleteRowButton from './DeleteRowButton';

export interface Props {
  editorView: EditorView;
  tableElement: HTMLElement;
  isTableHovered: boolean;
  insertRow: (row: number) => Command;
  remove: () => void;
  hoverRows: (rows: number[], danger?: boolean) => Command;
  resetHoverSelection: Command;
  scroll: number;
  updateScroll: () => void;
  isTableInDanger?: boolean;
}

export default class RowControls extends Component<Props, any> {
  state: { dangerRows: number[] } = { dangerRows: [] };

  createDeleteRowButton(selection, offsetHeight, selectionHeight) {
    const selectedRowIdxs: number[] = [];
    for (let i = 0; i < selection.count; i++) {
      selectedRowIdxs.push(selection.startIdx! + i);
    }

    return (
      <DeleteRowButton
        key="delete"
        onClick={() => {
          this.props.remove();
          this.resetHoverSelection();
        }}
        onMouseEnter={() => {
          this.hoverRows(selectedRowIdxs, true);
          this.props.updateScroll();
        }}
        onMouseLeave={() => this.hoverRows(selectedRowIdxs)}
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

  render() {
    const {
      tableElement,
      editorView: { state },
      isTableHovered,
      scroll,
      isTableInDanger,
    } = this.props;
    if (!tableElement) {
      return null;
    }
    const tbody = tableElement.querySelector('tbody');
    if (!tbody) {
      return null;
    }

    const rows = tbody.getElementsByTagName('tr');
    const nodes: any = [];
    const lineMarkerWidth = getLineMarkerWidth(tableElement, scroll);
    let prevRowHeights = 0;

    const selection = findRowSelection(state, rows);

    for (let i = 0, len = rows.length; i < len; i++) {
      const onlyThisRowSelected =
        selection.inSelection(i) &&
        !isTableSelected(state.selection) &&
        !selection.hasMultipleSelection;

      const classNames =
        isTableHovered || isRowSelected(i)(state.selection) ? ['active'] : [''];
      if (this.state.dangerRows.indexOf(i) !== -1 || isTableInDanger) {
        classNames.push('danger');
      }
      nodes.push(
        <RowControlsButtonWrap
          key={i}
          className={`${classNames.join(' ')} table-row`}
          style={{ height: (rows[i] as HTMLElement).offsetHeight + 1 }}
        >
          {/* tslint:disable:jsx-no-lambda */}
          <HeaderButton
            onClick={() => this.selectRow(i)}
            onMouseOver={() => this.hoverRows([i])}
            onMouseOut={this.resetHoverSelection}
          />
          {/* tslint:enable:jsx-no-lambda */}
          {!(
            selection.hasMultipleSelection && selection.frontOfSelection(i)
          ) ? (
            <InsertRowButton
              onClick={() => this.insertRow(i + 1)}
              lineMarkerWidth={lineMarkerWidth}
              onMouseOver={this.props.updateScroll}
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

  private selectRow = (row: number) => {
    const { state, dispatch } = this.props.editorView;
    dispatch(selectRow(row)(state.tr));
    this.resetHoverSelection();
  };

  private hoverRows = (rows: number[], danger?: boolean) => {
    const { state, dispatch } = this.props.editorView;
    this.setState({ dangerRows: danger ? rows : [] });
    this.props.hoverRows(rows, danger)(state, dispatch);
  };

  private resetHoverSelection = () => {
    const { state, dispatch } = this.props.editorView;
    this.setState({ dangerRows: [] });
    this.props.resetHoverSelection(state, dispatch);
  };

  private insertRow = (row: number) => {
    const { state, dispatch } = this.props.editorView;
    this.props.insertRow(row)(state, dispatch);
    this.resetHoverSelection();
  };
}
