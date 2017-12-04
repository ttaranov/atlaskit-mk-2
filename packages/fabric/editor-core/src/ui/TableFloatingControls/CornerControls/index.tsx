import * as React from 'react';
import { Component } from 'react';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { toolbarSize } from '../styles';
import { CornerContainer, CornerButton } from './styles';
import InsertColumnButton from '../ColumnControls/InsertColumnButton';
import InsertRowButton from '../RowControls/InsertRowButton';
import { Command } from '../../../editor';

export interface Props {
  editorView: EditorView;
  tableElement: HTMLElement;
  isSelected: (state: EditorState) => boolean;
  selectTable: Command;
  insertColumn: (column: number) => void;
  insertRow: (row: number) => void;
  onMouseOver: () => void;
  onMouseOut: () => void;
}

export default class CornerControls extends Component<Props, any> {
  render() {
    const { tableElement, editorView: { state, dispatch } } = this.props;
    const tableWidth = tableElement.offsetWidth;
    const tableHeight = tableElement.offsetHeight;

    return (
      <CornerContainer className={this.props.isSelected(state) ? 'active' : ''}>
        <CornerButton
          onClick={() => this.props.selectTable(state, dispatch)}
          onMouseOver={this.props.onMouseOver}
          onMouseOut={this.props.onMouseOut}
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
          lineMarkerWidth={tableWidth + toolbarSize}
        />
      </CornerContainer>
    );
  }
}
