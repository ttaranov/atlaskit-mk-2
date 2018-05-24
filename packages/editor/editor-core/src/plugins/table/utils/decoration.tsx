import { EditorState } from 'prosemirror-state';
import { Node as PmNode } from 'prosemirror-model';
import { TableMap } from 'prosemirror-tables';
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
      class: `with-controls last-update-${new Date().valueOf()}`,
    }),
  ]);
};

export const createNumberColumnDecorationSet = (
  state: EditorState,
): DecorationSet | null => {
  const table = findTable(state.selection);
  if (!table || !table.node.attrs.isNumberColumnEnabled) {
    return null;
  }
  const { pos: start } = findTable(state.selection)!;
  const map = TableMap.get(table.node);
  const set: Decoration[] = [];

  for (let i = 0, count = table.node.childCount; i < count; i++) {
    const cell = table.node.child(i).child(0);
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
