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
} from 'prosemirror-utils';
import { closestElement } from '../../utils';

export const pluginKey = new PluginKey('extensionPlugin');

export type ExtensionState = {
  element: HTMLElement | null;
};

export default (
  dispatch: Dispatch,
  providerFactory: ProviderFactory,
  extensionHandlers: ExtensionHandlers,
  portalProviderAPI: PortalProviderAPI,
) =>
  new Plugin({
    state: {
      init: () => ({ element: null, layout: 'default' }),

      apply(tr, state: ExtensionState, prevState, nextState) {
        const meta = tr.getMeta(pluginKey);

        if (meta) {
          const newState = { ...state, ...meta };

          dispatch(pluginKey, newState);

          return newState;
        }

        return state;
      },
    },
    view: () => {
      return {
        update: (view: EditorView) => {
          const { state, state: { schema } } = view;
          const { element } = pluginKey.getState(state);
          const { extension, inlineExtension, bodiedExtension } = schema.nodes;

          /** Check whether selection has an extension */
          let selectedExtNode = findParentNodeOfType([
            extension,
            inlineExtension,
            bodiedExtension,
          ])(state.selection);

          const domAtPos = view.domAtPos.bind(view);

          let stickToolbarToBottom = true;

          if (selectedExtNode && selectedExtNode.node.attrs.parameters) {
            stickToolbarToBottom =
              typeof selectedExtNode.node.attrs.parameters
                .stickToolbarToBottom === 'undefined'
                ? true
                : selectedExtNode.node.attrs.parameters.stickToolbarToBottom;
          }

          let selectedExtDomNode =
            selectedExtNode &&
            (findDomRefAtPos(selectedExtNode.pos, domAtPos) as HTMLElement);

          /** If a node is selected, get position of that instead
           * The check will be refactored once we have isNodeOfTypeSelected from PM-utils
           */
          if (
            state.selection instanceof NodeSelection &&
            (state.selection.node.type === state.schema.nodes.bodiedExtension ||
              state.selection.node.type === state.schema.nodes.extension ||
              state.selection.node.type === state.schema.nodes.inlineExtension)
          ) {
            selectedExtNode = {
              node: state.selection.node,
              pos: state.selection.$head.pos,
            };
            selectedExtDomNode = findDomRefAtPos(
              selectedExtNode.pos,
              domAtPos,
            ) as HTMLElement;
          }

          /** No-op, extensions not even in the picture */
          if (!selectedExtNode && !element) {
            return;
          }

          let showLayoutOptions = !!(
            selectedExtNode &&
            (selectedExtNode.node.type === schema.nodes.bodiedExtension ||
              selectedExtNode.node.type === schema.nodes.extension)
          );

          if (
            findSelectedNodeOfType(extension)(state.selection) &&
            findParentNodeOfType(schema.nodes.bodiedExtension)(state.selection)
          ) {
            showLayoutOptions = false;
          }
          const newElement =
            closestElement(selectedExtDomNode!, '.extension-container') ||
            selectedExtDomNode;

          if (selectedExtNode) {
            /** Update with new element */
            if (element !== newElement) {
              const tr = state.tr.setMeta(pluginKey, { element: newElement });
              view.dispatch(tr);
            }

            /** We still want to re-render the toolbar for any size-adjustments */

            dispatch(pluginKey, {
              element: newElement,
              stickToolbarToBottom,
              layout: selectedExtNode.node.attrs.layout,
              showLayoutOptions,
            });
          } else if (!selectedExtNode && element !== null) {
            /** case 2: selection has no extension, but element is alive and kicking */
            const tr = state.tr.setMeta(pluginKey, { element: null });
            view.dispatch(tr);
          }
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
