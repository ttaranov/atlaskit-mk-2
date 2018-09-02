import { Node as PmNode } from 'prosemirror-model';
import { Transaction } from 'prosemirror-state';
import { DecorationSet } from 'prosemirror-view';
import { TableLayout } from '@atlaskit/editor-common';

export type PermittedLayoutsDescriptor = TableLayout[] | 'all';
export type Cell = { pos: number; node: PmNode };
export type CellTransform = (cell: Cell) => (tr: Transaction) => Transaction;

export interface PluginConfig {
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
}

export interface TablePluginState {
  dangerColumns: number[];
  dangerRows: number[];
  hoverDecoration: DecorationSet;
  pluginConfig: PluginConfig;
  editorHasFocus?: boolean;
  // context menu button is positioned relatively to this DOM node.
  targetCellRef?: HTMLElement;
  targetCellPosition?: number;
  // controls need to be re-rendered when table content changes
  // e.g. when pressing enter inside of a cell, it creates a new p and we need to update row controls
  tableNode?: PmNode;
  tableRef?: HTMLElement;
  isContextualMenuOpen?: boolean;
  isTableHovered?: boolean;
  isTableInDanger?: boolean;
}

export interface CellRect {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export interface TableColumnTypesPluginState {
  // clicked cell needed to position cellType dropdowns (date, emoji, mention, link)
  clickedCell?: Cell;
  columnTypesDecoration: DecorationSet;
}
