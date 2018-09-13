import { EditorState, Plugin, PluginKey } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import {
  findParentDomRefOfType,
  findParentNodeOfType,
} from 'prosemirror-utils';
import { inlineStatusNodeView } from '../nodeviews/inline-status';

export type StatusState = {
  element?: HTMLElement;
  showPickerAt?: number | null;
  color?: string;
};

export const availablePanelType = [
  'info',
  'note',
  'success',
  'warning',
  'error',
];

export const getPluginState = (state: EditorState): StatusState => {
  return pluginKey.getState(state);
};

export const setPluginState = (stateProps: Object) => (
  state: EditorState,
  dispatch: (tr) => void,
): boolean => {
  const pluginState = getPluginState(state);
  dispatch(
    state.tr.setMeta(pluginKey, {
      ...pluginState,
      ...stateProps,
    }),
  );
  return true;
};

export type StatusStateSubscriber = (state: StatusState) => any;

export const pluginKey = new PluginKey('inlineStatusPlugin');

export const createPlugin = ({
  portalProviderAPI,
  dispatch,
  providerFactory,
}) =>
  new Plugin({
    state: {
      init(config, state: EditorState) {
        return {
          element: null,
          showPickerAt: null,
          color: 'neutral',
        };
      },
      apply(tr, pluginState: StatusState) {
        const nextPluginState = tr.getMeta(pluginKey);
        if (nextPluginState) {
          dispatch(pluginKey, nextPluginState);
          return nextPluginState;
        }
        return pluginState;
      },
    },
    key: pluginKey,
    view: (view: EditorView) => {
      return {
        update: (view: EditorView, prevState: EditorState) => {
          const {
            state: {
              selection,
              schema: {
                nodes: { inlineStatus },
              },
            },
          } = view;

          const pluginState = getPluginState(view.state);
          const parent = findParentNodeOfType(inlineStatus)(selection);
          const parentDOM = findParentDomRefOfType(
            inlineStatus,
            view.domAtPos.bind(view),
          )(selection);

          if (parentDOM !== pluginState.element) {
            setPluginState({
              element: parentDOM,
              color: (parent && parent!.node.attrs['color']) || 'neutral',
              showPickerAt: parent ? view.state.tr.selection.from - 1 : null,
            })(view.state, view.dispatch);
            return true;
          }

          /** Plugin dispatch needed to reposition the toolbar */
          dispatch(pluginKey, {
            ...pluginState,
          });
        },
      };
    },
    props: {
      nodeViews: {
        inlineStatus: inlineStatusNodeView(portalProviderAPI),
      },
      handleDOMEvents: {
        blur(view: EditorView, event) {
          setPluginState({
            element: null,
            color: 'neutral',
            showPickerAt: null,
          })(view.state, view.dispatch);
          return false;
        },
      },
    },
  });
