import { Node as PmNode } from 'prosemirror-model';
import {
  EditorState,
  Plugin,
  PluginKey,
  Selection,
  TextSelection,
} from 'prosemirror-state';
import {
  addColumnAfter,
  addColumnBefore,
  addRowAfter,
  addRowBefore,
  CellSelection,
  deleteTable,
  deleteColumn,
  deleteRow,
  TableMap,
  toggleHeaderRow,
} from 'prosemirror-tables';
import { EditorView, DecorationSet } from 'prosemirror-view';
import {
  isElementInTableCell,
  setNodeSelection,
  isLastItemMediaGroup,
  closestElement,
} from '../../../utils/';

import { analyticsService } from '../../../analytics';

import TableNode from '../nodeviews/table';

import {
  resetHoverSelection,
  selectRow,
  emptySelectedCells,
  clearSelection,
} from '../actions';

import {
  tableStartPos,
  isHeaderRowSelected,
  getCellSelection,
  createControlsDecorationSet,
  getSelectedColumn,
  getSelectedRow,
  containsTableHeader,
  getCurrentCell,
  getTableElement,
  getTableNode,
  canInsertTable,
} from '../utils';

export type TableStateSubscriber = (state: TableState) => any;

export interface PluginConfig {
  isHeaderRowRequired?: boolean;
  allowColumnResizing?: boolean;
  allowMergeCells?: boolean;
  allowNumberColumn?: boolean;
  allowBackgroundColor?: boolean;
  allowHeaderRow?: boolean;
  allowHeaderColumn?: boolean;
}

export class TableState {
  cellElement?: HTMLElement;
  tableElement?: HTMLElement;
  editorFocused: boolean = false;
  tableNode?: PmNode;
  cellSelection?: CellSelection;
  tableHidden: boolean = false;
  tableDisabled: boolean = false;
  tableActive: boolean = false;
  domEvent: boolean = false;
  view: EditorView;
  set: DecorationSet = DecorationSet.empty;
  allowColumnResizing: boolean = false;
  allowMergeCells: boolean = false;
  allowNumberColumn: boolean = false;
  allowBackgroundColor: boolean = false;
  allowHeaderRow: boolean = false;
  allowHeaderColumn: boolean = false;

  private isHeaderRowRequired: boolean = false;
  private changeHandlers: TableStateSubscriber[] = [];

  constructor(state: EditorState, pluginConfig: PluginConfig = {}) {
    this.changeHandlers = [];

    const { table, tableCell, tableRow, tableHeader } = state.schema.nodes;
    this.tableHidden = !table || !tableCell || !tableRow || !tableHeader;
    this.isHeaderRowRequired = !!pluginConfig.isHeaderRowRequired;
    this.allowColumnResizing = !!pluginConfig.allowColumnResizing;
    this.allowMergeCells = !!pluginConfig.allowMergeCells;
    this.allowNumberColumn = !!pluginConfig.allowNumberColumn;
    this.allowBackgroundColor = !!pluginConfig.allowBackgroundColor;
    this.allowHeaderRow = !!pluginConfig.allowHeaderRow;
    this.allowHeaderColumn = !!pluginConfig.allowHeaderColumn;
  }

  insertColumn = (column: number): void => {
    if (this.tableNode) {
      const map = TableMap.get(this.tableNode);
      const { dispatch } = this.view;

      // last column
      if (column === map.width) {
        // to add a column we need to move the cursor to an appropriate cell first
        const prevColPos = map.positionAt(0, column - 1, this.tableNode);
        this.moveCursorTo(prevColPos);
        addColumnAfter(this.view.state, dispatch);
        // then we move the cursor to the newly created cell
        const nextPos = TableMap.get(this.tableNode).positionAt(
          0,
          column,
          this.tableNode,
        );
        this.moveCursorTo(nextPos);
      } else {
        const pos = map.positionAt(0, column, this.tableNode);
        this.moveCursorTo(pos);
        addColumnBefore(this.view.state, dispatch);
        this.moveCursorTo(pos);
      }

      analyticsService.trackEvent(
        'atlassian.editor.format.table.column.button',
      );
    }
  };

  insertRow = (row: number): void => {
    if (this.tableNode) {
      const map = TableMap.get(this.tableNode);
      const { dispatch } = this.view;

      // last row
      if (row === map.height) {
        const prevRowPos = map.positionAt(row - 1, 0, this.tableNode);
        this.moveCursorTo(prevRowPos);
        addRowAfter(this.view.state, dispatch);
        const nextPos = TableMap.get(this.tableNode).positionAt(
          row,
          0,
          this.tableNode,
        );
        this.moveCursorTo(nextPos);
      } else {
        const pos = map.positionAt(row, 0, this.tableNode);
        this.moveCursorTo(pos);
        addRowBefore(this.view.state, dispatch);
        this.moveCursorTo(pos);
      }

      analyticsService.trackEvent('atlassian.editor.format.table.row.button');
    }
  };

  remove = (): void => {
    const { state, dispatch } = this.view;
    const cellSelection = getCellSelection(state);
    if (!cellSelection) {
      return;
    }
    const tableNode = cellSelection.$anchorCell.node(-1);
    const isRowSelected = cellSelection.isRowSelection();
    const isColumnSelected = cellSelection.isColSelection();

    // the whole table
    if (isRowSelected && isColumnSelected) {
      deleteTable(state, dispatch);
      this.focusEditor();
      analyticsService.trackEvent(
        'atlassian.editor.format.table.delete.button',
      );
    } else if (isColumnSelected) {
      analyticsService.trackEvent(
        'atlassian.editor.format.table.delete_column.button',
      );

      // move the cursor in the column to the left of the deleted column(s)
      const map = TableMap.get(tableNode);
      const { anchor, head } = getSelectedColumn(this.view.state);
      const column = Math.min(anchor, head);
      const nextPos = map.positionAt(0, column > 0 ? column - 1 : 0, tableNode);
      deleteColumn(state, dispatch);
      this.moveCursorTo(nextPos);
    } else if (isRowSelected) {
      const { tableHeader } = this.view.state.schema.nodes;
      const cell = getCurrentCell(this.view.state);
      const event =
        cell && cell.type === tableHeader ? 'delete_header_row' : 'delete_row';
      analyticsService.trackEvent(
        `atlassian.editor.format.table.${event}.button`,
      );
      const headerRowSelected = isHeaderRowSelected(this.view.state);
      // move the cursor to the beginning of the next row, or prev row if deleted row was the last row
      const { anchor, head } = getSelectedRow(this.view.state);
      const map = TableMap.get(tableNode);
      const minRow = Math.min(anchor, head);
      const maxRow = Math.max(anchor, head);
      const isRemovingLastRow = maxRow === map.height - 1;
      deleteRow(state, dispatch);
      if (headerRowSelected && this.isHeaderRowRequired) {
        this.convertFirstRowToHeader();
      }
      const nextPos = map.positionAt(
        isRemovingLastRow ? minRow - 1 : minRow,
        0,
        tableNode,
      );
      this.moveCursorTo(nextPos);
    } else {
      // replace selected cells with empty cells
      emptySelectedCells(state, dispatch);
      this.moveCursorInsideTableTo(state.selection.from);
      analyticsService.trackEvent(
        'atlassian.editor.format.table.delete_content.button',
      );
    }
  };

  convertFirstRowToHeader = () => {
    const { state, dispatch } = this.view;
    selectRow(0)(state, dispatch);
    toggleHeaderRow(state, dispatch);
  };

  subscribe(cb: TableStateSubscriber): void {
    if (this.changeHandlers.indexOf(cb) < 0) {
      this.changeHandlers.push(cb);
      cb(this);
    }
  }

  unsubscribe(cb: TableStateSubscriber): void {
    this.changeHandlers = this.changeHandlers.filter(ch => ch !== cb);
  }

  updateEditorFocused(editorFocused: boolean): void {
    this.editorFocused = editorFocused;
  }

  update(domEvent: boolean = false) {
    let dirty = this.updateSelection();
    let controlsDirty = dirty;
    const { state } = this.view;

    const tableElement = getTableElement(state, this.view);
    if ((domEvent && tableElement) || tableElement !== this.tableElement) {
      this.tableElement = tableElement;
      this.domEvent = domEvent;
      dirty = true;
    }

    const tableNode = getTableNode(state);
    if (tableNode !== this.tableNode) {
      this.tableNode = tableNode;
      dirty = true;
      controlsDirty = true;
    }

    const tableActive = this.editorFocused && !!tableElement;
    if (tableActive !== this.tableActive) {
      this.tableActive = tableActive;
      dirty = true;
      controlsDirty = true;
    }

    const tableDisabled = !canInsertTable(state);
    if (tableDisabled !== this.tableDisabled) {
      this.tableDisabled = tableDisabled;
      dirty = true;
    }

    if (dirty) {
      this.triggerOnChange();
    }

    if (controlsDirty) {
      this.view.dispatch(
        state.tr.setMeta(stateKey, {
          set: tableActive ? createControlsDecorationSet(this.view) : null,
        }),
      );
    }
  }

  setView(view: EditorView): void {
    this.view = view;
  }

  closeFloatingToolbar(): void {
    const { state, dispatch } = this.view;
    clearSelection(state, dispatch);
    this.triggerOnChange();
  }

  isRequiredToAddHeader = (): boolean => this.isHeaderRowRequired;

  addHeaderToTableNodes = (slice: PmNode, selectionStart: number): void => {
    const { table } = this.view.state.schema.nodes;
    slice.content.forEach((node: PmNode, offset: number) => {
      if (node.type === table && !containsTableHeader(this.view.state, node)) {
        const { state, dispatch } = this.view;
        const { tr, doc } = state;
        const $anchor = doc.resolve(selectionStart + offset);
        dispatch(tr.setSelection(new TextSelection($anchor)));
        this.convertFirstRowToHeader();
      }
    });
  };

  private triggerOnChange(): void {
    this.changeHandlers.forEach(cb => cb(this));
  }

  // we keep track of selection changes because
  // 1) we want to mark toolbar buttons as active when the whole row/col is selected
  // 2) we want to drop selection if editor looses focus
  private updateSelection(): boolean {
    const { state, dispatch } = this.view;
    const cellSelection = getCellSelection(state);

    if (cellSelection) {
      if (cellSelection !== this.cellSelection) {
        this.cellSelection = cellSelection;
        return true;
      }
      // drop selection if editor looses focus
      if (!this.editorFocused) {
        clearSelection(state, dispatch);
        return true;
      }
    } else if (this.cellSelection) {
      this.cellSelection = undefined;
      return true;
    }

    return false;
  }

  private focusEditor(): void {
    if (!this.view.hasFocus()) {
      this.view.focus();
    }
  }

  private moveCursorInsideTableTo(pos: number): void {
    this.focusEditor();
    const { tr } = this.view.state;
    tr.setSelection(Selection.near(tr.doc.resolve(pos)));
    this.view.dispatch(tr);
  }

  private moveCursorTo(pos: number): void {
    const offset = tableStartPos(this.view.state);
    if (offset) {
      this.moveCursorInsideTableTo(pos + offset);
    }
  }
}

export const stateKey = new PluginKey('tablePlugin');

export const plugin = (pluginConfig?: PluginConfig) =>
  new Plugin({
    state: {
      init(config, state: EditorState) {
        return new TableState(state, pluginConfig);
      },
      apply(tr, state) {
        const meta = tr.getMeta(stateKey);

        if (meta) {
          state.set = meta.set || DecorationSet.empty;
          return state;
        }

        return state;
      },
    },
    key: stateKey,
    view: (editorView: EditorView) => {
      const pluginState: TableState = stateKey.getState(editorView.state);
      pluginState.setView(editorView);

      return {
        update: (view: EditorView, prevState: EditorState) => {
          pluginState.update();
        },
      };
    },
    props: {
      decorations: (state: EditorState) => stateKey.getState(state).set,

      nodeViews: {
        table: (node: PmNode, view: EditorView) => {
          const { allowColumnResizing } = stateKey.getState(view.state);
          return new TableNode({ node, view, allowColumnResizing });
        },
      },
      handleClick(view: EditorView, pos: number, event) {
        resetHoverSelection(view.state, view.dispatch);
        return false;
      },
      handleDOMEvents: {
        focus(view: EditorView, event) {
          const pluginState: TableState = stateKey.getState(view.state);
          pluginState.updateEditorFocused(true);
          pluginState.update(true);
          return false;
        },
        click(view: EditorView, event) {
          const element = event.target as HTMLElement;
          const { tableNode }: TableState = stateKey.getState(view.state);

          /**
           * Check if the table cell with an image is clicked
           * and its not the image itself
           */
          const matches = element.matches ? 'matches' : 'msMatchesSelector';
          if (
            !tableNode ||
            !isElementInTableCell(element) ||
            element[matches]('table .image, table p, table .image div')
          ) {
            return false;
          }
          const offset = tableStartPos(view.state);
          const map = TableMap.get(tableNode);

          /** Getting the offset of current item clicked */
          const colElement = (closestElement(element, 'td') ||
            closestElement(element, 'th')) as HTMLTableDataCellElement;
          const colIndex = colElement && colElement.cellIndex;
          const rowElement = closestElement(
            element,
            'tr',
          ) as HTMLTableRowElement;
          const rowIndex = rowElement && rowElement.rowIndex;
          const cellIndex = map.width * rowIndex + colIndex;
          const posInTable = map.map[cellIndex + 1] - 1;

          const {
            dispatch,
            state: { tr, schema: { nodes: { paragraph } } },
          } = view;
          const editorElement = tableNode.nodeAt(map.map[cellIndex]) as PmNode;

          /** Only if the last item is media group, insert a paragraph */
          if (isLastItemMediaGroup(editorElement)) {
            tr.insert(posInTable + offset, paragraph.create());
            dispatch(tr);
            setNodeSelection(view, posInTable + offset);
          }
          return true;
        },
        blur(view: EditorView, event) {
          const pluginState: TableState = stateKey.getState(view.state);
          pluginState.updateEditorFocused(false);
          pluginState.update(true);
          resetHoverSelection(view.state, view.dispatch);
          return false;
        },
      },
    },
  });
