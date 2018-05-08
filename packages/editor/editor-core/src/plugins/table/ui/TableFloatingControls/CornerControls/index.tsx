import * as React from 'react';
import { Component } from 'react';
import { EditorView } from 'prosemirror-view';
import { isTableSelected, selectTable } from 'prosemirror-utils';
import { akEditorTableToolbarSize } from '../../../../../styles';
import { CornerContainer, CornerButton } from './styles';
import InsertColumnButton from '../ColumnControls/InsertColumnButton';
import InsertRowButton from '../RowControls/InsertRowButton';
import { Command } from '../../../../../types';
import { getLineMarkerWidth } from '../utils';
import {
  checkIfHeaderColumnEnabled,
  checkIfHeaderRowEnabled,
  checkIfNumberColumnEnabled,
} from '../../../utils';

export interface Props {
  editorView: EditorView;
  tableElement: HTMLElement;
  insertColumn: (column: number) => Command;
  insertRow: (row: number) => Command;
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
    const toolbarSize = akEditorTableToolbarSize / 2;
    return (
      <CornerContainer
        className={`table-corner-controls ${
          isTableSelected(state.selection) ? 'active' : ''
        }`}
      >
        <CornerButton onClick={this.selectTable} />
        {!checkIfHeaderColumnEnabled(state) &&
          !checkIfNumberColumnEnabled(state) && (
            <InsertColumnButton
              style={{ right: -toolbarSize + 1, top: -toolbarSize - 8 }}
              onClick={this.insertColumn}
              lineMarkerHeight={tableHeight + akEditorTableToolbarSize - 1}
            />
          )}
        {!checkIfHeaderRowEnabled(state) && (
          <InsertRowButton
            style={{ bottom: -toolbarSize + 1, left: -toolbarSize - 8 }}
            onClick={this.insertRow}
            lineMarkerWidth={lineMarkerWidth}
            onMouseOver={this.props.updateScroll}
          />
        )}
      </CornerContainer>
    );
  }

  private selectTable = () => {
    const { state, dispatch } = this.props.editorView;
    dispatch(selectTable(state.tr));
  };

  private insertColumn = () => {
    const { state, dispatch } = this.props.editorView;
    this.props.insertColumn(0)(state, dispatch);
  };

  private insertRow = () => {
    const { state, dispatch } = this.props.editorView;
    this.props.insertRow(0)(state, dispatch);
  };
}
