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

    return Decoration.node(cell.pos - 1, cell.pos + cell.node.nodeSize - 1, {
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
  const { pos: start } = findTable(editorView.state.selection)!;
  const before = start - 1;

  return DecorationSet.create(editorView.state.doc, [
    Decoration.node(before, before + tableNode.nodeSize, {
      class: `with-controls`,
    }),
  ]);
};
