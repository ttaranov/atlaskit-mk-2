import * as React from 'react';
import { Component } from 'react';
import { toolbarSize } from '../styles';
import { EditorView } from 'prosemirror-view';
import { EditorState } from 'prosemirror-state';
import {
  ColumnContainer,
  ColumnInner,
  ColumnControlsButtonWrap,
  HeaderButton,
} from './styles';
import InsertColumnButton from './InsertColumnButton';
import { Command } from '../../../editor';
import {
  checkIfHeaderColumnEnabled,
  checkIfNumberColumnEnabled,
} from '../../../editor/plugins/table/utils';

export interface Props {
  editorView: EditorView;
  tableElement?: HTMLElement;
  isTableHovered: boolean;
  checkIfSelected: (column: number, state: EditorState) => boolean;
  selectColumn: (column: number) => Command;
  insertColumn: (column: number) => void;
  hoverColumn: (column: number) => Command;
  resetHoverSelection: Command;
}

export default class ColumnControls extends Component<Props, any> {
  render() {
    const {
      editorView: { state },
      tableElement,
      checkIfSelected,
      isTableHovered,
    } = this.props;
    if (!tableElement) {
      return null;
    }
    const cols = tableElement.querySelector('tr')!.children;
    const nodes: any = [];
    const tableHeight = tableElement.offsetHeight;

    for (let i = 0, len = cols.length; i < len; i++) {
      const className =
        checkIfSelected(i, state) || isTableHovered ? 'active' : '';
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
            checkIfNumberColumnEnabled(state) &&
            checkIfHeaderColumnEnabled(state) &&
            i === 0
          ) && (
            <InsertColumnButton
              insertColumn={this.props.insertColumn}
              index={i + 1}
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
    this.props.selectColumn(column)(state, dispatch);
  };

  private hoverColumn = (column: number) => {
    const { state, dispatch } = this.props.editorView;
    this.props.hoverColumn(column)(state, dispatch);
  };

  private resetHoverSelection = () => {
    const { state, dispatch } = this.props.editorView;
    this.props.resetHoverSelection(state, dispatch);
  };
}
