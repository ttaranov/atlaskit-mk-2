import { EditorState, Transaction, Plugin, PluginKey } from 'prosemirror-state';
import { findParentNodeOfType } from 'prosemirror-utils';
import { isWrappingPossible } from '../utils';
import { Dispatch } from '../../../event-dispatcher';
import { EditorView } from 'prosemirror-view';
import { removeAlignment } from '../../alignment/utils';

export const pluginKey = new PluginKey('listsPlugin');

export interface ListsPluginState {
  bulletListActive: boolean;
  bulletListDisabled: boolean;
  orderedListActive: boolean;
  orderedListDisabled: boolean;
}

export const createPlugin = (dispatch: Dispatch) =>
  new Plugin({
    state: {
      init: () => ({
        bulletListActive: false,
        bulletListDisabled: false,
        orderedListActive: false,
        orderedListDisabled: false,
      }),

      apply(
        tr: Transaction,
        pluginState: ListsPluginState,
        _,
        state: EditorState,
      ) {
        const { bulletList, orderedList } = state.schema.nodes;
        const listParent = findParentNodeOfType([bulletList, orderedList])(
          tr.selection,
        );

        const bulletListActive =
          !!listParent && listParent.node.type === bulletList;
        const orderedListActive =
          !!listParent && listParent.node.type === orderedList;
        const bulletListDisabled = !(
          bulletListActive ||
          orderedListActive ||
          isWrappingPossible(bulletList, state)
        );
        const orderedListDisabled = !(
          bulletListActive ||
          orderedListActive ||
          isWrappingPossible(orderedList, state)
        );

        if (
          bulletListActive !== pluginState.bulletListActive ||
          orderedListActive !== pluginState.orderedListActive ||
          bulletListDisabled !== pluginState.bulletListDisabled ||
          orderedListDisabled !== pluginState.orderedListDisabled
        ) {
          const nextPluginState = {
            ...pluginState,
            bulletListActive,
            orderedListActive,
            bulletListDisabled,
            orderedListDisabled,
          };
          dispatch(pluginKey, nextPluginState);
          return nextPluginState;
        }

        return pluginState;
      },
    },
    view: editorView => {
      return {
        update: (view: EditorView) => {
          const { bulletList, orderedList } = view.state.schema.nodes;
          const listParent = findParentNodeOfType([bulletList, orderedList])(
            view.state.tr.selection,
          );
          if (!listParent) {
            return;
          }

          /** Alignment if exists should be removed when toggled to list items */
          const removeAlign = removeAlignment(view.state);
          if (removeAlign) {
            view.dispatch(removeAlign);
          }
        },
      };
    },

    key: pluginKey,
  });
