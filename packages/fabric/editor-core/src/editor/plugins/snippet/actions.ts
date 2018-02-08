import { EditorState, Transaction, NodeSelection } from 'prosemirror-state';
import { pluginKey, PluginState } from './index';
import { Slice, Fragment } from 'prosemirror-model';

export const insertSnippet = (id: string) => (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
) => {
  const insertSnippetAt = (pluginKey.getState(state) as PluginState)
    .showSnippetPanelAt;
  if (insertSnippetAt) {
    const queryNode = insertSnippetAt && state.doc.nodeAt(insertSnippetAt);
    if (queryNode) {
      const selection = NodeSelection.create(state.doc, insertSnippetAt);
      dispatch(
        state.tr
          .replaceRange(
            selection.from,
            selection.to,
            Slice.maxOpen(
              Fragment.from([
                state.schema.nodes.snippet.createAndFill({ id })!,
                state.schema.text(' '),
              ]),
            ),
          )
          .setMeta(pluginKey, { showSnippetPanelAt: null })
          .setStoredMarks([]),
      );
    } else {
      return false;
    }
  } else {
    dispatch(
      state.tr
        .replaceSelectionWith(state.schema.nodes.snippet.createAndFill({ id })!)
        .setMeta(pluginKey, { showSnippetPanelAt: null })
        .setStoredMarks([]),
    );
    return true;
  }
};
