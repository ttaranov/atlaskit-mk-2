import * as React from 'react';
import { Plugin, PluginKey } from 'prosemirror-state';
import { Popup } from '@atlaskit/editor-common';

import WithPluginState from '../../ui/WithPluginState';
import { EditorPlugin } from '../../types';
import { Dispatch } from '../../event-dispatcher';
import Toolbar from './ui/Toolbar';
import { FloatingToolbarHandler, FloatingToolbarConfig } from './types';

const floatingToolbarPlugin: EditorPlugin = {
  name: 'floatingToolbar',

  pmPlugins(floatingToolbar: Array<FloatingToolbarHandler> = []) {
    return [
      {
        // Should be after all toolbar plugins
        rank: 5000,
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
        plugins={{ floatingToolbarConfig: pluginKey }}
        render={({
          floatingToolbarConfig,
        }: {
          floatingToolbarConfig?: FloatingToolbarConfig;
        }) => {
          if (floatingToolbarConfig) {
            const { title, target, items } = floatingToolbarConfig;
            return (
              <Popup
                offset={[0, 12]}
                target={target}
                alignY="bottom"
                alignX="center"
                stickToBottom={true}
                mountTo={popupsMountPoint}
                boundariesElement={popupsBoundariesElement}
                scrollableElement={popupsScrollableElement}
              >
                <Toolbar
                  ariaLabel={title}
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
  dispatch: Dispatch<FloatingToolbarConfig | undefined>,
  floatingToolbarHandlers: Array<FloatingToolbarHandler>,
) {
  return new Plugin({
    key: pluginKey,
    state: {
      init: () => undefined,

      apply(tr, pluginState, oldState, newState) {
        const configs = floatingToolbarHandlers
          .map(handler => handler(newState))
          .filter(Boolean) as Array<FloatingToolbarConfig>;

        let newPluginState: FloatingToolbarConfig | undefined;
        const noOfToolbars = configs.length;
        if (noOfToolbars === 1) {
          newPluginState = configs[0];
        } else if (noOfToolbars > 1) {
          // tslint:disable-next-line:no-console
          console.warn('Expected one active toolbar but got ${noOfToolbars}.');
        }

        dispatch(pluginKey, newPluginState);
        return newPluginState;
      },
    },
  });
}
