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
          // ED-5033, calendar control open for element in plugin state, when node-view is clicked.
          // Following chanek ensures that if same node-view is clicked twice calendar should close,
          // but if a different node-view is clicked, calendar should open next the that node-view.
          const elmId = meta.element && meta.element && meta.element.firstChild && meta.element.firstChild.id;
          const oldElmId = state && state.element && state.element.firstChild && (state.element.firstChild as HTMLElement).id;
          let newState;
          if (elmId && elmId === oldElmId) {
            newState = { ...state, element: null };
          } else {
            newState = { ...state, ...meta };
          }
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
