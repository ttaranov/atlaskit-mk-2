import { Node as PmNode } from 'prosemirror-model';
import { EditorState, Plugin, PluginKey, Selection } from 'prosemirror-state';
import {
  CellSelection,
  deleteTable,
  deleteColumn,
  deleteRow,
  TableMap,
  toggleHeaderRow,
} from 'prosemirror-tables';
import {
  findTable,
  findParentDomRefOfType,
  findParentNodeOfType,
  selectRow,
  hasParentNodeOfType,
} from 'prosemirror-utils';
import { EditorView, DecorationSet } from 'prosemirror-view';
import {
  isElementInTableCell,
  setNodeSelection,
  isLastItemMediaGroup,
  closestElement,
} from '../../../utils/';
import { Dispatch } from '../../../event-dispatcher';

import { analyticsService } from '../../../analytics';

import TableNode from '../nodeviews/table';

import { resetHoverSelection, clearSelection } from '../actions';

import {
  isHeaderRowSelected,
  getCellSelection,
  createControlsDecorationSet,
  getSelectedColumn,
  getSelectedRow,
  canInsertTable,
} from '../utils';

import { TableLayout } from '@atlaskit/editor-common';
import { EventDispatcher } from '../../../event-dispatcher';
import { PortalProviderAPI } from '../../../ui/PortalProvider';

export type PermittedLayoutsDescriptor = (TableLayout)[] | 'all';

export interface PluginConfig {
  isHeaderRowRequired?: boolean;
  allowColumnResizing?: boolean;
  allowMergeCells?: boolean;
  allowNumberColumn?: boolean;
  allowBackgroundColor?: boolean;
  allowHeaderRow?: boolean;
  allowHeaderColumn?: boolean;
  stickToolbarToBottom?: boolean;
  permittedLayouts?: PermittedLayoutsDescriptor;
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
  tableLayout?: TableLayout;
  view: EditorView;
  eventDispatcher: EventDispatcher | undefined;
  set: DecorationSet = DecorationSet.empty;
  allowColumnResizing: boolean = false;
  allowMergeCells: boolean = false;
  allowNumberColumn: boolean = false;
  allowBackgroundColor: boolean = false;
  allowHeaderRow: boolean = false;
  allowHeaderColumn: boolean = false;
  stickToolbarToBottom: boolean = false;
  permittedLayouts: PermittedLayoutsDescriptor;

  private isHeaderRowRequired: boolean = false;

  constructor(
    state: EditorState,
    eventDispatcher: EventDispatcher,
    pluginConfig: PluginConfig,
  ) {
    const { table, tableCell, tableRow, tableHeader } = state.schema.nodes;
    this.tableHidden = !table || !tableCell || !tableRow || !tableHeader;
    this.isHeaderRowRequired = !!pluginConfig.isHeaderRowRequired;
    this.allowColumnResizing = !!pluginConfig.allowColumnResizing;
    this.allowMergeCells = !!pluginConfig.allowMergeCells;
    this.allowNumberColumn = !!pluginConfig.allowNumberColumn;
    this.allowBackgroundColor = !!pluginConfig.allowBackgroundColor;
    this.allowHeaderRow = !!pluginConfig.allowHeaderRow;
    this.allowHeaderColumn = !!pluginConfig.allowHeaderColumn;
    this.stickToolbarToBottom = !!pluginConfig.stickToolbarToBottom;
    this.eventDispatcher = eventDispatcher;
    this.permittedLayouts = pluginConfig.permittedLayouts || [];
  }

  removeTable = (): void => {
    const { state, dispatch } = this.view;
    deleteTable(state, dispatch);
    this.focusEditor();
    analyticsService.trackEvent('atlassian.editor.format.table.delete.button');
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
      const { tableHeader, tableCell } = this.view.state.schema.nodes;
      const parent = findParentNodeOfType([tableHeader, tableCell])(
        this.view.state.selection,
      );
      const event =
        parent && parent.node.type === tableHeader
          ? 'delete_header_row'
          : 'delete_row';
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
    }
  };

  convertFirstRowToHeader = () => {
    const { state, dispatch } = this.view;
    dispatch(selectRow(0)(state.tr));
    toggleHeaderRow(state, dispatch);
  };

  updateEditorFocused(editorFocused: boolean): void {
    this.editorFocused = editorFocused;
  }

  update(): boolean {
    let controlsDirty = this.updateSelection();
    const { state } = this.view;
    const {
      schema: {
        nodes: { table },
      },
      selection,
    } = state;
    const domAtPos = this.view.domAtPos.bind(this.view);

    const parent = findParentDomRefOfType(table, domAtPos)(selection);
    const tableElement = parent ? parent.parentNode : undefined;
    if (tableElement !== this.tableElement) {
      this.tableElement = tableElement as HTMLElement;
    }

    const tableNode = findTable(state.selection);
    if (tableNode && tableNode.node !== this.tableNode) {
      this.tableNode = tableNode.node;
      controlsDirty = true;
    }

    const tableActive = this.editorFocused && !!tableElement;
    if (tableActive !== this.tableActive) {
      this.tableActive = tableActive;
      controlsDirty = true;
    }

    const tableDisabled = !canInsertTable(state);
    if (tableDisabled !== this.tableDisabled) {
      this.tableDisabled = tableDisabled;
    }

    if (tableNode) {
      const tableLayout = tableNode.node.attrs.layout;
      if (tableLayout !== this.tableLayout) {
        this.tableLayout = tableLayout;
        controlsDirty = true;
      }
    }

    if (controlsDirty) {
      this.view.dispatch(
        state.tr.setMeta(stateKey, {
          set: tableActive ? createControlsDecorationSet(this.view) : null,
        }),
      );
    }
    return controlsDirty;
  }

  setView(view: EditorView): void {
    this.view = view;
  }

  isRequiredToAddHeader = (): boolean => this.isHeaderRowRequired;

  setTableLayout = (layout: TableLayout): boolean => {
    const tableNode = findTable(this.view.state.selection);
    if (!tableNode) {
      return false;
    }

    const { schema, tr } = this.view.state;

    this.view.dispatch(
      tr.setNodeMarkup(tableNode.pos - 1, schema.nodes.table, {
        ...tableNode.node.attrs,
        layout,
      }),
    );

    this.tableLayout = layout;

    return true;
  };

  isLayoutSupported = () => {
    const { selection, schema } = this.view.state;
    return (
      !hasParentNodeOfType(schema.nodes.layoutSection)(selection) &&
      !hasParentNodeOfType(schema.nodes.bodiedExtension)(selection)
    );
  };

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
    const table = findTable(this.view.state.selection);
    if (table) {
      this.moveCursorInsideTableTo(pos + table.pos);
    }
  }
}

export const stateKey = new PluginKey('tablePlugin');

export const createPlugin = (
  dispatch: Dispatch,
  portalProviderAPI: PortalProviderAPI,
  eventDispatcher: EventDispatcher,
  pluginConfig: PluginConfig,
) =>
  new Plugin({
    state: {
      init(config, state: EditorState) {
        return new TableState(state, eventDispatcher, pluginConfig);
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
          const dirty = pluginState.update();
          if (dirty) {
            dispatch(stateKey, { ...pluginState });
          }
        },
      };
    },
    props: {
      decorations: (state: EditorState) => stateKey.getState(state).set,

      nodeViews: {
        table: (node: PmNode, view: EditorView, getPos: () => number) => {
          const { allowColumnResizing } = stateKey.getState(view.state);
          return new TableNode({
            node,
            view,
            allowColumnResizing,
            eventDispatcher,
            portalProviderAPI,
            getPos,
          });
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
          const dirty = pluginState.update();
          if (dirty) {
            dispatch(stateKey, { ...pluginState });
          }
          return false;
        },
        click(view: EditorView, event) {
          const element = event.target as HTMLElement;
          const table = findTable(view.state.selection)!;

          /**
           * Check if the table cell with an image is clicked
           * and its not the image itself
           */
          const matches = element.matches ? 'matches' : 'msMatchesSelector';
          if (
            !table ||
            !isElementInTableCell(element) ||
            element[matches]('table .image, table p, table .image div')
          ) {
            return false;
          }
          const map = TableMap.get(table.node);

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
            state: {
              tr,
              schema: {
                nodes: { paragraph },
              },
            },
          } = view;
          const editorElement = table.node.nodeAt(map.map[cellIndex]) as PmNode;

          /** Only if the last item is media group, insert a paragraph */
          if (isLastItemMediaGroup(editorElement)) {
            tr.insert(posInTable + table.pos, paragraph.create());
            dispatch(tr);
            setNodeSelection(view, posInTable + table.pos);
          }
          return true;
        },
        blur(view: EditorView, event) {
          const pluginState: TableState = stateKey.getState(view.state);
          pluginState.updateEditorFocused(false);
          const dirty = pluginState.update();
          if (dirty) {
            dispatch(stateKey, { ...pluginState });
          }
          resetHoverSelection(view.state, view.dispatch);
          return false;
        },
      },
    },
  });
