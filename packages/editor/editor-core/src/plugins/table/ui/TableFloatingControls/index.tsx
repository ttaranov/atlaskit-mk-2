import * as React from 'react';
import { Component } from 'react';
import { EditorView } from 'prosemirror-view';
import CornerControls from './CornerControls';
import RowControls from './RowControls';
import NumberColumn from './NumberColumn';
import { Container } from './styles';
import {
  resetHoverSelection,
  selectRowClearHover,
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
  tableRef?: HTMLElement;
  tableActive?: boolean;
  isTableHovered?: boolean;
  isTableInDanger?: boolean;
  scroll?: number;

  isNumberColumnEnabled?: boolean;
  hasHeaderRow?: boolean;
}

export default class TableFloatingControls extends Component<Props, State> {
  state: State = {
    dangerRows: [],
    hoveredRows: [],
  };

  static defaultProps = {
    scroll: 0,
  };

  render() {
    const {
      editorView,
      tableRef,
      isTableHovered,
      isTableInDanger,
      isNumberColumnEnabled,
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
          tableRef={tableRef}
          resetHoverSelection={this.resetHoverSelection}
          scroll={this.props.scroll}
          isTableInDanger={isTableInDanger}
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
          scroll={this.props.scroll}
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
    selectRowClearHover(row)(state, dispatch);
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
