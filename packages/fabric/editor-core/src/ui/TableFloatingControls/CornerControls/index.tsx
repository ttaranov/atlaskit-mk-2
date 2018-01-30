import * as React from 'react';
import { Component } from 'react';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { toolbarSize } from '../styles';
import { CornerContainer, CornerButton } from './styles';
import InsertColumnButton from '../ColumnControls/InsertColumnButton';
import InsertRowButton from '../RowControls/InsertRowButton';
import { Command } from '../../../editor';
import { getLineMarkerWidth } from '../utils';

export interface Props {
  editorView: EditorView;
  tableElement: HTMLElement;
  checkIfSelected: (state: EditorState) => boolean;
  selectTable: Command;
  insertColumn: (column: number) => void;
  insertRow: (row: number) => void;
  hoverTable: Command;
  resetHoverSelection: Command;
  scroll: number;
  updateScroll: () => void;
}

export default class CornerControls extends Component<Props, any> {
  render() {
    const {
      tableElement,
      editorView: { state, dispatch },
      scroll,
    } = this.props;
    const tableHeight = tableElement.offsetHeight;
    const lineMarkerWidth = getLineMarkerWidth(tableElement, scroll);

    return (
      <CornerContainer
        className={this.props.checkIfSelected(state) ? 'active' : ''}
      >
        <CornerButton
          onClick={() => this.props.selectTable(state, dispatch)}
          onMouseOver={() => this.props.hoverTable(state, dispatch)}
          onMouseOut={() => this.props.resetHoverSelection(state, dispatch)}
        />
        <InsertColumnButton
          style={{ right: -toolbarSize, top: -toolbarSize - 8 }}
          index={0}
          insertColumn={this.props.insertColumn}
          lineMarkerHeight={tableHeight + toolbarSize}
        />
        <InsertRowButton
          style={{ bottom: -toolbarSize, left: -toolbarSize - 8 }}
          index={0}
          insertRow={this.props.insertRow}
          lineMarkerWidth={lineMarkerWidth}
          onMouseOver={this.props.updateScroll}
        />
      </CornerContainer>
    );
  }
}
