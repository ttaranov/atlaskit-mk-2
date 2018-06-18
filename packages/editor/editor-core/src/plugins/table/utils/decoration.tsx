import { EditorState } from 'prosemirror-state';
import { Node as PmNode } from 'prosemirror-model';
import { Decoration, DecorationSet } from 'prosemirror-view';

export const createHoverDecorationSet = (
  cells: { pos: number; node: PmNode }[],
  state: EditorState,
  danger?: boolean,
): DecorationSet => {
  const deco = cells.map(cell => {
    const classes = ['hoveredCell'];
    if (danger) {
      classes.push('danger');
    }

    return Decoration.node(cell.pos, cell.pos + cell.node.nodeSize, {
      class: classes.join(' '),
    });
  });

  return DecorationSet.create(state.doc, deco);
};
