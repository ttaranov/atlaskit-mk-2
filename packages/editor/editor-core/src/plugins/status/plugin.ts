import { Plugin, PluginKey } from 'prosemirror-state';
import StatusNodeView from './nodeviews/status';
import { ReactNodeView } from '../../nodeviews';
import { PMPluginFactory } from '../../types';

export const pluginKey = new PluginKey('statusPlugin');

export type StatusState = {
  showStatusPickerAt: number | null;
};

const createPlugin: PMPluginFactory = ({ dispatch, portalProviderAPI }) =>
  new Plugin({
    state: {
      init: () => ({ showStatusPickerAt: null }),
      apply(tr, state: StatusState) {
        const meta = tr.getMeta(pluginKey);

        if (meta) {
          let newState = { ...state, ...meta };
          dispatch(pluginKey, newState);
          return newState;
        }

        if (tr.docChanged && state.showStatusPickerAt) {
          const { pos, deleted } = tr.mapping.mapResult(
            state.showStatusPickerAt,
          );
          const newState = {
            showStatusPickerAt: deleted ? null : pos,
          };

          if (newState.showStatusPickerAt !== state.showStatusPickerAt) {
            dispatch(pluginKey, newState);

            return newState;
          }
        }

        return state;
      },
    },
    key: pluginKey,
    props: {
      nodeViews: {
        status: ReactNodeView.fromComponent(StatusNodeView, portalProviderAPI),
      },
    },
  });

export default createPlugin;
