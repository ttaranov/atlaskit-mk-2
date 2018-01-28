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
      editorView: { state, dispatch },
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
          className={className}
          style={{ height: (rows[i] as HTMLElement).offsetHeight + 1 }}
        >
          {/* tslint:disable:jsx-no-lambda */}
          <HeaderButton
            onClick={() => this.props.selectRow(i)(state, dispatch)}
            onMouseOver={() => this.props.hoverRow(i)(state, dispatch)}
            onMouseOut={() => this.props.resetHoverSelection(state, dispatch)}
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
}
