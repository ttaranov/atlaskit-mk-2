import * as React from 'react';
import { Component } from 'react';
import { EditorView } from 'prosemirror-view';
import { isTableSelected, selectTable } from 'prosemirror-utils';
import { toolbarSize } from '../styles';
import { CornerContainer, CornerButton } from './styles';
import InsertColumnButton from '../ColumnControls/InsertColumnButton';
import InsertRowButton from '../RowControls/InsertRowButton';
import { getLineMarkerWidth } from '../utils';
import {
  checkIfHeaderColumnEnabled,
  checkIfHeaderRowEnabled,
  checkIfNumberColumnEnabled,
} from '../../../utils';
import { hoverTable, insertColumn, insertRow } from '../../../actions';

export interface Props {
  editorView: EditorView;
  tableElement: HTMLElement;
  resetHoverSelection: () => void;
  scroll?: number;
  isTableInDanger?: boolean;
}

export default class CornerControls extends Component<Props, any> {
  static defaultProps = {
    scroll: 0,
  };

  render() {
    const {
      tableElement,
      editorView: { state },
      scroll,
      isTableInDanger,
    } = this.props;
    const tableHeight = tableElement.offsetHeight;
    const lineMarkerWidth = getLineMarkerWidth(tableElement, scroll!);

    return (
      <CornerContainer
        className={isTableSelected(state.selection) ? 'active' : ''}
      >
        <CornerButton
          onClick={this.selectTable}
          onMouseOver={this.hoverTable}
          onMouseOut={this.props.resetHoverSelection}
          className={[
            isTableInDanger ? 'danger' : '',
            scroll && scroll > 0 ? 'scrolling' : '',
          ].join(' ')}
        />
        {!checkIfHeaderColumnEnabled(state) &&
          !checkIfNumberColumnEnabled(state) && (
            <InsertColumnButton
              onClick={this.insertColumn}
              lineMarkerHeight={tableHeight + toolbarSize}
            />
          )}
        {!checkIfHeaderRowEnabled(state) && (
          <InsertRowButton
            style={{ top: 2 }}
            onClick={this.insertRow}
            lineMarkerWidth={lineMarkerWidth}
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
    hoverTable()(state, dispatch);
  };

  private insertColumn = () => {
    const { state, dispatch } = this.props.editorView;
    insertColumn(0)(state, dispatch);
  };

  private insertRow = () => {
    const { state, dispatch } = this.props.editorView;
    insertRow(0)(state, dispatch);
  };
}
