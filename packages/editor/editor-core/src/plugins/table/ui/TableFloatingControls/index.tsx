import * as React from 'react';
import { Component } from 'react';
import { EditorView } from 'prosemirror-view';
import { Selection } from 'prosemirror-state';
import { browser } from '@atlaskit/editor-common';
import CornerControls from './CornerControls';
import RowControls from './RowControls';
import NumberColumn from './NumberColumn';
import { isSelectionUpdated } from './utils';
import {
  clearHoverSelection,
  hoverRows,
  insertRow,
  deleteSelectedRows,
  selectRow,
} from '../../actions';

export interface State {
  hoveredRows: number[];
}

export interface Props {
  editorView: EditorView;
  selection?: Selection;
  tableRef?: HTMLElement;
  tableActive?: boolean;
  isTableHovered?: boolean;
  isTableInDanger?: boolean;
  isHeaderColumnEnabled?: boolean;
  isHeaderRowEnabled?: boolean;
  isNumberColumnEnabled?: boolean;
  hasHeaderRow?: boolean;
  tableHeight?: number;
  dangerRows?: number[];
  insertColumnButtonIndex?: number;
  insertRowButtonIndex?: number;
}

export default class TableFloatingControls extends Component<Props, State> {
  static defaultProps = {
    dangerRows: [],
  };

  state: State = {
    hoveredRows: [],
  };

  shouldComponentUpdate(nextProps, nextState) {
    const {
      tableRef,
      isTableHovered,
      isTableInDanger,
      isHeaderRowEnabled,
      isHeaderColumnEnabled,
      isNumberColumnEnabled,
      selection,
      tableHeight,
      insertColumnButtonIndex,
      insertRowButtonIndex,
    } = this.props;
    return (
      tableRef !== nextProps.tableRef ||
      insertColumnButtonIndex !== nextProps.insertColumnButtonIndex ||
      insertRowButtonIndex !== nextProps.insertRowButtonIndex ||
      tableHeight !== nextProps.tableHeight ||
      isTableHovered !== nextProps.isTableHovered ||
      isTableInDanger !== nextProps.isTableInDanger ||
      this.props.dangerRows !== nextProps.dangerRows ||
      this.state.hoveredRows !== nextState.hoveredRows ||
      isHeaderRowEnabled !== nextProps.isHeaderRowEnabled ||
      isHeaderColumnEnabled !== nextProps.isHeaderColumnEnabled ||
      isNumberColumnEnabled !== nextProps.isNumberColumnEnabled ||
      isSelectionUpdated(selection, nextProps.selection)
    );
  }

  render() {
    const {
      editorView,
      tableRef,
      isTableHovered,
      isTableInDanger,
      isNumberColumnEnabled,
      isHeaderColumnEnabled,
      isHeaderRowEnabled,
      tableActive,
      hasHeaderRow,
      dangerRows,
      insertColumnButtonIndex,
      insertRowButtonIndex,
    } = this.props;

    if (!tableRef) {
      return null;
    }

    return (
      <div onMouseDown={this.handleMouseDown}>
        {isNumberColumnEnabled ? (
          <NumberColumn
            state={editorView.state}
            hoverRows={this.hoverRows}
            clearHoverSelection={this.clearHoverSelection}
            tableRef={tableRef}
            tableActive={tableActive}
            dangerRows={dangerRows}
            hoveredRows={this.state.hoveredRows}
            hasHeaderRow={hasHeaderRow}
            isTableHovered={isTableHovered}
            isTableInDanger={isTableInDanger}
            selectRow={this.selectRow}
          />
        ) : null}
        <CornerControls
          editorView={editorView}
          tableRef={tableRef}
          selection={editorView.state.selection}
          clearHoverSelection={this.clearHoverSelection}
          isTableInDanger={isTableInDanger}
          isHeaderColumnEnabled={isHeaderColumnEnabled}
          isHeaderRowEnabled={isHeaderRowEnabled}
          insertColumnButtonIndex={insertColumnButtonIndex}
          insertRowButtonIndex={insertRowButtonIndex}
        />
        <RowControls
          editorView={editorView}
          tableRef={tableRef}
          isTableHovered={isTableHovered!}
          deleteSelectedRows={this.deleteSelectedRows}
          hoverRows={this.hoverRows}
          dangerRows={dangerRows}
          hoveredRows={this.state.hoveredRows}
          clearHoverSelection={this.clearHoverSelection}
          isTableInDanger={isTableInDanger}
          selectRow={this.selectRow}
          insertRow={this.insertRow}
          insertRowButtonIndex={insertRowButtonIndex}
        />
      </div>
    );
  }

  private clearHoverSelection = () => {
    const { state, dispatch } = this.props.editorView;
    this.setState({ hoveredRows: [] });
    clearHoverSelection(state, dispatch);
  };

  private selectRow = (row: number) => {
    const { editorView } = this.props;
    const { state, dispatch } = editorView;
    // fix for issue ED-4665
    if (browser.ie_version === 11) {
      (editorView.dom as HTMLElement).blur();
    }
    selectRow(row)(state, dispatch);
    this.clearHoverSelection();
  };

  private insertRow = (row: number) => {
    const { state, dispatch } = this.props.editorView;
    insertRow(row)(state, dispatch);
  };

  private hoverRows = (rows, danger) => {
    this.setState({ hoveredRows: rows });
    const { state, dispatch } = this.props.editorView;
    hoverRows(rows, danger)(state, dispatch);
  };

  private deleteSelectedRows = () => {
    const { state, dispatch } = this.props.editorView;
    deleteSelectedRows(state, dispatch);
    this.clearHoverSelection();
  };

  private handleMouseDown = event => {
    event.preventDefault();
  };
}
