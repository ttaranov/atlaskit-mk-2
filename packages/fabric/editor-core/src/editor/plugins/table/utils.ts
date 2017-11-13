import { EditorState } from 'prosemirror-state';
import { Node as PmNode } from 'prosemirror-model';
import { TableMap } from 'prosemirror-tables';
import { Decoration, DecorationSet } from 'prosemirror-view';

export const tableStartPos = (state: EditorState): number => {
  const { $from } = state.selection;

  for (let i = $from.depth; i > 0; i--) {
    const node = $from.node(i);
    if(node.type === state.schema.nodes.table) {
      return $from.start(i);
    }
  }

  return 0;
};

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
