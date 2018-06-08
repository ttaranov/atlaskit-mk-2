import { Plugin, PluginKey, NodeSelection } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { ProviderFactory, ExtensionHandlers } from '@atlaskit/editor-common';
import { Dispatch } from '../../event-dispatcher';
import { PortalProviderAPI } from '../../ui/PortalProvider';
import ExtensionNodeView from './nodeviews/extension';
import {
  findParentNodeOfType,
  findDomRefAtPos,
  findSelectedNodeOfType,
  isNodeSelection,
} from 'prosemirror-utils';
import { closestElement } from '../../utils';

export const pluginKey = new PluginKey('extensionPlugin');

export type ExtensionState = {
  element: HTMLElement | null;
};

const getSelectedExtNode = state => {
  const { extension, inlineExtension, bodiedExtension } = state.schema.nodes;

  let selectedExtNode = findParentNodeOfType([
    extension,
    inlineExtension,
    bodiedExtension,
  ])(state.selection);

  if (
    isNodeSelection(state.selection) &&
    findSelectedNodeOfType([extension, bodiedExtension, inlineExtension])
  ) {
    selectedExtNode = {
      node: (state.selection as NodeSelection).node,
      pos: state.selection.$head.pos - 1,
    };
  }

  return selectedExtNode;
};

export default (
  dispatch: Dispatch,
  providerFactory: ProviderFactory,
  extensionHandlers: ExtensionHandlers,
  portalProviderAPI: PortalProviderAPI,
  allowExtension,
) =>
  new Plugin({
    state: {
      init: () => {
        let stickToolbarToBottom = true;

        if (
          typeof allowExtension === 'object' &&
          allowExtension.stickToolbarToBottom === false
        ) {
          stickToolbarToBottom = false;
        }

        return {
          element: null,
          layout: 'default',
          showLayoutOptions: true,
          stickToolbarToBottom,
          node: null,
        };
      },
      apply(tr, state: ExtensionState, prevState, nextState) {
        const nextPluginState = tr.getMeta(pluginKey);
        if (nextPluginState) {
          dispatch(pluginKey, nextPluginState);
          return nextPluginState;
        }

        return state;
      },
    },
    view: (editorView: EditorView) => {
      const domAtPos = editorView.domAtPos.bind(editorView);

      return {
        update: (view: EditorView) => {
          const {
            dispatch: editorDispatch,
            state,
            state: { schema },
          } = view;

          /** this fetches the selected extn node, either by keyboard selection or click for all types of extns */
          const selectedExtNode = getSelectedExtNode(state);
          const selectedExtDomNode =
            selectedExtNode &&
            (findDomRefAtPos(selectedExtNode.pos, domAtPos) as HTMLElement);
          const pluginState = pluginKey.getState(state);

          if (!selectedExtNode && !pluginState.element) {
            return;
          }

          const { extension, inlineExtension } = schema.nodes;

          const isNonContentExt = findSelectedNodeOfType([
            inlineExtension,
            extension,
          ])(state.selection);

          /** Non-content extension can be nested in bodied-extension, the following check is necessary for that case */
          const newElement =
            selectedExtNode && selectedExtDomNode
              ? isNonContentExt
                ? selectedExtDomNode.querySelector('.extension-container') ||
                  selectedExtDomNode
                : closestElement(selectedExtDomNode!, '.extension-container') ||
                  selectedExtDomNode!.querySelector('.extension-container') ||
                  selectedExtDomNode
              : undefined;

          if (pluginState.element !== newElement) {
            editorDispatch(
              state.tr.setMeta(pluginKey, {
                ...pluginState,
                element: newElement,
                layout: selectedExtNode && selectedExtNode!.node.attrs.layout,
                node: selectedExtNode,
              }),
            );
            return true;
          }

          /** Required toolbar re-positioning */
          dispatch(pluginKey, {
            ...pluginState,
          });
          return true;
        },
      };
    },
    key: pluginKey,
    props: {
      nodeViews: {
        extension: ExtensionNodeView(
          portalProviderAPI,
          providerFactory,
          extensionHandlers,
        ),
        bodiedExtension: ExtensionNodeView(
          portalProviderAPI,
          providerFactory,
          extensionHandlers,
        ),
        inlineExtension: ExtensionNodeView(
          portalProviderAPI,
          providerFactory,
          extensionHandlers,
        ),
      },
    },
  });
