import * as React from 'react';
import { Component } from 'react';
import { EditorView } from 'prosemirror-view';
import { isTableSelected, selectTable } from 'prosemirror-utils';
import { Selection } from 'prosemirror-state';
import { tableToolbarSize } from '../../styles';
import InsertButton from '../InsertButton';
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
      <div
        className={`pm-table-corner-controls ${
          isTableSelected(state.selection) ? 'active' : ''
        }`}
      >
        <button
          type="button"
          className={`pm-table-corner-button ${
            isTableInDanger ? 'danger' : ''
          }`}
          onClick={this.selectTable}
          onMouseOver={this.hoverTable}
          onMouseOut={this.props.clearHoverSelection}
        />
        {!isHeaderColumnEnabled &&
          !isNumberColumnEnabled && (
            <InsertButton
              type="column"
              onClick={this.insertColumn}
              insertLineStyle={{
                height: tableHeight + tableToolbarSize,
              }}
            />
          )}
        {!isHeaderRowEnabled && (
          <InsertButton
            type="row"
            onClick={this.insertRow}
            insertLineStyle={{
              width: getLineMarkerWidth(
                tableRef,
                (tableRef.parentNode as HTMLElement).scrollLeft,
              ),
            }}
          />
        )}
      </div>
    );
  }

  private selectTable = () => {
    const { state, dispatch } = this.props.editorView;
    dispatch(selectTable(state.tr).setMeta('addToHistory', false));
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
