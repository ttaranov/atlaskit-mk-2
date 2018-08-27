import * as React from 'react';
import { Component } from 'react';
import { EditorView } from 'prosemirror-view';
import { Selection } from 'prosemirror-state';
import { isTableSelected } from 'prosemirror-utils';
import { browser } from '@atlaskit/editor-common';
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
import {
  findColumnSelection,
  TableSelection,
  isSelectionUpdated,
} from '../utils';
import {
  clearHoverSelection,
  hoverColumns,
  insertColumn,
  deleteSelectedColumns,
  selectColumn,
} from '../../../actions';

export interface Props {
  editorView: EditorView;
  selection?: Selection;
  tableRef?: HTMLElement;
  isTableHovered: boolean;
  isTableInDanger?: boolean;
  numberOfColumns?: number;
  dangerColumns?: number[];
}

export default class ColumnControls extends Component<Props, any> {
  static defaultProps = {
    dangerColumns: [],
  };

  shouldComponentUpdate(nextProps, nextState) {
    const {
      tableRef,
      isTableHovered,
      isTableInDanger,
      selection,
      numberOfColumns,
    } = this.props;

    if (nextProps.tableRef) {
      const controls = nextProps.tableRef.parentNode!.firstChild as HTMLElement;
      // checks if controls width is different from table width
      // 1px difference is acceptible and occurs in some situations due to the browser rendering specifics
      const shouldUpdate =
        Math.abs(controls.offsetWidth - nextProps.tableRef.offsetWidth) > 1;
      if (shouldUpdate) {
        return true;
      }
    }

    return (
      tableRef !== nextProps.tableRef ||
      isTableHovered !== nextProps.isTableHovered ||
      isTableInDanger !== nextProps.isTableInDanger ||
      numberOfColumns !== nextProps.numberOfColumns ||
      this.props.dangerColumns !== nextProps.dangerColumns ||
      isSelectionUpdated(selection, nextProps.selection)
    );
  }

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

    if (this.props.dangerColumns!.indexOf(i) !== -1 || isTableInDanger) {
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
            onMouseOut={this.clearHoverSelection}
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
    this.clearHoverSelection();
  };

  private selectColumn = (column: number) => {
    const { editorView } = this.props;
    const { state, dispatch } = editorView;
    // fix for issue ED-4665
    if (browser.ie_version === 11) {
      (editorView.dom as HTMLElement).blur();
    }
    selectColumn(column)(state, dispatch);
  };

  private hoverColumns = (columns: number[], danger?: boolean) => {
    const { state, dispatch } = this.props.editorView;
    hoverColumns(columns, danger)(state, dispatch);
  };

  private clearHoverSelection = () => {
    const { state, dispatch } = this.props.editorView;
    clearHoverSelection(state, dispatch);
  };

  private insertColumn = (column: number) => {
    const { state, dispatch } = this.props.editorView;
    insertColumn(column)(state, dispatch);
  };
}
