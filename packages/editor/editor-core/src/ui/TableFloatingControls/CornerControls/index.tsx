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
import {
  checkIfHeaderColumnEnabled,
  checkIfHeaderRowEnabled,
  checkIfNumberColumnEnabled,
} from '../../../editor/plugins/table/utils';

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
    const { tableElement, editorView: { state }, scroll } = this.props;
    const tableHeight = tableElement.offsetHeight;
    const lineMarkerWidth = getLineMarkerWidth(tableElement, scroll);

    return (
      <CornerContainer
        className={this.props.checkIfSelected(state) ? 'active' : ''}
      >
        <CornerButton
          onClick={this.selectTable}
          onMouseOver={this.hoverTable}
          onMouseOut={this.resetHoverSelection}
        />
        {!checkIfHeaderColumnEnabled(state) &&
          !checkIfNumberColumnEnabled(state) && (
            <InsertColumnButton
              style={{ right: -toolbarSize, top: -toolbarSize - 8 }}
              index={0}
              insertColumn={this.props.insertColumn}
              lineMarkerHeight={tableHeight + toolbarSize}
            />
          )}
        {!checkIfHeaderRowEnabled(state) && (
          <InsertRowButton
            style={{ bottom: -toolbarSize, left: -toolbarSize - 8 }}
            index={0}
            insertRow={this.props.insertRow}
            lineMarkerWidth={lineMarkerWidth}
            onMouseOver={this.props.updateScroll}
          />
        )}
      </CornerContainer>
    );
  }

  private selectTable = () => {
    const { state, dispatch } = this.props.editorView;
    this.props.selectTable(state, dispatch);
  };

  private hoverTable = () => {
    const { state, dispatch } = this.props.editorView;
    this.props.hoverTable(state, dispatch);
  };

  private resetHoverSelection = () => {
    const { state, dispatch } = this.props.editorView;
    this.props.resetHoverSelection(state, dispatch);
  };
}
