import { Plugin, PluginKey } from 'prosemirror-state';
import { ProviderFactory } from '@atlaskit/editor-common';
import { Dispatch } from '../../event-dispatcher';
import DateNodeView from './nodeviews/date';
import { nodeViewFactory } from '../../nodeviews';

export const pluginKey = new PluginKey('datePlugin');

export type DateState = {
  element: HTMLElement | null;
};

export default (dispatch: Dispatch, providerFactory: ProviderFactory) =>
  new Plugin({
    state: {
      init: () => ({ element: null }),

      apply(tr, state: DateState) {
        const meta = tr.getMeta(pluginKey);
        if (meta) {
          const newState = { ...state, ...meta };
          dispatch(pluginKey, newState);

          return newState;
        }

        return state;
      },
    },
    key: pluginKey,
    props: {
      nodeViews: {
        date: nodeViewFactory(providerFactory, { date: DateNodeView }),
      },
    },
  });
