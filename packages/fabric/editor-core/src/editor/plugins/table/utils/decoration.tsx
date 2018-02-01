import { EditorState } from 'prosemirror-state';
import { Node as PmNode } from 'prosemirror-model';
import { TableMap } from 'prosemirror-tables';
import { Decoration, DecorationSet, EditorView } from 'prosemirror-view';
import { tableStartPos } from './position';
import { stateKey as tablePluginKey } from '../../../../plugins/table';

export const createHoverDecorationSet = (
  from: number,
  to: number,
  tableNode: PmNode,
  state: EditorState,
): DecorationSet => {
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
      return Decoration.node(cell.pos, cell.pos + cell.node.nodeSize, {
        class: 'hoveredCell',
      });
    });

  return DecorationSet.create(state.doc, deco);
};

export const createControlsDecorationSet = (
  editorView: EditorView,
): DecorationSet => {
  const pluginState = tablePluginKey.getState(editorView.state);
  const { tableNode } = pluginState;
  const before = tableStartPos(editorView.state) - 1;

  return DecorationSet.create(editorView.state.doc, [
    Decoration.node(before, before + tableNode.nodeSize, {
      class: `with-controls last-update-${new Date().valueOf()}`,
    }),
  ]);
};
