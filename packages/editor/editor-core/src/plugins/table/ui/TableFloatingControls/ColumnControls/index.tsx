import * as React from 'react';
import { Component } from 'react';
import { EditorView } from 'prosemirror-view';
import { selectColumn, isTableSelected } from 'prosemirror-utils';
import {
  ColumnContainer,
  ColumnInner,
  ColumnControlsButtonWrap,
  HeaderButton,
} from './styles';
import { toolbarSize } from '../styles';
import { tableDeleteColumnButtonSize } from '../../styles';
import InsertColumnButton from './InsertColumnButton';
import DeleteColumnButton from './DeleteColumnButton';
import { findColumnSelection, TableSelection } from '../utils';
import {
  resetHoverSelection,
  hoverColumns,
  insertColumn,
  deleteSelectedColumns,
} from '../../../actions';

export interface Props {
  editorView: EditorView;
  tableRef?: HTMLElement;
  isTableHovered: boolean;
  isTableInDanger?: boolean;
}

export default class ColumnControls extends Component<Props, any> {
  state: { dangerColumns: number[] } = { dangerColumns: [] };

  createDeleteColumnButton(
    selection: TableSelection,
    offsetWidth,
    selectionWidth,
  ) {
    const selectedColIdxs: number[] = [];
    for (let i = 0; i < selection.count; i++) {
      selectedColIdxs.push(selection.startIdx! + i);
    }

    return (
      <DeleteColumnButton
        key="delete"
        style={{
          left:
            offsetWidth + selectionWidth / 2 - tableDeleteColumnButtonSize / 2,
        }}
        onClick={this.deleteColumns}
        onMouseEnter={() => this.hoverColumns(selectedColIdxs, true)}
        onMouseLeave={() => this.hoverColumns(selectedColIdxs)}
      />
    );
  }

  createDeleteColumnButtonForSelection(selection: TableSelection, cols) {
    let selectionGroupOffset = 0;
    let selectionGroupWidth = 0;

    // find the cols before
    for (let i = 0; i < selection.startIdx!; i++) {
      selectionGroupOffset += (cols[i] as HTMLElement).offsetWidth;
    }

    // these are the selected col widths
    for (let i = selection.startIdx!; i <= selection.endIdx!; i++) {
      selectionGroupWidth += (cols[i] as HTMLElement).offsetWidth;
    }

    return this.createDeleteColumnButton(
      selection,
      selectionGroupOffset,
      selectionGroupWidth,
    );
  }

  private classNamesForRow(i, len, selection) {
    const { isTableHovered, isTableInDanger } = this.props;

    const classNames = ['table-column'];

    if (selection.inSelection(i) || isTableHovered) {
      classNames.push('active');
    }

    if (this.state.dangerColumns.indexOf(i) !== -1 || isTableInDanger) {
      classNames.push('danger');
    }

    // since we can't use :last selector with class name selector (.table-row),
    // create a class-based selector instead
    if (i === len - 1) {
      classNames.push('last');
    }

    return classNames;
  }

  render() {
    const {
      editorView: { state },
      tableRef,
    } = this.props;
    if (!tableRef) {
      return null;
    }
    const tr = tableRef.querySelector('tr');
    if (!tr) {
      return null;
    }

    const cols = tr.children;
    const nodes: any = [];
    const tableHeight = tableRef.offsetHeight;

    let prevColWidths = 0;

    const selection = findColumnSelection(state, cols);

    for (let i = 0, len = cols.length; i < len; i++) {
      const onlyThisColumnSelected =
        selection.inSelection(i) &&
        !isTableSelected(state.selection) &&
        !selection.hasMultipleSelection;

      nodes.push(
        <ColumnControlsButtonWrap
          key={i}
          className={this.classNamesForRow(i, len, selection).join(' ')}
          style={{ width: (cols[i] as HTMLElement).offsetWidth + 1 }}
          onMouseDown={this.handleMouseDown}
        >
          {/* tslint:disable:jsx-no-lambda */}
          <HeaderButton
            onMouseDown={() => this.selectColumn(i)}
            onMouseOver={() => this.hoverColumns([i])}
            onMouseOut={this.resetHoverSelection}
          />
          {!(
            selection.hasMultipleSelection && selection.frontOfSelection(i)
          ) ? (
            <InsertColumnButton
              onClick={() => this.insertColumn(i + 1)}
              lineMarkerHeight={tableHeight + toolbarSize}
            />
          ) : null}
        </ColumnControlsButtonWrap>,
        onlyThisColumnSelected &&
          this.createDeleteColumnButton(
            selection,
            prevColWidths,
            (cols[i] as HTMLElement).offsetWidth,
          ),
      );

      prevColWidths += (cols[i] as HTMLElement).offsetWidth;
    }

    if (selection.hasMultipleSelection && !isTableSelected(state.selection)) {
      nodes.push(this.createDeleteColumnButtonForSelection(selection, cols));
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

  private deleteColumns = () => {
    const { state, dispatch } = this.props.editorView;
    deleteSelectedColumns(state, dispatch);
    this.resetHoverSelection();
  };

  private selectColumn = (column: number) => {
    const { state, dispatch } = this.props.editorView;
    dispatch(selectColumn(column)(state.tr));
  };

  private hoverColumns = (columns: number[], danger?: boolean) => {
    const { state, dispatch } = this.props.editorView;
    this.setState({ dangerColumns: danger ? columns : [] });
    hoverColumns(columns, danger)(state, dispatch);
  };

  private resetHoverSelection = () => {
    const { state, dispatch } = this.props.editorView;
    this.setState({ dangerColumns: [] });
    resetHoverSelection(state, dispatch);
  };

  private insertColumn = (column: number) => {
    const { state, dispatch } = this.props.editorView;
    insertColumn(column)(state, dispatch);
  };
}
