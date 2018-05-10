import * as React from 'react';
import { Component } from 'react';
import { EditorView } from 'prosemirror-view';
import { isRowSelected, selectRow } from 'prosemirror-utils';
import {
  RowInner,
  RowContainer,
  RowControlsButtonWrap,
  HeaderButton,
} from './styles';
import InsertRowButton from './InsertRowButton';
import { Command } from '../../../../../types';
import { getLineMarkerWidth } from '../utils';

export interface Props {
  editorView: EditorView;
  tableElement: HTMLElement;
  isTableHovered: boolean;
  insertRow: (row: number) => Command;
  hoverRow: (row: number) => Command;
  resetHoverSelection: Command;
  scroll: number;
  updateScroll: () => void;
}

export default class RowControls extends Component<Props, any> {
  render() {
    const {
      tableElement,
      editorView: { state },
      isTableHovered,
      scroll,
    } = this.props;
    if (!tableElement) {
      return null;
    }
    const tbody = tableElement.querySelector('tbody');
    if (!tbody) {
      return null;
    }

    const rows = tbody.getElementsByTagName('tr');
    const nodes: any = [];
    const lineMarkerWidth = getLineMarkerWidth(tableElement, scroll);

    for (let i = 0, len = rows.length; i < len; i++) {
      const className =
        isTableHovered || isRowSelected(i)(state.selection) ? 'active' : '';
      nodes.push(
        <RowControlsButtonWrap
          key={i}
          className={`${className} table-row`}
          style={{ height: (rows[i] as HTMLElement).offsetHeight + 1 }}
        >
          {/* tslint:disable:jsx-no-lambda */}
          <HeaderButton
            onClick={() => this.selectRow(i)}
            onMouseOver={() => this.hoverRow(i)}
            onMouseOut={this.resetHoverSelection}
          />
          {/* tslint:enable:jsx-no-lambda */}
          <InsertRowButton
            onClick={() => this.insertRow(i + 1)}
            lineMarkerWidth={lineMarkerWidth}
            onMouseOver={this.props.updateScroll}
          />
        </RowControlsButtonWrap>,
      );
    }

    return (
      <RowContainer>
        <RowInner>{nodes}</RowInner>
      </RowContainer>
    );
  }

  private selectRow = (row: number) => {
    const { state, dispatch } = this.props.editorView;
    dispatch(selectRow(row)(state.tr));
  };

  private hoverRow = (row: number) => {
    const { state, dispatch } = this.props.editorView;
    this.props.hoverRow(row)(state, dispatch);
  };

  private resetHoverSelection = () => {
    const { state, dispatch } = this.props.editorView;
    this.props.resetHoverSelection(state, dispatch);
  };

  private insertRow = (row: number) => {
    const { state, dispatch } = this.props.editorView;
    this.props.insertRow(row)(state, dispatch);
  };
}
