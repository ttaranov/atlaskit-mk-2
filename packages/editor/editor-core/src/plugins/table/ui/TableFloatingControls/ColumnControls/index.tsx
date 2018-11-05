import * as React from 'react';
import { Component, SyntheticEvent } from 'react';
import { EditorView } from 'prosemirror-view';
import { Selection } from 'prosemirror-state';
import { isTableSelected, isCellSelection } from 'prosemirror-utils';
import { browser } from '@atlaskit/editor-common';
import { tableDeleteButtonSize } from '../../styles';
import InsertButton from '../InsertButton';
import DeleteButton from '../DeleteButton';
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
import { TableCssClassName as ClassName } from '../../../types';
import tableMessages from '../../messages';

export interface Props {
  editorView: EditorView;
  selection?: Selection;
  tableRef?: HTMLElement;
  isTableHovered: boolean;
  isTableInDanger?: boolean;
  numberOfColumns?: number;
  dangerColumns?: number[];
  insertColumnButtonIndex?: number;
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
      insertColumnButtonIndex,
    } = this.props;

    if (nextProps.tableRef) {
      const controls = nextProps.tableRef.parentNode!.firstChild as HTMLElement;
      // checks if controls width is different from table width
      // 1px difference is acceptable and occurs in some situations due to the browser rendering specifics
      const shouldUpdate =
        Math.abs(controls.offsetWidth - nextProps.tableRef.offsetWidth) > 1;
      if (shouldUpdate) {
        return true;
      }
    }

    return (
      tableRef !== nextProps.tableRef ||
      insertColumnButtonIndex !== nextProps.insertColumnButtonIndex ||
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
      <DeleteButton
        key="delete"
        removeLabel={tableMessages.removeColumns}
        style={{
          left: offsetWidth + selectionWidth / 2 - tableDeleteButtonSize / 2,
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

    const classNames: string[] = [];

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
      insertColumnButtonIndex,
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

    let prevColWidths = 0;

    const selection = findColumnSelection(state, cols);

    for (let i = 0, len = cols.length; i < len; i++) {
      const onlyThisColumnSelected =
        selection.inSelection(i) &&
        !isTableSelected(state.selection) &&
        !selection.hasMultipleSelection;

      nodes.push(
        <div
          className={`${
            ClassName.COLUMN_CONTROLS_BUTTON_WRAP
          } ${this.classNamesForRow(i, len, selection).join(' ')}`}
          key={i}
          style={{ width: (cols[i] as HTMLElement).offsetWidth + 1 }}
          onMouseDown={this.handleMouseDown}
        >
          <button
            type="button"
            className={ClassName.CONTROLS_BUTTON}
            onMouseDown={() => this.selectColumn(i)}
            onMouseOver={() => this.hoverColumns([i])}
            onMouseOut={this.clearHoverSelection}
          >
            {!isCellSelection(state.selection) && (
              <>
                <div
                  className={ClassName.CONTROLS_BUTTON_OVERLAY}
                  data-index={i}
                />
                <div
                  className={ClassName.CONTROLS_BUTTON_OVERLAY}
                  data-index={i + 1}
                />
              </>
            )}
          </button>
          {!(
            selection.hasMultipleSelection && selection.frontOfSelection(i)
          ) ? (
            <InsertButton
              type="column"
              tableRef={tableRef}
              index={i + 1}
              showInsertButton={insertColumnButtonIndex === i + 1}
              onMouseDown={() => this.insertColumn(i + 1)}
            />
          ) : null}
        </div>,
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
      <div className={ClassName.COLUMN_CONTROLS}>
        <div className={ClassName.COLUMN_CONTROLS_INNER}>{nodes}</div>
      </div>
    );
  }

  private handleMouseDown = (event: SyntheticEvent) => {
    event.preventDefault();
  };

  private deleteColumns = (event: SyntheticEvent) => {
    event.preventDefault();
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
