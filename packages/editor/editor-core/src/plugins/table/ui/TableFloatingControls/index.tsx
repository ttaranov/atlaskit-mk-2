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
  hoverTable?: Command;
  hoverRow?: (row: number) => Command;
  hoverColumn?: (column: number) => Command;
  insertColumn?: (column: number) => Command;
  insertRow?: (row: number) => Command;
}

export default class TableFloatingControls extends Component<Props, State> {
  state: State = {
    scroll: 0,
  };

  render() {
    const {
      editorView,
      hoverRow,
      resetHoverSelection,
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
          isTableHovered={isTableHovered!}
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
