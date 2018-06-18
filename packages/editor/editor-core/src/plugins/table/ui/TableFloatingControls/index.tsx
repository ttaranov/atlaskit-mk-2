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
} from '../../actions';

export interface State {
  dangerRows: number[];
  hoveredRows: number[];
}

export interface Props {
  editorView: EditorView;
  tableElement?: HTMLElement;
  tableActive?: boolean;
  isTableHovered?: boolean;
  remove?: () => void;
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
      tableElement,
      remove,
      isTableHovered,
      isTableInDanger,
      isNumberColumnEnabled,
      tableActive,
      hasHeaderRow,
    } = this.props;

    if (!tableElement) {
      return null;
    }

    return (
      <Container onMouseDown={this.handleMouseDown}>
        {isNumberColumnEnabled ? (
          <NumberColumn
            state={editorView.state}
            hoverRows={this.hoverRows}
            resetHoverSelection={this.resetHoverSelection}
            tableElement={tableElement}
            tableActive={tableActive}
            dangerRows={this.state.dangerRows}
            hoveredRows={this.state.hoveredRows}
            hasHeaderRow={hasHeaderRow}
            isTableHovered={isTableHovered}
            scroll={this.props.scroll}
            isTableInDanger={isTableInDanger}
            selectRow={this.selectRow}
          />
        ) : null}
        <CornerControls
          editorView={editorView}
          tableElement={tableElement}
          resetHoverSelection={this.resetHoverSelection}
          scroll={this.props.scroll}
          isTableInDanger={isTableInDanger}
        />
        <RowControls
          editorView={editorView}
          tableElement={tableElement}
          isTableHovered={isTableHovered!}
          remove={remove!}
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

  handleMouseDown = event => {
    event.preventDefault();
  };
}
