import { EditorState, Transaction, Plugin, PluginKey } from 'prosemirror-state';
import { findParentNodeOfType } from 'prosemirror-utils';
import { ProviderFactory } from '@atlaskit/editor-common';
import { isWrappingPossible } from '../utils';
import { Dispatch } from '../../../event-dispatcher';
import { listItemNodeView } from '../nodeviews/listItem';
import { PortalProviderAPI } from '../../../ui/PortalProvider';

export const pluginKey = new PluginKey('listsPlugin');

export interface ListsPluginState {
  bulletListActive: boolean;
  bulletListDisabled: boolean;
  orderedListActive: boolean;
  orderedListDisabled: boolean;
}

export const createPlugin = (
  dispatch: Dispatch,
  portalProviderAPI: PortalProviderAPI,
  providerFactory: ProviderFactory,
) =>
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

    key: pluginKey,

    props: {
      nodeViews: {
        listItem: listItemNodeView(portalProviderAPI, providerFactory),
      },
    },
  });
