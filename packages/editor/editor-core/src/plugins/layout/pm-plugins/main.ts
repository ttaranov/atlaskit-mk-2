import { Slice, Node } from 'prosemirror-model';
import { PluginKey, Plugin, EditorState, Transaction } from 'prosemirror-state';
import { DecorationSet, Decoration } from 'prosemirror-view';
import { findParentNodeOfType } from 'prosemirror-utils';
import { isEmptyDocument } from '../../../utils';

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
        const insideRightEdgeOfLayoutSection = pos + node.nodeSize - 1;
        const thirdColumnPos =
          insideRightEdgeOfLayoutSection - thirdColumn.nodeSize;
        if (isEmptyDocument(thirdColumn)) {
          tr.replaceRange(
            // end pos of second column
            tr.mapping.map(thirdColumnPos - 1),
            tr.mapping.map(insideRightEdgeOfLayoutSection),
            Slice.empty,
          );
        } else {
          tr.replaceRange(
            // end pos of second column
            tr.mapping.map(thirdColumnPos - 1),
            // start pos of third column
            tr.mapping.map(thirdColumnPos + 1),
            Slice.empty,
          );
        }
      } else if (
        node.attrs.layoutType &&
        (node.attrs.layoutType as string).startsWith('three') &&
        node.childCount === 2
      ) {
        const insideRightEdgeOfLayoutSection = pos + node.nodeSize - 1;
        tr.replaceWith(
          tr.mapping.map(insideRightEdgeOfLayoutSection),
          tr.mapping.map(insideRightEdgeOfLayoutSection),
          state.schema.nodes.layoutColumn.createAndFill() as Node,
        );
      }
    }
  });
  return tr.docChanged ? tr : undefined;
}

export type LayoutState = {
  pos: number | null;
};

// TODO: Look at memoize-one-ing this fn
const getNodeDecoration = (pos: number, node: Node) => [
  Decoration.node(pos, pos + node.nodeSize, { class: 'selected' }),
];

export const pluginKey = new PluginKey('layout');
export default new Plugin({
  key: pluginKey,
  state: {
    init: (_, state): LayoutState => {
      const maybeLayoutSection = findParentNodeOfType(
        state.schema.nodes.layoutSection,
      )(state.selection);
      return maybeLayoutSection
        ? { pos: maybeLayoutSection.pos }
        : { pos: null };
    },
    apply: (tr, pluginState, oldState, newState) => {
      if (tr.docChanged || tr.selectionSet) {
        const maybeLayoutSection = findParentNodeOfType(
          newState.schema.nodes.layoutSection,
        )(newState.selection);
        return maybeLayoutSection
          ? { pos: maybeLayoutSection.pos }
          : { pos: null };
      }
      return pluginState;
    },
  },
  props: {
    decorations(state) {
      const layoutState = pluginKey.getState(state) as LayoutState;
      if (layoutState.pos !== null) {
        return DecorationSet.create(
          state.doc,
          getNodeDecoration(layoutState.pos, state.doc.nodeAt(
            layoutState.pos,
          ) as Node),
        );
      }
      return undefined;
    },
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
});
