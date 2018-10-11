import * as React from 'react';
import { Component } from 'react';
import { EditorView } from 'prosemirror-view';
import { isTableSelected, selectTable } from 'prosemirror-utils';
import { Selection } from 'prosemirror-state';
import InsertButton from '../InsertButton';
import { hoverTable, insertColumn, insertRow } from '../../../actions';
import { TableCssClassName as ClassName } from '../../../types';

export interface Props {
  editorView: EditorView;
  selection?: Selection;
  clearHoverSelection: () => void;
  isTableInDanger?: boolean;
  isHeaderColumnEnabled?: boolean;
  isHeaderRowEnabled?: boolean;
  isNumberColumnEnabled?: boolean;
  showInsertButton?: boolean;
}

export default class CornerControls extends Component<Props, any> {
  static defaultProps = {
    scroll: 0,
  };

  render() {
    const {
      editorView: { state },
      isTableInDanger,
      isHeaderRowEnabled,
      isHeaderColumnEnabled,
      isNumberColumnEnabled,
      showInsertButton,
    } = this.props;

    return (
      <div
        className={`${ClassName.CORNER_CONTROLS} ${
          isTableSelected(state.selection) ? 'active' : ''
        }`}
      >
        <button
          type="button"
          className={`${ClassName.CONTROLS_CORNER_BUTTON} ${
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
              index={0}
              showInsertButton={showInsertButton}
              onMouseDown={this.insertColumn}
            />
          )}
        {!isHeaderRowEnabled && (
          <InsertButton
            type="row"
            index={0}
            showInsertButton={showInsertButton}
            onMouseDown={this.insertRow}
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
