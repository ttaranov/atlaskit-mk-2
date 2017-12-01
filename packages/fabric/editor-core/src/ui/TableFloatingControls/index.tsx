import * as React from 'react';
import { PureComponent } from 'react';
import { EditorView } from 'prosemirror-view';
import { TableState } from '../../plugins/table';
import CornerControls from './CornerControls';
import ColumnControls from './ColumnControls';
import RowControls from './RowControls';
import { Container } from './styles';
import {
  hoverColumn,
  hoverTable,
  hoverRow,
  resetHoverSelection,
} from '../../editor/plugins/table/actions';

export interface Props {
  pluginState: TableState;
  editorView: EditorView;
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
    const { editorView } = this.props;
    this.setState({ tableHovered: true });
    hoverTable(editorView.state, editorView.dispatch);
  };

  handleCornerMouseOut = () => {
    const { editorView } = this.props;
    this.setState({ tableHovered: false });
    resetHoverSelection(editorView.state, editorView.dispatch);
  };

  render() {
    const { editorView, pluginState } = this.props;
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
          tableElement={tableElement}
          isSelected={pluginState.isTableSelected}
          selectTable={pluginState.selectTable}
          insertColumn={pluginState.insertColumn}
          insertRow={pluginState.insertRow}
          onMouseOver={this.handleCornerMouseOver}
          onMouseOut={this.handleCornerMouseOut}
        />
        <ColumnControls
          editorView={editorView}
          tableElement={tableElement}
          isSelected={pluginState.isColumnSelected}
          selectColumn={pluginState.selectColumn}
          insertColumn={pluginState.insertColumn}
          hoverColumn={hoverColumn}
          resetHoverSelection={resetHoverSelection}
        />
        <RowControls
          editorView={editorView}
          tableElement={tableElement}
          isSelected={pluginState.isRowSelected}
          selectRow={pluginState.selectRow}
          insertRow={pluginState.insertRow}
          hoverRow={hoverRow}
          resetHoverSelection={resetHoverSelection}
        />
      </Container>
    );
  }
}
