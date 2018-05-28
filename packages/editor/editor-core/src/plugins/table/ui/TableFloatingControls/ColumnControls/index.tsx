import * as React from 'react';
import { Component } from 'react';
import { EditorView } from 'prosemirror-view';
import { CellSelection } from 'prosemirror-tables';
import {
  selectColumn,
  isTableSelected,
  findTable,
  getCellsInColumn,
} from 'prosemirror-utils';
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
import { tableDeleteColumnButtonSize } from '../../styles';
import InsertColumnButton from './InsertColumnButton';
import DeleteColumnButton from './DeleteColumnButton';
import { findColumnSelection, TableSelection } from '../utils';

export interface Props {
  editorView: EditorView;
  tableElement?: HTMLElement;
  isTableHovered: boolean;
  insertColumn: (column: number) => Command;
  hoverColumns: (columns: number[], danger?: boolean) => Command;
  resetHoverSelection: Command;
  remove: () => void;
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
        onClick={() => this.deleteColumns(selectedColIdxs)}
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

  render() {
    const {
      editorView: { state },
      tableElement,
      isTableHovered,
      isTableInDanger,
    } = this.props;
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

    let prevColWidths = 0;

    const selection = findColumnSelection(state, cols);

    for (let i = 0, len = cols.length; i < len; i++) {
      const onlyThisColumnSelected =
        selection.inSelection(i) &&
        !isTableSelected(state.selection) &&
        !selection.hasMultipleSelection;
      const isNumberColumn = checkIfNumberColumnEnabled(state)
        ? i === 0
        : false;
      const classNames =
        selection.inSelection(i) || isTableHovered ? ['active'] : [''];
      if (this.state.dangerColumns.indexOf(i) !== -1 || isTableInDanger) {
        classNames.push('danger');
      }
      nodes.push(
        <ColumnControlsButtonWrap
          key={i}
          className={`${classNames.join(' ')} table-column`}
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
            i === 0 &&
            checkIfNumberColumnEnabled(state) &&
            checkIfHeaderColumnEnabled(state)
          ) &&
          !(selection.hasMultipleSelection && selection.frontOfSelection(i)) ? (
            <InsertColumnButton
              onClick={() => this.insertColumn(i + 1)}
              lineMarkerHeight={tableHeight + toolbarSize}
            />
          ) : null}
        </ColumnControlsButtonWrap>,
        onlyThisColumnSelected && !isNumberColumn
          ? this.createDeleteColumnButton(
              selection,
              prevColWidths,
              (cols[i] as HTMLElement).offsetWidth,
            )
          : null,
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

  private selectColumns = columnIdxs => tr => {
    const cells: { pos: number; node: Node }[] = columnIdxs.reduce(
      (acc, colIdx) => {
        const colCells = getCellsInColumn(colIdx)(tr.selection);
        return colCells ? acc.concat(colCells) : acc;
      },
      [],
    );

    if (cells) {
      const $anchor = tr.doc.resolve(cells[0].pos);
      const $head = tr.doc.resolve(cells[cells.length - 1].pos);
      return tr.setSelection(new CellSelection($anchor, $head));
    }
  };

  private deleteColumns(cols: number[]) {
    const { editorView: { dispatch, state } } = this.props;
    const table = findTable(state.selection);
    if (
      table &&
      cols.length &&
      table.node.attrs.isNumberColumnEnabled &&
      cols[0] === 0
    ) {
      // select all except number column to remove cells
      dispatch(this.selectColumns(cols.slice(1))(state.tr));
      this.props.remove();

      // reselect the number column
      this.selectColumns(cols[0]);
    } else {
      // normal delete
      this.props.remove();
    }
    this.resetHoverSelection();
  }

  private selectColumn = (column: number) => {
    const { state, dispatch } = this.props.editorView;
    dispatch(selectColumn(column)(state.tr));
  };

  private hoverColumns = (columns: number[], danger?: boolean) => {
    const { state, dispatch } = this.props.editorView;
    this.setState({ dangerColumns: danger ? columns : [] });
    this.props.hoverColumns(columns, danger)(state, dispatch);
  };

  private resetHoverSelection = () => {
    const { state, dispatch } = this.props.editorView;
    this.setState({ dangerColumns: [] });
    this.props.resetHoverSelection(state, dispatch);
  };

  private insertColumn = (column: number) => {
    const { state, dispatch } = this.props.editorView;
    this.props.insertColumn(column)(state, dispatch);
  };
}
