import { Node as PmNode } from 'prosemirror-model';
import { Transaction } from 'prosemirror-state';
import { DecorationSet } from 'prosemirror-view';
import { TableLayout, TableSharedCssClassName } from '@atlaskit/editor-common';

export type PermittedLayoutsDescriptor = TableLayout[] | 'all';
export type Cell = { pos: number; start: number; node: PmNode };
export type CellTransform = (cell: Cell) => (tr: Transaction) => Transaction;

export interface PluginConfig {
  advanced?: boolean;
  allowBackgroundColor?: boolean;
  allowColumnResizing?: boolean;
  allowHeaderColumn?: boolean;
  allowHeaderRow?: boolean;
  allowMergeCells?: boolean;
  allowNumberColumn?: boolean;
  isHeaderRowRequired?: boolean;
  stickToolbarToBottom?: boolean;
  permittedLayouts?: PermittedLayoutsDescriptor;
  allowControls?: boolean;
  // This flag can specifiy re-size mode.
  UNSAFE_allowFlexiColumnResizing?: boolean;
}

export interface TablePluginState {
  dangerColumns: number[];
  dangerRows: number[];
  decorationSet: DecorationSet;
  pluginConfig: PluginConfig;
  editorHasFocus?: boolean;
  // context menu button is positioned relatively to this DOM node.
  targetCellRef?: HTMLElement;
  targetCellPosition?: number;
  // controls need to be re-rendered when table content changes
  // e.g. when pressing enter inside of a cell, it creates a new p and we need to update row controls
  tableNode?: PmNode;
  tableRef?: HTMLElement;
  tableFloatingToolbarTarget?: HTMLElement;
  isContextualMenuOpen?: boolean;
  isTableHovered?: boolean;
  isTableInDanger?: boolean;
  insertLineIndex?: number;
}

export interface CellRect {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export interface ColumnResizingPlugin {
  handleWidth?: number;
  cellMinWidth?: number;
  lastColumnResizable?: boolean;
}

export const TableDecorations = {
  CONTROLS_HOVER: 'CONTROLS_HOVER',
  COLUMN_INSERT_LINE: 'COLUMN_INSERT_LINE',
  ROW_INSERT_LINE: 'ROW_INSERT_LINE',
};
const clPrefix = 'pm-table-';

export const TableCssClassName = {
  ...TableSharedCssClassName,

  COLUMN_CONTROLS_WRAPPER: `${clPrefix}column-controls-wrapper`,
  COLUMN_CONTROLS: `${clPrefix}column-controls`,
  COLUMN_CONTROLS_INNER: `${clPrefix}column-controls__inner`,
  COLUMN_CONTROLS_BUTTON_WRAP: `${clPrefix}column-controls__button-wrap`,
  COLUMN_INSERT_LINE: `${clPrefix}column__insert-line`,

  ROW_CONTROLS_WRAPPER: `${clPrefix}row-controls-wrapper`,
  ROW_CONTROLS: `${clPrefix}row-controls`,
  ROW_CONTROLS_INNER: `${clPrefix}row-controls__inner`,
  ROW_CONTROLS_BUTTON_WRAP: `${clPrefix}row-controls__button-wrap`,
  ROW_INSERT_LINE: `${clPrefix}row__insert-line`,
  ROW_INSERT_LINE_OVERLAY: `${clPrefix}row__insert-line-overlay`,

  CONTROLS_BUTTON: `${clPrefix}controls__button`,
  CONTROLS_BUTTON_ICON: `${clPrefix}controls__button-icon`,

  CONTROLS_INSERT_BUTTON: `${clPrefix}controls__insert-button`,
  CONTROLS_INSERT_BUTTON_INNER: `${clPrefix}controls__insert-button-inner`,
  CONTROLS_INSERT_BUTTON_WRAP: `${clPrefix}controls__insert-button-wrap`,

  CONTROLS_INSERT_MARKER: `${clPrefix}controls__insert-marker`,
  CONTROLS_INSERT_COLUMN: `${clPrefix}controls__insert-column`,
  CONTROLS_INSERT_ROW: `${clPrefix}controls__insert-row`,
  CONTROLS_DELETE_BUTTON_WRAP: `${clPrefix}controls__delete-button-wrap`,
  CONTROLS_DELETE_BUTTON: `${clPrefix}controls__delete-button`,

  CORNER_CONTROLS: `${clPrefix}corner-controls`,
  CONTROLS_CORNER_BUTTON: `${clPrefix}corner-button`,

  NUMBERED_COLUMN: `${clPrefix}numbered-column`,
  NUMBERED_COLUMN_BUTTON: `${clPrefix}numbered-column__button`,

  HOVERED_CELL: `${clPrefix}hovered-cell`,
  HOVERED_TABLE: `${clPrefix}hovered-table`,
  RESIZING: `${clPrefix}resizing`,
  TABLE_SHADOW: `${clPrefix}shadow`,
  WITH_CONTROLS: `${clPrefix}with-controls`,

  CONTEXTUAL_SUBMENU: `${clPrefix}contextual-submenu`,
  CONTEXTUAL_MENU_TRIGGER: `${clPrefix}contextual-menu-trigger`,
  CONTEXTUAL_MENU_ICON: `${clPrefix}contextual-submenu-icon`,

  // come from prosemirror-table
  COLUMN_RESIZE_HANDLE: 'column-resize-handle',
  SELECTED_CELL: 'selectedCell',
};
