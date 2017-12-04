import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { EditorState } from 'prosemirror-state';
import { Node as PmNode } from 'prosemirror-model';
import { TableMap } from 'prosemirror-tables';
import { Decoration, DecorationSet, EditorView } from 'prosemirror-view';
import { tableStartPos } from './position';
import TableFloatingControls from '../../../../ui/TableFloatingControls';
import { stateKey as tablePluginKey } from '../../../../plugins/table';

import {
  hoverColumn,
  hoverTable,
  hoverRow,
  resetHoverSelection,
  selectTable,
  selectColumn,
  selectRow
} from '../actions';

import {
  isTableSelected,
  isColumnSelected,
  isRowSelected
} from '../utils';

export const createHoverDecorationSet = (from: number, to: number, tableNode: PmNode, state: EditorState): DecorationSet => {
  const map = TableMap.get(tableNode);
  const offset = tableStartPos(state);

  const deco = map
    .cellsInRect(map.rectBetween(from, to))
    .map(cellPos => {
      const pos = cellPos + offset;
      const node = state.doc.nodeAt(pos)!;
      return { pos, node };
    })
    .map(cell => {
      return Decoration.node(cell.pos, cell.pos + cell.node.nodeSize, { class: 'hoveredCell' });
    });

    return DecorationSet.create(state.doc, deco);
};

export const createControlsDecoration = (editorView: EditorView): Decoration[] => {
  const pluginState = tablePluginKey.getState(editorView.state);
  const pos = tableStartPos(editorView.state);
  const node = document.createElement('div');
  node.className = 'table-decoration';

  ReactDOM.render(
    <TableFloatingControls
      editorView={editorView}
      pluginState={pluginState}
      hoverTable={hoverTable}
      hoverRow={hoverRow}
      hoverColumn={hoverColumn}
      resetHoverSelection={resetHoverSelection}
      selectTable={selectTable}
      selectColumn={selectColumn}
      selectRow={selectRow}
      isTableSelected={isTableSelected}
      isColumnSelected={isColumnSelected}
      isRowSelected={isRowSelected}
    />
  , node);

  return [ Decoration.widget(pos, node) ];
};
