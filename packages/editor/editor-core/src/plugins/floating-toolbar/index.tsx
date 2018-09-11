import * as React from 'react';
import { EditorView } from 'prosemirror-view';
import { Plugin, PluginKey } from 'prosemirror-state';
import {
  findParentDomRefOfType,
  findSelectedNodeOfType,
  findDomRefAtPos,
} from 'prosemirror-utils';
import { Popup } from '@atlaskit/editor-common';

import WithPluginState from '../../ui/WithPluginState';
import { EditorPlugin } from '../../types';
import { Dispatch } from '../../event-dispatcher';
import Toolbar from './ui/Toolbar';
import { FloatingToolbarHandler, FloatingToolbarConfig } from './types';
import { NodeType } from 'prosemirror-model';

const getConfigNodeTypes = (
  configs: Array<FloatingToolbarConfig>,
): NodeType[] => {
  return configs.reduce(
    (acc, config) => {
      if (Array.isArray(config.nodeType)) {
        acc.push(...config.nodeType);
      } else {
        acc.push(config.nodeType);
      }

      return acc;
    },
    [] as NodeType[],
  );
};

const getRelevantConfig = (
  view: EditorView,
  configs: Array<FloatingToolbarConfig>,
): FloatingToolbarConfig => {
  if (configs.length > 1) {
    const domAtPos = view.domAtPos.bind(view);

    const configNodeTypes = getConfigNodeTypes(configs);

    const atomNodeTypes = configNodeTypes.filter(
      nodeType => nodeType.isAtom || nodeType.isLeaf,
    );
    const bodiedNodeTypes = configNodeTypes.filter(
      nodeType => !nodeType.isAtom && !nodeType.isLeaf,
    );

    const bodiedDomRef = findParentDomRefOfType(bodiedNodeTypes, domAtPos)(
      view.state.selection,
    );

    // If we have any nodeTypes that are atoms (cursor cannot be placed inside of node)
    // Selecting the parentNode won't yield any results, instead we look at whats
    // currently selected and add that as a comparison.
    let atomDomRef;
    if (atomNodeTypes.length) {
      const selectedAtom = findSelectedNodeOfType(atomNodeTypes)(
        view.state.selection,
      );
      atomDomRef = selectedAtom && findDomRefAtPos(selectedAtom.pos, domAtPos);
    }

    const relevantConfig = configs.filter(config => {
      const configDomRef = config.getDomRef(view);
      return configDomRef === atomDomRef || configDomRef === bodiedDomRef;
    });
    if (relevantConfig.length) {
      return relevantConfig[0];
    }
  }
  return configs[0];
};

const floatingToolbarPlugin: EditorPlugin = {
  name: 'floatingToolbar',

  pmPlugins(floatingToolbar: Array<FloatingToolbarHandler> = []) {
    return [
      {
        // Should be after all toolbar plugins
        name: 'floatingToolbar',
        plugin: ({ dispatch }) =>
          floatingToolbarPluginFactory(dispatch, floatingToolbar),
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
          if (floatingToolbarConfigs && floatingToolbarConfigs.length > 0) {
            const { title, getDomRef, items } = getRelevantConfig(
              editorView,
              floatingToolbarConfigs,
            );
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
                  <Toolbar
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

function floatingToolbarPluginFactory(
  dispatch: Dispatch<Array<FloatingToolbarConfig> | undefined>,
  floatingToolbarHandlers: Array<FloatingToolbarHandler>,
) {
  return new Plugin({
    key: pluginKey,
    state: {
      init: () => undefined,

      apply(tr, pluginState, oldState, newState) {
        const newPluginState = floatingToolbarHandlers
          .map(handler => handler(newState))
          .filter(Boolean) as Array<FloatingToolbarConfig>;

        dispatch(pluginKey, newPluginState);
        return newPluginState;
      },
    },
  });
}
