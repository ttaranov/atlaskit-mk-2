import { layoutSection, layoutColumn } from '@atlaskit/editor-common';
import { EditorPlugin } from '../../types';
import { Plugin, PluginKey, Transaction, EditorState } from 'prosemirror-state';
import { Node } from 'prosemirror-model';

export function enforceLayoutColumnConstraints(
  state: EditorState,
): Transaction | undefined {
  const tr = state.tr;
  state.doc.forEach((node, pos) => {
    if (node.type === state.schema.nodes.layoutSection) {
      if (
        node.attrs.layoutType &&
        (node.attrs.layoutType as string).startsWith('two') &&
        node.childCount === 3
      ) {
        const thirdColumn = node.content.child(2);
        tr.replaceWith(
          tr.mapping.map(
            pos +
            node.nodeSize /* Outside right edge of layoutSection*/ -
            1 /* Inside right edge of layoutSection */ -
            thirdColumn.nodeSize /* Outside right edge of second column */ -
              1 /* Inside right edge of second column */,
          ),
          tr.mapping.map(pos + node.nodeSize - 1),
          thirdColumn.content,
        );
      } else if (
        node.attrs.layoutType &&
        (node.attrs.layoutType as string).startsWith('three') &&
        node.childCount === 2
      ) {
        tr.replaceWith(
          tr.mapping.map(
            pos + node.nodeSize - 1,
          ) /* Inside right edge of layoutSection */,
          tr.mapping.map(pos + node.nodeSize - 1),
          state.schema.nodes.layoutColumn.createAndFill() as Node,
        );
      }
    }
  });
  return tr;
}

export const pluginKey = new PluginKey('layout');
const layoutPlugin: EditorPlugin = {
  nodes() {
    return [
      { rank: 2400, name: 'layoutSection', node: layoutSection },
      { rank: 2400, name: 'layoutColumn', node: layoutColumn },
    ];
  },

  pmPlugins() {
    return [
      {
        rank: 2400,
        plugin: () =>
          new Plugin({
            key: pluginKey,
            state: {
              init: () => ({}),
              apply: () => ({}),
            },
            appendTransaction(_, oldState, newState) {
              if (!oldState.doc.eq(newState.doc)) {
                const tr = enforceLayoutColumnConstraints(newState);
                if (tr) {
                  tr.setMeta('isLocal', true);
                  tr.setMeta('addToHistory', false);
                }
                return tr;
              }
            },
          }),
      },
    ];
  },
};

export default layoutPlugin;
