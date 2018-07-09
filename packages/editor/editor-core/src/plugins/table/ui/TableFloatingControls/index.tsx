import * as React from 'react';
import { Component } from 'react';
import { EditorView } from 'prosemirror-view';
import { Selection } from 'prosemirror-state';
import { selectRow } from 'prosemirror-utils';
import CornerControls from './CornerControls';
import RowControls from './RowControls';
import NumberColumn from './NumberColumn';
import { Container } from './styles';
import { isSelectionUpdated } from './utils';
import {
  resetHoverSelection,
  hoverRows,
  insertRow,
  deleteSelectedRows,
} from '../../actions';

export interface State {
  dangerRows: number[];
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
}

export default class TableFloatingControls extends Component<Props, State> {
  state: State = {
    dangerRows: [],
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
    } = this.props;
    return (
      tableRef !== nextProps.tableRef ||
      tableHeight !== nextProps.tableHeight ||
      isTableHovered !== nextProps.isTableHovered ||
      isTableInDanger !== nextProps.isTableInDanger ||
      this.state.dangerRows !== nextState.dangerRows ||
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
    } = this.props;

    if (!tableRef) {
      return null;
    }

    return (
      <Container onMouseDown={this.handleMouseDown}>
        {isNumberColumnEnabled ? (
          <NumberColumn
            state={editorView.state}
            hoverRows={this.hoverRows}
            resetHoverSelection={this.resetHoverSelection}
            tableRef={tableRef}
            tableActive={tableActive}
            dangerRows={this.state.dangerRows}
            hoveredRows={this.state.hoveredRows}
            hasHeaderRow={hasHeaderRow}
            isTableHovered={isTableHovered}
            isTableInDanger={isTableInDanger}
            selectRow={this.selectRow}
          />
        ) : null}
        <CornerControls
          editorView={editorView}
          selection={editorView.state.selection}
          tableRef={tableRef}
          resetHoverSelection={this.resetHoverSelection}
          isTableInDanger={isTableInDanger}
          isHeaderColumnEnabled={isHeaderColumnEnabled}
          isHeaderRowEnabled={isHeaderRowEnabled}
          isNumberColumnEnabled={isNumberColumnEnabled}
        />
        <RowControls
          editorView={editorView}
          tableRef={tableRef}
          isTableHovered={isTableHovered!}
          deleteSelectedRows={this.deleteSelectedRows}
          hoverRows={this.hoverRows}
          dangerRows={this.state.dangerRows}
          hoveredRows={this.state.hoveredRows}
          resetHoverSelection={this.resetHoverSelection}
          isTableInDanger={isTableInDanger}
          selectRow={this.selectRow}
          insertRow={this.insertRow}
        />
      </Container>
    );
  }

  private resetHoverSelection = () => {
    const { state, dispatch } = this.props.editorView;
    this.setState({ dangerRows: [], hoveredRows: [] });
    resetHoverSelection(state, dispatch);
  };

  private selectRow = (row: number) => {
    const { state, dispatch } = this.props.editorView;
    dispatch(selectRow(row)(state.tr));
    this.resetHoverSelection();
  };

  private insertRow = (row: number) => {
    const { state, dispatch } = this.props.editorView;
    insertRow(row)(state, dispatch);
  };

  private hoverRows = (rows, danger) => {
    this.setState({ dangerRows: danger ? rows : [], hoveredRows: rows });
    const { state, dispatch } = this.props.editorView;
    hoverRows(rows, danger)(state, dispatch);
  };

  private deleteSelectedRows = () => {
    const { state, dispatch } = this.props.editorView;
    deleteSelectedRows(state, dispatch);
    this.resetHoverSelection();
  };

  private handleMouseDown = event => {
    event.preventDefault();
  };
}
