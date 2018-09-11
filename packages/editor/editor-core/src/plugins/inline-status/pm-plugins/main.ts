import { EditorState, Plugin, PluginKey } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import {
  findParentDomRefOfType,
  findParentNodeOfType,
} from 'prosemirror-utils';
import {
  StatusComponent as StatusComponentNodeView,
  statusNodeView,
} from '../nodeviews/status';
import { ReactNodeView } from '../../../nodeviews';

export type StatusState = {
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
          activePanelType: undefined,
          toolbarVisible: false,
        };
      },
      apply(tr, pluginState: StatusState, oldState, newState) {
        const nextPluginState = tr.getMeta(pluginKey);
        const parentStatusNode = findParentNodeOfType(
          oldState.schema.nodes.status,
        )(oldState.tr.selection);
        //   if (parentStatusNode && nextPluginState) {
        //     const newPluginState = {
        //       insideStatus: true,
        //       ...pluginState
        //   }
        //   dispatch(pluginKey,newPluginState);
        //   return newPluginState;
        // }
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
                nodes: { status },
              },
            },
          } = view;
          //console.log(getPluginState(view.state))
          const pluginState = getPluginState(view.state);
          const parent = findParentNodeOfType(status)(selection);
          const parentDOM = findParentDomRefOfType(
            status,
            view.domAtPos.bind(view),
          )(selection);

          if (parentDOM !== pluginState.element) {
            setPluginState({
              element: parentDOM,
              activePanelType: parent && parent!.node.attrs['panelType'],
              toolbarVisible: !!parent,
              inlineEditing: parentDOM !== undefined,
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
        status: statusNodeView(portalProviderAPI),
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
