import { EditorState, Plugin, PluginKey } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import {
  findParentDomRefOfType,
  findParentNodeOfType,
} from 'prosemirror-utils';

import codeBlockNodeView from '../nodeviews/code-block';
import { SelectOption } from '../../floating-toolbar/ui/Select';

export type CodeBlockState = {
  element?: HTMLElement;
  language?: SelectOption | undefined;
  toolbarVisible?: boolean | undefined;
};

export const getPluginState = (state: EditorState): CodeBlockState =>
  pluginKey.getState(state);

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

export type CodeBlockStateSubscriber = (state: CodeBlockState) => any;

export const pluginKey = new PluginKey('codeBlockPlugin');

export const createPlugin = ({
  portalProviderAPI,
  dispatch,
  providerFactory,
}) =>
  new Plugin({
    state: {
      init(config, state: EditorState): CodeBlockState {
        return {
          toolbarVisible: false,
        };
      },
      apply(tr, pluginState: CodeBlockState, oldState, newState) {
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
                nodes: { codeBlock },
              },
            },
          } = view;
          const pluginState = getPluginState(view.state);
          const parentDOM = findParentDomRefOfType(
            codeBlock,
            view.domAtPos.bind(view),
          )(selection);
          if (parentDOM !== pluginState.element) {
            const parent = findParentNodeOfType(codeBlock)(selection);
            setPluginState({
              element: parentDOM,
              language: parent && parent!.node.attrs['language'],
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
        codeBlock: codeBlockNodeView,
      },
      handleDOMEvents: {
        blur(view: EditorView, event) {
          const pluginState = getPluginState(view.state);
          if (pluginState.toolbarVisible) {
            setPluginState({
              toolbarVisible: false,
              element: null,
            })(view.state, view.dispatch);
            return true;
          }
          return false;
        },
      },
    },
  });
