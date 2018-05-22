import * as React from 'react';
import { Component } from 'react';
import { EditorView } from 'prosemirror-view';
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
  hoverTable?: (danger?: boolean) => Command;
  hoverRows?: (rows: number[], danger?: boolean) => Command;
  insertColumn?: (column: number) => Command;
  insertRow?: (row: number) => Command;
  remove?: () => void;
  isTableInDanger?: boolean;
}

export default class TableFloatingControls extends Component<Props, State> {
  state: State = {
    scroll: 0,
  };

  render() {
    const {
      editorView,
      hoverRows,
      resetHoverSelection,
      tableElement,
      insertColumn,
      insertRow,
      remove,
      hoverTable,
      isTableHovered,
      isTableInDanger,
    } = this.props;

    if (!tableElement) {
      return null;
    }

    return (
      <Container onMouseDown={this.handleMouseDown}>
        <CornerControls
          editorView={editorView}
          tableElement={tableElement}
          insertColumn={insertColumn!}
          insertRow={insertRow!}
          hoverTable={hoverTable!}
          resetHoverSelection={resetHoverSelection!}
          updateScroll={this.updateScroll}
          scroll={this.state.scroll}
          isTableInDanger={isTableInDanger}
        />
        <RowControls
          editorView={editorView}
          tableElement={tableElement}
          isTableHovered={isTableHovered!}
          insertRow={insertRow!}
          remove={remove!}
          hoverRows={hoverRows!}
          resetHoverSelection={resetHoverSelection!}
          updateScroll={this.updateScroll}
          scroll={this.state.scroll}
          isTableInDanger={isTableInDanger}
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
