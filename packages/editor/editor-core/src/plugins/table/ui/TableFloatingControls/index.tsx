import * as React from 'react';
import { Component } from 'react';
import { EditorView } from 'prosemirror-view';
import { EditorState } from 'prosemirror-state';
import CornerControls from './CornerControls';
import RowControls from './RowControls';
import { Container } from './styles';
import { Command } from '../../../../types';

export interface State {
  scroll: number;
}

export interface Props {
  editorView: EditorView;
  tableElement?: HTMLElement;
  isTableHovered?: boolean;
  resetHoverSelection?: Command;
  selectTable?: Command;
  hoverTable?: Command;
  selectRow?: (row: number) => Command;
  hoverRow?: (row: number) => Command;
  selectColumn?: (column: number) => Command;
  hoverColumn?: (column: number) => Command;
  checkIfTableSelected?: (state: EditorState) => boolean;
  checkIfColumnSelected?: (column: number, state: EditorState) => boolean;
  checkIfRowSelected?: (row: number, state: EditorState) => boolean;
  insertColumn?: (column: number) => void;
  insertRow?: (row: number) => void;
}

export default class TableFloatingControls extends Component<Props, State> {
  state: State = {
    scroll: 0,
  };

  render() {
    const {
      editorView,
      selectTable,
      selectRow,
      hoverRow,
      resetHoverSelection,
      checkIfTableSelected,
      checkIfRowSelected,
      tableElement,
      insertColumn,
      insertRow,
      hoverTable,
      isTableHovered,
    } = this.props;

    if (!tableElement) {
      return null;
    }

    return (
      <Container onMouseDown={this.handleMouseDown}>
        <CornerControls
          editorView={editorView}
          tableElement={tableElement}
          checkIfSelected={checkIfTableSelected!}
          selectTable={selectTable!}
          insertColumn={insertColumn!}
          insertRow={insertRow!}
          hoverTable={hoverTable!}
          resetHoverSelection={resetHoverSelection!}
          updateScroll={this.updateScroll}
          scroll={this.state.scroll}
        />
        <RowControls
          editorView={editorView}
          tableElement={tableElement}
          checkIfSelected={checkIfRowSelected!}
          isTableHovered={isTableHovered!}
          selectRow={selectRow!}
          insertRow={insertRow!}
          hoverRow={hoverRow!}
          resetHoverSelection={resetHoverSelection!}
          updateScroll={this.updateScroll}
          scroll={this.state.scroll}
        />
      </Container>
    );
  }

  handleMouseDown = event => {
    event.preventDefault();
  };

  updateScroll = () => {
    const { parentElement } = this.props.tableElement!;
    this.setState({ scroll: parentElement!.scrollLeft });
  };
}
