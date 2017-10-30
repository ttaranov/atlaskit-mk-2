import { Node, Slice } from 'prosemirror-model';
import { EditorState, Plugin, PluginKey, Selection, TextSelection } from 'prosemirror-state';
import {
  addColumnAfter,
  addColumnBefore,
  addRowAfter,
  addRowBefore,
  CellSelection,
  deleteTable,
  deleteColumn,
  deleteRow,
  tableEditing,
  TableMap,
  toggleHeaderRow,

} from 'prosemirror-tables';
import { Decoration, DecorationSet, EditorView } from 'prosemirror-view';

import keymapHandler from './keymap';
import {
  getColumnPos,
  getRowPos,
  getTablePos,
  getSelectedColumn,
  getSelectedRow,
  containsTableHeader,
  createControlsDecoration,
  createHoverDecoration
} from './utils';
import { analyticsService } from '../../analytics';

export type TableStateSubscriber = (state: TableState) => any;

export interface HoveredCell {
  pos: number;
  node: Node;
}

export interface PluginConfig {
  isHeaderRowRequired?: boolean;
}

export class TableState {
  keymapHandler: Function;
  cellElement?: HTMLElement;
  tableElement?: HTMLElement;
  editorFocused: boolean = false;
  tableNode?: Node;
  cellSelection?: CellSelection;
  tableHidden: boolean = false;
  tableDisabled: boolean = false;
  tableActive: boolean = false;
  domEvent: boolean = false;
  decorations: DecorationSet;
  hoveredCells: HoveredCell[];

  private view: EditorView;
  private hoverDecoration?: Decoration[];
  private controlsDecoration?: Decoration[];
  private isHeaderRowRequired: boolean = false;
  private changeHandlers: TableStateSubscriber[] = [];

  constructor(state: EditorState, pluginConfig: PluginConfig = {}) {
    this.changeHandlers = [];

    const { table, tableCell, tableRow, tableHeader } = state.schema.nodes;
    this.tableHidden = !table || !tableCell || !tableRow || !tableHeader;
    this.isHeaderRowRequired = pluginConfig.isHeaderRowRequired || false;
    this.decorations = DecorationSet.create(state.doc, []);
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
        const nextPos = TableMap.get(this.tableNode).positionAt(0, column, this.tableNode);
        this.moveCursorTo(nextPos);
      } else {
        const pos = map.positionAt(0, column, this.tableNode);
        this.moveCursorTo(pos);
        addColumnBefore(this.view.state, dispatch);
        this.moveCursorTo(pos);
      }

      analyticsService.trackEvent('atlassian.editor.format.table.column.button');
    }
  }

  insertRow = (row: number): void => {
    if (this.tableNode) {
      const map = TableMap.get(this.tableNode);
      const { dispatch } = this.view;

      // last row
      if (row === map.height) {
        const prevRowPos =  map.positionAt(row - 1, 0, this.tableNode);
        this.moveCursorTo(prevRowPos);
        addRowAfter(this.view.state, dispatch);
        const nextPos = TableMap.get(this.tableNode).positionAt(row, 0, this.tableNode);
        this.moveCursorTo(nextPos);
      } else {
        const pos = map.positionAt(row, 0, this.tableNode);
        this.moveCursorTo(pos);
        addRowBefore(this.view.state, dispatch);
        this.moveCursorTo(pos);
      }

      analyticsService.trackEvent('atlassian.editor.format.table.row.button');
    }
  }

  remove = (): void => {
    if (!this.cellSelection) {
      return;
    }
    const { state, dispatch } = this.view;
    const isRowSelected = this.cellSelection.isRowSelection();
    const isColumnSelected = this.cellSelection.isColSelection();

    // the whole table
    if (isRowSelected && isColumnSelected) {
      deleteTable(state, dispatch);
      this.focusEditor();
      analyticsService.trackEvent('atlassian.editor.format.table.delete.button');
    } else if (isColumnSelected) {
      analyticsService.trackEvent('atlassian.editor.format.table.delete_column.button');

      // move the cursor in the column to the left of the deleted column(s)
      const map = TableMap.get(this.tableNode!);
      const { anchor, head } = getSelectedColumn(this.view.state, map);
      const column = Math.min(anchor, head);
      const nextPos =  map.positionAt(0, column > 0 ? column - 1 : 0, this.tableNode!);
      deleteColumn(state, dispatch);
      this.moveCursorTo(nextPos);
    } else if (isRowSelected) {
      const { tableHeader } = this.view.state.schema.nodes;
      const cell = this.getCurrentCell();
      const event = cell && cell.type === tableHeader ? 'delete_header_row' : 'delete_row';
      analyticsService.trackEvent(`atlassian.editor.format.table.${event}.button`);
      const headerRowSelected = this.isHeaderRowSelected();
      // move the cursor to the beginning of the next row, or prev row if deleted row was the last row
      const { anchor, head } = getSelectedRow(this.view.state);
      const map = TableMap.get(this.tableNode!);
      const minRow = Math.min(anchor, head);
      const maxRow = Math.max(anchor, head);
      const isRemovingLastRow = maxRow === (map.height - 1);
      deleteRow(state, dispatch);
      if (headerRowSelected && this.isHeaderRowRequired) {
        this.convertFirstRowToHeader();
      }
      const nextPos =  map.positionAt(isRemovingLastRow ? minRow - 1 : minRow, 0, this.tableNode!);
      this.moveCursorTo(nextPos);
    } else {
      // replace selected cells with empty cells
      this.emptySelectedCells();
      this.moveCursorInsideTableTo(state.selection.from);
      analyticsService.trackEvent('atlassian.editor.format.table.delete_content.button');
    }
  }

  convertFirstRowToHeader = () => {
    this.selectRow(0);
    const { state, dispatch } = this.view;
    toggleHeaderRow(state, dispatch);
  }

  subscribe(cb: TableStateSubscriber): void {
    this.changeHandlers.push(cb);
    cb(this);
  }

  unsubscribe(cb: TableStateSubscriber): void {
    this.changeHandlers = this.changeHandlers.filter(ch => ch !== cb);
  }

  updateEditorFocused(editorFocused: boolean): void {
    this.editorFocused = editorFocused;
  }

  selectColumn = (column: number): void => {
    if (this.tableNode) {
      const {from, to} = getColumnPos(column, this.tableNode);
      this.createCellSelection(from, to);
    }
  }

  selectRow = (row: number): void => {
    if (this.tableNode) {
      const {from, to} = getRowPos(row, this.tableNode);
      this.createCellSelection(from, to);
    }
  }

  selectTable = (): void => {
    if (this.tableNode) {
      const {from, to} = getTablePos(this.tableNode);
      this.createCellSelection(from, to);
    }
  }

  hoverColumn = (column: number): void => {
    if (this.tableNode) {
      const {from, to} = getColumnPos(column, this.tableNode);
      this.createHoverSelection(from, to);
    }
  }

  hoverRow = (row: number): void => {
    if (this.tableNode) {
      const {from, to} = getRowPos(row, this.tableNode);
      this.createHoverSelection(from, to);
    }
  }

  hoverTable = () => {
    if (this.tableNode) {
      const {from, to} = getTablePos(this.tableNode);
      this.createHoverSelection(from, to);
    }
  }

  resetHoverSelection = () => {
    if (this.hoverDecoration) {
      this.decorations = this.decorations.remove(this.hoverDecoration);
      this.hoverDecoration = undefined;
      this.hoveredCells = [];
      this.view.dispatch(this.view.state.tr);
    }
  }

  isColumnSelected = (column: number): boolean => {
    if (this.tableNode && this.cellSelection) {
      const map = TableMap.get(this.tableNode);
      const start = this.cellSelection.$anchorCell.start(-1);
      const anchor = map.colCount(this.cellSelection.$anchorCell.pos - start);
      const head = map.colCount(this.cellSelection.$headCell.pos - start);
      return (
        this.cellSelection.isColSelection() &&
        (column <= Math.max(anchor, head) && column >= Math.min(anchor, head))
      );
    }
    return false;
  }

  isRowSelected = (row: number): boolean => {
    if (this.cellSelection) {
      const anchor = this.cellSelection.$anchorCell.index(-1);
      const head = this.cellSelection.$headCell.index(-1);
      return (
        this.cellSelection.isRowSelection() &&
        (row <= Math.max(anchor, head) && row >= Math.min(anchor, head))
      );
    }
    return false;
  }

  isHeaderRowSelected = (): boolean => {
    if (this.cellSelection && this.cellSelection.isRowSelection()) {
      const { $from } = this.view.state.selection;
      const { tableHeader } = this.view.state.schema.nodes;
      for (let i = $from.depth; i > 0; i--) {
        const node = $from.node(i);
        if(node.type === tableHeader) {
          return true;
        }
      }
    }
    return false;
  }

  isTableSelected = (): boolean => {
    if (this.cellSelection) {
      return this.cellSelection.isColSelection() && this.cellSelection.isRowSelection();
    }
    return false;
  }

  update(docView: any, domEvent: boolean = false) {
    let dirty = this.updateSelection();
    let controlsDirty = dirty;
    const { cellSelection } = this;

    const tableElement = this.getTableElement(docView);
    if (domEvent && tableElement || tableElement !== this.tableElement) {
      this.tableElement = tableElement;
      this.domEvent = domEvent;
      dirty = true;
    }

    const tableNode = this.getTableNode();
    if (tableNode !== this.tableNode) {
      this.tableNode = tableNode;
      dirty = true;
      controlsDirty = true;
    }

    // show floating toolbar only when the whole row, column or table is selected
    const toolbarVisible = (
      cellSelection && (cellSelection.isColSelection() || cellSelection.isRowSelection())
        ? true
        : false
    );

    const cellElement = toolbarVisible ? this.getFirstSelectedCellElement(docView) : undefined;
    if (cellElement !== this.cellElement) {
      this.cellElement = cellElement;
      dirty = true;
    }

    const tableActive = this.editorFocused && !!tableElement;
    if (tableActive !== this.tableActive) {
      this.tableActive = tableActive;
      dirty = true;
      controlsDirty = true;
    }

    const tableDisabled = !this.canInsertTable();
    if (tableDisabled !== this.tableDisabled) {
      this.tableDisabled = tableDisabled;
      dirty = true;
    }

    if (dirty) {
      this.triggerOnChange();
    }

    if (controlsDirty) {
      if (this.controlsDecoration) {
        this.decorations = this.decorations.remove(this.controlsDecoration);
        this.controlsDecoration = undefined;
      }

      if (tableActive) {
        const decoration = createControlsDecoration(this, this.view);
        this.controlsDecoration = [...decoration];
        this.decorations = this.decorations.add(this.view.state.doc, decoration);
      }
      this.view.dispatch(this.view.state.tr);
    }
  }

  setView(view: EditorView): void {
    this.view = view;
  }

  tableStartPos(): number | undefined {
    const { $from } = this.view.state.selection;
    for (let i = $from.depth; i > 0; i--) {
      const node = $from.node(i);
      if(node.type === this.view.state.schema.nodes.table) {
        return $from.start(i);
      }
    }
  }

  closeFloatingToolbar (): void {
    this.clearSelection();
    this.triggerOnChange();
  }

  getCurrentCellStartPos(): number | undefined {
    const { $from } = this.view.state.selection;
    const { tableCell, tableHeader } = this.view.state.schema.nodes;
    for (let i = $from.depth; i > 0; i--) {
      const node = $from.node(i);
      if(node.type === tableCell || node.type === tableHeader) {
        return $from.start(i);
      }
    }
  }

  isRequiredToAddHeader = (): boolean => this.isHeaderRowRequired;

  addHeaderToTableNodes = (slice: Node, selectionStart: number): void => {
    const { table } = this.view.state.schema.nodes;
    slice.content.forEach((node: Node, offset: number) => {
      if (node.type === table && !containsTableHeader(this.view, node)) {
        const { state, dispatch } = this.view;
        const { tr, doc } = state;
        const $anchor = doc.resolve(selectionStart + offset);
        dispatch(tr.setSelection(new TextSelection($anchor)));
        this.convertFirstRowToHeader();
      }
    });
  }

  private getCurrentCell(): Node | undefined {
    const { $from } = this.view.state.selection;
    const { tableCell, tableHeader } = this.view.state.schema.nodes;
    for (let i = $from.depth; i > 0; i--) {
      const node = $from.node(i);
      if(node.type === tableCell || node.type === tableHeader) {
        return node;
      }
    }
  }

  private createHoverSelection (from: number, to: number): void {
    if (!this.tableNode || this.hoverDecoration) {
      return;
    }
    const offset = this.tableStartPos();
    if (offset) {
      const { state } = this.view;
      const map = TableMap.get(this.tableNode);
      const cells = map.cellsInRect(map.rectBetween(from, to));

      this.hoveredCells = cells.map(cellPos => {
        const pos = cellPos + offset;
        const node = state.doc.nodeAt(pos)!;
        return {pos, node};
      });
      const decoration: Decoration[] = createHoverDecoration(this.hoveredCells);

      // keeping track of decorations in order to remove them later
      // cloning, because ProseMirror mutates decorations after the transaction is dispathed (Waat?)
      this.hoverDecoration = [...decoration];
      this.decorations = this.decorations.add(state.doc, decoration);
      // trigger state change to be able to pick it up in the decorations handler
      this.view.dispatch(state.tr);
    }
  }

  private getTableElement(docView: any): HTMLElement | undefined {
    const offset = this.tableStartPos();
    if (offset) {
      const { node } = docView.domFromPos(offset);
      if (node) {
        return node.parentNode as HTMLElement;
      }
    }
  }

  private getFirstSelectedCellElement(docView: any): HTMLElement | undefined {
    const offset = this.firstSelectedCellStartPos();
    if (offset) {
      const { node } = docView.domFromPos(offset);
      if (node) {
        return node as HTMLElement;
      }
    }
  }

  private firstSelectedCellStartPos(): number | undefined {
    if (!this.tableNode) {
      return;
    }
    const offset = this.tableStartPos();
    if (offset) {
      const { state } = this.view;
      const { $anchorCell, $headCell } = (state.selection as any) as CellSelection;
      const { tableCell, tableHeader } = state.schema.nodes;
      const map = TableMap.get(this.tableNode);
      const start =  $anchorCell.start(-1);
      // array of selected cells positions
      const cells = map.cellsInRect(map.rectBetween($anchorCell.pos - start, $headCell.pos - start));
      // first selected cell position
      const firstCellPos = cells[0] + offset + 1;
      const $from = state.doc.resolve(firstCellPos);
      for (let i = $from.depth; i > 0; i--) {
        const node = $from.node(i);
        if(node.type === tableCell || node.type === tableHeader) {
          return $from.start(i);
        }
      }
    }
  }

  private getTableNode(): Node | undefined {
    const { $from } = this.view.state.selection;
    for (let i = $from.depth; i > 0; i--) {
      const node = $from.node(i);
      if(node.type === this.view.state.schema.nodes.table) {
        return node;
      }
    }
  }

  private triggerOnChange(): void {
    this.changeHandlers.forEach(cb => cb(this));
  }

  private createCellSelection (from: number, to: number): void {
    const { state } = this.view;
    // here "from" and "to" params are table-relative positions, therefore we add table offset
    const offset = this.tableStartPos();
    if (offset) {
      const $anchor = state.doc.resolve(from + offset);
      const $head = state.doc.resolve(to + offset);
      this.view.dispatch(
        this.view.state.tr.setSelection(new (CellSelection as any)($anchor, $head))
      );
    }
  }

  // we keep track of selection changes because
  // 1) we want to mark toolbar buttons as active when the whole row/col is selected
  // 2) we want to drop selection if editor looses focus
  private updateSelection (): boolean {
    const { selection } = this.view.state;
    let dirty = false;

    if (selection instanceof CellSelection) {
      if (selection !== this.cellSelection) {
        this.cellSelection = selection;
        dirty = true;
      }
      // drop selection if editor looses focus
      if (!this.editorFocused) {
        this.clearSelection();
      }
    } else if (this.cellSelection) {
      this.cellSelection = undefined;
      dirty = true;
    }
    return dirty;
  }

  private clearSelection () {
    const { state } = this.view;
    this.cellElement = undefined;
    this.view.dispatch(state.tr.setSelection(Selection.near(state.selection.$from)));
  }

  private canInsertTable (): boolean {
    const { state } = this.view;
    const { $from, to } = state.selection;
    const { code } = state.schema.marks;
    for (let i = $from.depth; i > 0; i--) {
      const node = $from.node(i);
      // inline code and codeBlock are excluded
      if(node.type === state.schema.nodes.codeBlock || (code && state.doc.rangeHasMark($from.pos, to, code))) {
        return false;
      }
    }
    return true;
  }

  private emptySelectedCells (): void {
    if (!this.cellSelection) {
      return;
    }

    const { tr, schema } = this.view.state;
    const emptyCell = schema.nodes.tableCell.createAndFill()!.content;
    this.cellSelection.forEachCell((cell, pos) => {
      if (!cell.content.eq(emptyCell)) {
        const slice = new Slice(emptyCell, 0, 0);
        tr.replace(tr.mapping.map(pos + 1), tr.mapping.map(pos + cell.nodeSize - 1), slice);
      }
    });
    if (tr.docChanged) {
      this.view.dispatch(tr);
    }
  }

  private focusEditor (): void {
    if (!this.view.hasFocus()) {
      this.view.focus();
    }
  }

  private moveCursorInsideTableTo (pos: number): void {
    this.focusEditor();
    const { tr } = this.view.state;
    tr.setSelection(Selection.near(tr.doc.resolve(pos)));
    this.view.dispatch(tr);
  }

  private moveCursorTo (pos: number): void {
    const offset = this.tableStartPos();
    if (offset) {
      this.moveCursorInsideTableTo(pos + offset);
    }
  }
}

export const stateKey = new PluginKey('tablePlugin');

export const plugin = (pluginConfig?: PluginConfig) => new Plugin({
  state: {
    init(config, state: EditorState) {
      return new TableState(state, pluginConfig);
    },
    apply(tr, pluginState: TableState, oldState, newState) {
      return pluginState;
    }
  },
  key: stateKey,
  view: (editorView: EditorView & { docView?: any }) => {
    const pluginState: TableState = stateKey.getState(editorView.state);
    pluginState.setView(editorView);
    pluginState.keymapHandler = keymapHandler(pluginState);

    return {
      update: (view: EditorView & { docView?: any }, prevState: EditorState) => {
        pluginState.update(view.docView);
      }
    };
  },
  props: {
    decorations: (state: EditorState) => stateKey.getState(state).decorations,

    handleKeyDown(view, event) {
      return stateKey.getState(view.state).keymapHandler(view, event);
    },
    handleClick(view: EditorView, pos: number, event) {
      stateKey.getState(view.state).resetHoverSelection();
      return false;
    },
    onFocus(view: EditorView & { docView?: any }, event) {
      const pluginState: TableState = stateKey.getState(view.state);
      pluginState.updateEditorFocused(true);
      pluginState.update(view.docView, true);
    },
    onBlur(view: EditorView & { docView?: any }, event) {
      const pluginState: TableState = stateKey.getState(view.state);
      pluginState.updateEditorFocused(false);
      pluginState.update(view.docView, true);
      pluginState.resetHoverSelection();
    },
  }
});

const plugins = (pluginConfig?: PluginConfig) => {
  return [plugin(pluginConfig), tableEditing()].filter((plugin) => !!plugin) as Plugin[];
};

export default plugins;

// Disable inline table editing and resizing controls in Firefox
// https://github.com/ProseMirror/prosemirror/issues/432
setTimeout(() => {
  document.execCommand('enableObjectResizing', false, 'false');
  document.execCommand('enableInlineTableEditing', false, 'false');
});
