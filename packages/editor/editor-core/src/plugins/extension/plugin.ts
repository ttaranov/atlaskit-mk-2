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
  hasParentNodeOfType,
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
      pos: state.selection.$head.pos,
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
          const { dispatch: editorDispatch, state, state: { schema } } = view;
          const selectedExtNode = getSelectedExtNode(state);
          const selectedExtDomNode =
            selectedExtNode &&
            (findDomRefAtPos(selectedExtNode.pos, domAtPos) as HTMLElement);
          const pluginState = pluginKey.getState(state);

          if (!selectedExtNode && !pluginState.element) {
            return;
          }

          const {
            bodiedExtension,
            extension,
            inlineExtension,
            layoutSection,
            table,
          } = schema.nodes;
          const showLayoutOptions = !!(
            selectedExtNode &&
            (selectedExtNode.node.type === bodiedExtension ||
              (selectedExtNode.node.type === extension &&
                !hasParentNodeOfType([bodiedExtension, table])(
                  state.selection,
                ))) &&
            !hasParentNodeOfType([layoutSection])(state.selection)
          );

          const isNonContentMacros = findSelectedNodeOfType([
            inlineExtension,
            extension,
          ])(state.selection);

          /** Non-content macros can be nested in bodied-macros, the following check is necessary for that case */
          const newElement = selectedExtNode
            ? isNonContentMacros
              ? selectedExtDomNode!.querySelector('.extension-container') ||
                selectedExtDomNode
              : closestElement(selectedExtDomNode!, '.extension-container') ||
                selectedExtDomNode
            : undefined;

          if (pluginState.element !== newElement) {
            editorDispatch(
              state.tr.setMeta(pluginKey, {
                ...pluginState,
                element: newElement,
                showLayoutOptions,
                layout: selectedExtNode && selectedExtNode!.node.attrs.layout,
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
