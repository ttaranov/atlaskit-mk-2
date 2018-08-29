import * as React from 'react';
import { Component } from 'react';
import { EditorView } from 'prosemirror-view';
import { isTableSelected, selectTable } from 'prosemirror-utils';
import { Selection } from 'prosemirror-state';
import { toolbarSize } from '../styles';
import { CornerContainer, CornerButton } from './styles';
import InsertColumnButton from '../ColumnControls/InsertColumnButton';
import InsertRowButton from '../RowControls/InsertRowButton';
import { hoverTable, insertColumn, insertRow } from '../../../actions';
import { getLineMarkerWidth } from '../utils';

export interface Props {
  editorView: EditorView;
  selection?: Selection;
  tableRef: HTMLElement;
  clearHoverSelection: () => void;
  isTableInDanger?: boolean;
  isHeaderColumnEnabled?: boolean;
  isHeaderRowEnabled?: boolean;
  isNumberColumnEnabled?: boolean;
}

export default class CornerControls extends Component<Props, any> {
  static defaultProps = {
    scroll: 0,
  };

  render() {
    const {
      tableRef,
      editorView: { state },
      isTableInDanger,
      isHeaderRowEnabled,
      isHeaderColumnEnabled,
      isNumberColumnEnabled,
    } = this.props;
    const tableHeight = tableRef.offsetHeight;
    return (
      <CornerContainer
        className={isTableSelected(state.selection) ? 'active' : ''}
      >
        <CornerButton
          onClick={this.selectTable}
          onMouseOver={this.hoverTable}
          onMouseOut={this.props.clearHoverSelection}
          className={isTableInDanger ? 'danger' : ''}
        />
        {!isHeaderColumnEnabled &&
          !isNumberColumnEnabled && (
            <InsertColumnButton
              onClick={this.insertColumn}
              lineMarkerHeight={tableHeight + toolbarSize}
            />
          )}
        {!isHeaderRowEnabled && (
          <InsertRowButton
            style={{ top: 2 }}
            onClick={this.insertRow}
            lineMarkerWidth={getLineMarkerWidth(
              tableRef,
              (tableRef.parentNode as HTMLElement).scrollLeft,
            )}
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
