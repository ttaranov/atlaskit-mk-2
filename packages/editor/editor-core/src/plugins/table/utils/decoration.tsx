import { EditorState } from 'prosemirror-state';
import { Node as PmNode } from 'prosemirror-model';
import { TableMap } from 'prosemirror-tables';
import { Decoration, DecorationSet, EditorView } from 'prosemirror-view';
import { stateKey as tablePluginKey } from '../pm-plugins/main';
import { tableStartPos } from './position';
import { getTableNode } from './nodes';

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

export const createNumberColumnDecorationSet = (
  state: EditorState,
): DecorationSet | null => {
  const tableNode = getTableNode(state);
  if (!tableNode || !tableNode.attrs.isNumberColumnEnabled) {
    return null;
  }
  const start = tableStartPos(state);
  const map = TableMap.get(tableNode);
  const set: Decoration[] = [];

  for (let i = 0, count = tableNode.childCount; i < count; i++) {
    const cell = tableNode.child(i).child(0);
    if (cell.type === state.schema.nodes.tableHeader) {
      continue;
    }
    const from = start + map.map[i * map.width];

    set.push(
      Decoration.node(from, from + cell.nodeSize, {
        contentEditable: false,
      } as any),
    );
  }

  return DecorationSet.create(state.doc, set);
};
