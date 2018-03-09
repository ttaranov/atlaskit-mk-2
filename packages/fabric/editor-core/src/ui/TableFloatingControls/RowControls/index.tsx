import * as React from 'react';
import { Component } from 'react';
import { EditorView } from 'prosemirror-view';
import { EditorState } from 'prosemirror-state';
import {
  RowInner,
  RowContainer,
  RowControlsButtonWrap,
  HeaderButton,
} from './styles';
import InsertRowButton from './InsertRowButton';
import { Command } from '../../../editor';
import { getLineMarkerWidth } from '../utils';

export interface Props {
  editorView: EditorView;
  tableElement: HTMLElement;
  isTableHovered: boolean;
  checkIfSelected: (row: number, state: EditorState) => boolean;
  selectRow: (row: number) => Command;
  insertRow: (row: number) => void;
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
      checkIfSelected,
      scroll,
    } = this.props;
    if (!tableElement) {
      return null;
    }
    const tbody = tableElement.querySelector('tbody')!;
    const rows = tbody.getElementsByTagName('tr');
    const nodes: any = [];
    const lineMarkerWidth = getLineMarkerWidth(tableElement, scroll);

    for (let i = 0, len = rows.length; i < len; i++) {
      const className =
        isTableHovered || checkIfSelected(i, state) ? 'active' : '';
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
            insertRow={this.props.insertRow}
            index={i + 1}
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
    this.props.selectRow(row)(state, dispatch);
  };

  private hoverRow = (row: number) => {
    const { state, dispatch } = this.props.editorView;
    this.props.hoverRow(row)(state, dispatch);
  };

  private resetHoverSelection = () => {
    const { state, dispatch } = this.props.editorView;
    this.props.resetHoverSelection(state, dispatch);
  };
}
