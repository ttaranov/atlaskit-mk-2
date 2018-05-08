import * as React from 'react';
import { Component } from 'react';
import { EditorView } from 'prosemirror-view';
import { isColumnSelected, selectColumn } from 'prosemirror-utils';
import { Command } from '../../../../../types';
import {
  checkIfHeaderColumnEnabled,
  checkIfNumberColumnEnabled,
} from '../../../utils';
import {
  ColumnContainer,
  ColumnInner,
  ColumnControlsButtonWrap,
  HeaderButton,
} from './styles';
import { toolbarSize } from '../styles';
import InsertColumnButton from './InsertColumnButton';

export interface Props {
  editorView: EditorView;
  tableElement?: HTMLElement;
  isTableHovered: boolean;
  insertColumn: (column: number) => Command;
  hoverColumn: (column: number) => Command;
  resetHoverSelection: Command;
}

export default class ColumnControls extends Component<Props, any> {
  render() {
    const { editorView: { state }, tableElement, isTableHovered } = this.props;
    if (!tableElement) {
      return null;
    }
    const tr = tableElement.querySelector('tr');
    if (!tr) {
      return null;
    }

    const cols = tr.children;
    const nodes: any = [];
    const tableHeight = tableElement.offsetHeight;

    for (let i = 0, len = cols.length; i < len; i++) {
      const className =
        isColumnSelected(i)(state.selection) || isTableHovered ? 'active' : '';
      nodes.push(
        <ColumnControlsButtonWrap
          key={i}
          className={`${className} table-column`}
          style={{ width: (cols[i] as HTMLElement).offsetWidth + 1 }}
          onMouseDown={this.handleMouseDown}
        >
          {/* tslint:disable:jsx-no-lambda */}
          <HeaderButton
            onMouseDown={() => this.selectColumn(i)}
            onMouseOver={() => this.hoverColumn(i)}
            onMouseOut={this.resetHoverSelection}
          />
          {!(
            i === 0 &&
            checkIfNumberColumnEnabled(state) &&
            checkIfHeaderColumnEnabled(state)
          ) && (
            <InsertColumnButton
              onClick={() => this.insertColumn(i + 1)}
              lineMarkerHeight={tableHeight + toolbarSize}
            />
          )}
        </ColumnControlsButtonWrap>,
      );
    }

    return (
      <ColumnContainer>
        <ColumnInner>{nodes}</ColumnInner>
      </ColumnContainer>
    );
  }

  private handleMouseDown = event => {
    event.preventDefault();
  };

  private selectColumn = (column: number) => {
    const { state, dispatch } = this.props.editorView;
    dispatch(selectColumn(column)(state.tr));
  };

  private hoverColumn = (column: number) => {
    const { state, dispatch } = this.props.editorView;
    this.props.hoverColumn(column)(state, dispatch);
  };

  private resetHoverSelection = () => {
    const { state, dispatch } = this.props.editorView;
    this.props.resetHoverSelection(state, dispatch);
  };

  private insertColumn = (column: number) => {
    const { state, dispatch } = this.props.editorView;
    this.props.insertColumn(column)(state, dispatch);
  };
}
