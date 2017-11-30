import * as React from 'react';
import { Component } from 'react';
import { toolbarSize } from '../styles';
import { EditorView } from 'prosemirror-view';
import { EditorState, Transaction } from 'prosemirror-state';
import {
  ColumnContainer,
  ColumnInner,
  ColumnControlsButtonWrap,
  HeaderButton,
} from './styles';
import InsertColumnButton from './InsertColumnButton';

export interface Props {
  editorView: EditorView;
  tableElement: HTMLElement;
  isSelected: (column: number) => boolean;
  selectColumn: (column: number) => void;
  insertColumn: (column: number) => void;
  hoverColumn: (
    column: number,
    state: EditorState,
    dispatch: (tr: Transaction) => void,
  ) => void;
  resetHoverSelection: (
    state: EditorState,
    dispatch: (tr: Transaction) => void,
  ) => void;
}

export default class ColumnControls extends Component<Props, any> {
  render() {
    const { editorView } = this.props;
    const cols = this.props.tableElement.querySelector('tr')!.children;
    const nodes: any = [];
    const tableHeight = this.props.tableElement.offsetHeight;

    for (let i = 0, len = cols.length; i < len; i++) {
      nodes.push(
        <ColumnControlsButtonWrap
          key={i}
          className={this.props.isSelected(i) ? 'active' : ''}
          style={{ width: (cols[i] as HTMLElement).offsetWidth + 1 }}
        >
          {/* tslint:disable:jsx-no-lambda */}
          <HeaderButton
            onClick={() => this.props.selectColumn(i)}
            onMouseOver={() =>
              this.props.hoverColumn(i, editorView.state, editorView.dispatch)
            }
            onMouseOut={() =>
              this.props.resetHoverSelection(
                editorView.state,
                editorView.dispatch,
              )
            }
          />
          {/* tslint:enable:jsx-no-lambda */}
          <InsertColumnButton
            insertColumn={this.props.insertColumn}
            index={i + 1}
            lineMarkerHeight={tableHeight + toolbarSize}
          />
        </ColumnControlsButtonWrap>,
      );
    }

    return (
      <ColumnContainer>
        <ColumnInner>{nodes}</ColumnInner>
      </ColumnContainer>
    );
  }
}
