import * as React from 'react';
import { PureComponent } from 'react';
import { EditorView } from 'prosemirror-view';
import { TableState } from '../../plugins/table';
import CornerControls from './CornerControls';
import ColumnControls from './ColumnControls';
import RowControls from './RowControls';
import { Container } from './styles';
import { EditorState } from 'prosemirror-state';
import { Command } from '../../editor';

export interface Props {
  pluginState: TableState;
  editorView: EditorView;
  selectRow?: (row: number) => Command;
  hoverRow?: (row: number) => Command;
  resetHoverSelection?: Command;
  selectColumn?: (column: number) => Command;
  hoverColumn?: (column: number) => Command;
  selectTable?: Command;
  hoverTable?: Command;
  isTableSelected?: (state: EditorState) => boolean;
  isColumnSelected?: (column: number, state: EditorState) => boolean;
  isRowSelected?: (row: number, state: EditorState) => boolean;
}

export interface State {
  tableHovered: boolean;
}

export default class TableFloatingControls extends PureComponent<Props, State> {
  state: State = {
    tableHovered: false,
  };

  handleMouseDown = event => {
    event.preventDefault();
  };

  handleKeyDown = event => {
    const { editorView, pluginState } = this.props;
    const result = pluginState.keymapHandler(editorView, event.nativeEvent);
    if (result) {
      event.preventDefault();
    }
    if (!pluginState.cellSelection) {
      this.setState({ tableHovered: false });
    }
  };

  handleCornerMouseOver = () => {
    const { editorView: { state, dispatch }, hoverTable } = this.props;
    this.setState({ tableHovered: true });
    hoverTable!(state, dispatch);
  }

  handleCornerMouseOut = () => {
    const { editorView: { state, dispatch }, resetHoverSelection } = this.props;
    this.setState({ tableHovered: false });
    resetHoverSelection!(state, dispatch);
  }

  render() {
    const {
      editorView,
      pluginState,
      selectTable,
      selectColumn,
      selectRow,
      hoverColumn,
      hoverRow,
      resetHoverSelection,
      isTableSelected,
      isColumnSelected,
      isRowSelected
    } = this.props;
    const { tableElement } = pluginState;
    if (!tableElement) {
      return null;
    }

    return (
      <Container
        onMouseDown={this.handleMouseDown}
        className={this.state.tableHovered ? 'tableHovered' : ''}
        onKeyDown={this.handleKeyDown}
      >
        <CornerControls
          editorView={editorView}
          tableElement={tableElement}
          isSelected={isTableSelected!}
          selectTable={selectTable!}
          insertColumn={pluginState.insertColumn}
          insertRow={pluginState.insertRow}
          onMouseOver={this.handleCornerMouseOver}
          onMouseOut={this.handleCornerMouseOut}
        />
        <ColumnControls
          editorView={editorView}
          tableElement={tableElement}
          isSelected={isColumnSelected!}
          selectColumn={selectColumn!}
          insertColumn={pluginState.insertColumn}
          hoverColumn={hoverColumn!}
          resetHoverSelection={resetHoverSelection!}
        />
        <RowControls
          editorView={editorView}
          tableElement={tableElement}
          isSelected={isRowSelected!}
          selectRow={selectRow!}
          insertRow={pluginState.insertRow}
          hoverRow={hoverRow!}
          resetHoverSelection={resetHoverSelection!}
        />
      </Container>
    );
  }
}
