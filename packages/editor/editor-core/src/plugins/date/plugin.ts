import { Plugin, PluginKey } from 'prosemirror-state';
import DateNodeView from './nodeviews/date';
import { ReactNodeView } from '../../nodeviews';
import { PMPluginFactory } from '../../types';

export const pluginKey = new PluginKey('datePlugin');

export type DateState = {
  element: HTMLElement | null;
};

const createPlugin: PMPluginFactory = ({ dispatch, portalProviderAPI }) =>
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
        date: ReactNodeView.fromComponent(DateNodeView, portalProviderAPI),
      },
    },
  });

export default createPlugin;
