import * as React from 'react';
import { EditorView } from 'prosemirror-view';
import { Plugin, PluginKey } from 'prosemirror-state';
import { findDomRefAtPos, findSelectedNodeOfType } from 'prosemirror-utils';
import { Popup } from '@atlaskit/editor-common';

import WithPluginState from '../../ui/WithPluginState';
import { EditorPlugin } from '../../types';
import { Dispatch } from '../../event-dispatcher';
import { ToolbarLoader } from './ui/ToolbarLoader';
import { FloatingToolbarHandler, FloatingToolbarConfig } from './types';

const getRelevantConfig = (
  view: EditorView,
  configs: Array<FloatingToolbarConfig>,
): FloatingToolbarConfig | undefined => {
  // node selections always take precedence, see if
  const selectedConfig = configs.find(
    config => !!findSelectedNodeOfType(config.nodeType)(view.state.selection),
  );

  if (selectedConfig) {
    return selectedConfig;
  }

  // create mapping of node type name to configs
  const configByNodeType = {};
  configs.forEach(config => {
    if (Array.isArray(config.nodeType)) {
      config.nodeType.forEach(nodeType => {
        configByNodeType[nodeType.name] = config;
      });
    } else {
      configByNodeType[config.nodeType.name] = config;
    }
  });

  // search up the tree from selection
  const { $from } = view.state.selection;
  for (let i = $from.depth; i > 0; i--) {
    const node = $from.node(i);

    const matchedConfig = configByNodeType[node.type.name];
    if (matchedConfig) {
      return matchedConfig;
    }
  }
};

const getDomRefFromSelection = (view: EditorView) =>
  findDomRefAtPos(
    view.state.selection.from,
    view.domAtPos.bind(view),
  ) as HTMLElement;

const floatingToolbarPlugin: EditorPlugin = {
  name: 'floatingToolbar',

  pmPlugins(floatingToolbarHandlers: Array<FloatingToolbarHandler> = []) {
    return [
      {
        // Should be after all toolbar plugins
        name: 'floatingToolbar',
        plugin: ({ dispatch, reactContext }) =>
          floatingToolbarPluginFactory({
            dispatch,
            floatingToolbarHandlers,
            reactContext,
          }),
      },
    ];
  },

  contentComponent({
    popupsMountPoint,
    popupsBoundariesElement,
    popupsScrollableElement,
    editorView,
  }) {
    return (
      <WithPluginState
        plugins={{ floatingToolbarConfigs: pluginKey }}
        render={({
          floatingToolbarConfigs,
        }: {
          floatingToolbarConfigs?: Array<FloatingToolbarConfig>;
        }) => {
          const relevantConfig =
            floatingToolbarConfigs &&
            getRelevantConfig(editorView, floatingToolbarConfigs);
          if (relevantConfig) {
            const {
              title,
              getDomRef = getDomRefFromSelection,
              items,
            } = relevantConfig;
            const targetRef = getDomRef(editorView);
            if (targetRef) {
              return (
                <Popup
                  ariaLabel={title}
                  offset={[0, 12]}
                  target={targetRef}
                  alignY="bottom"
                  alignX="center"
                  stickToBottom={true}
                  mountTo={popupsMountPoint}
                  boundariesElement={popupsBoundariesElement}
                  scrollableElement={popupsScrollableElement}
                >
                  <ToolbarLoader
                    items={items}
                    dispatchCommand={fn =>
                      fn && fn(editorView.state, editorView.dispatch)
                    }
                    popupsMountPoint={popupsMountPoint}
                    popupsBoundariesElement={popupsBoundariesElement}
                    popupsScrollableElement={popupsScrollableElement}
                  />
                </Popup>
              );
            }
          }
          return null;
        }}
      />
    );
  },
};

export default floatingToolbarPlugin;

/**
 *
 * ProseMirror Plugin
 *
 */

export const pluginKey = new PluginKey('floatingToolbarPluginKey');

function floatingToolbarPluginFactory(options: {
  floatingToolbarHandlers: Array<FloatingToolbarHandler>;
  dispatch: Dispatch<Array<FloatingToolbarConfig> | undefined>;
  reactContext: () => { [key: string]: any };
}) {
  const { floatingToolbarHandlers, dispatch, reactContext } = options;
  return new Plugin({
    key: pluginKey,
    state: {
      init: () => {
        ToolbarLoader.preload();
      },
      apply(tr, pluginState, oldState, newState) {
        const { intl } = reactContext();
        const newPluginState = floatingToolbarHandlers
          .map(handler => handler(newState, intl))
          .filter(Boolean) as Array<FloatingToolbarConfig>;

        dispatch(pluginKey, newPluginState);
        return newPluginState;
      },
    },
  });
}
