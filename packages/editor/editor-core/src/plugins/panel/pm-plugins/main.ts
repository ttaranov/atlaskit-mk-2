import { EditorState, Plugin, PluginKey } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import {
  findParentDomRefOfType,
  findParentNodeOfType,
} from 'prosemirror-utils';
import { panelNodeView } from '../nodeviews/panel';

export type PanelState = {
  element?: HTMLElement;
  activePanelType?: string | undefined;
  toolbarVisible?: boolean | undefined;
};

export const availablePanelType = [
  'info',
  'note',
  'success',
  'warning',
  'error',
];

export const getPluginState = (state: EditorState): PanelState => {
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

export type PanelStateSubscriber = (state: PanelState) => any;

export const pluginKey = new PluginKey('panelPlugin');

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
          activePanelType: undefined,
          toolbarVisible: false,
        };
      },
      apply(tr, pluginState: PanelState, oldState, newState) {
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
                nodes: { panel },
              },
            },
          } = view;
          const pluginState = getPluginState(view.state);
          const parent = findParentNodeOfType(panel)(selection);
          const parentDOM = findParentDomRefOfType(
            panel,
            view.domAtPos.bind(view),
          )(selection);
          if (parentDOM !== pluginState.element) {
            setPluginState({
              element: parentDOM,
              activePanelType: parent && parent!.node.attrs['panelType'],
              toolbarVisible: !!parent,
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
        panel: panelNodeView(portalProviderAPI),
      },
      handleDOMEvents: {
        blur(view: EditorView, event) {
          const pluginState = getPluginState(view.state);
          if (pluginState.toolbarVisible) {
            setPluginState({
              toolbarVisible: false,
              element: null,
              activePanelType: undefined,
            })(view.state, view.dispatch);
            return true;
          }
          return false;
        },
      },
    },
  });
