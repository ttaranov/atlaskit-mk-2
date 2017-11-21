import * as React from 'react';
import { Component } from 'react';
import { toolbarSize } from '../styles';
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

export interface Props {
  editorView: EditorView;
  tableElement: HTMLElement;
  isSelected: (row: number, state: EditorState) => boolean;
  selectRow: (row: number) => Command;
  insertRow: (row: number) => void;
  hoverRow: (row: number) => Command;
  resetHoverSelection: Command;
}

export default class RowControls extends Component<Props, any> {
  render () {
    const { editorView: { state, dispatch } } = this.props;
    const tbody = this.props.tableElement.querySelector('tbody')!;
    const rows = tbody.getElementsByTagName('tr');
    const nodes: any = [];
    const tableWidth = this.props.tableElement.offsetWidth;

    for (let i = 0, len = rows.length; i < len; i++) {
      nodes.push(
        <RowControlsButtonWrap
          key={i}
          className={this.props.isSelected(i, state) ? 'active' : ''}
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
            lineMarkerWidth={tableWidth + toolbarSize}
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
