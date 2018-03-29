import * as React from 'react';
import { Component } from 'react';
import { EditorView } from 'prosemirror-view';
import { isTableSelected, selectTable } from 'prosemirror-utils';
import { toolbarSize } from '../styles';
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

    return (
      <CornerContainer
        className={isTableSelected(state.selection) ? 'active' : ''}
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
              onClick={this.insertColumn}
              lineMarkerHeight={tableHeight + toolbarSize}
            />
          )}
        {!checkIfHeaderRowEnabled(state) && (
          <InsertRowButton
            style={{ bottom: -toolbarSize, left: -toolbarSize - 8 }}
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

  private hoverTable = () => {
    const { state, dispatch } = this.props.editorView;
    this.props.hoverTable(state, dispatch);
  };

  private resetHoverSelection = () => {
    const { state, dispatch } = this.props.editorView;
    this.props.resetHoverSelection(state, dispatch);
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
