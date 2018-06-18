import { EditorState } from 'prosemirror-state';
import { Node as PmNode } from 'prosemirror-model';
import { findTable } from 'prosemirror-utils';
import { Decoration, DecorationSet, EditorView } from 'prosemirror-view';
import { stateKey as tablePluginKey } from '../pm-plugins/main';

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

export const createControlsDecorationSet = (
  editorView: EditorView,
): DecorationSet => {
  const pluginState = tablePluginKey.getState(editorView.state);
  const { tableNode } = pluginState;
  const { pos } = findTable(editorView.state.selection)!;

  return DecorationSet.create(editorView.state.doc, [
    Decoration.node(pos, pos + tableNode.nodeSize, {
      class: `with-controls`,
    }),
  ]);
};
