import * as React from 'react';
import { media, mediaGroup, mediaSingle } from '@atlaskit/editor-common';
import { MediaProvider } from '@atlaskit/media-core';
import { EditorPlugin } from '../../types';
import { stateKey as pluginKey, createPlugin } from '../../../plugins/media';
import keymapPlugin from '../../../plugins/media/keymap';
import ToolbarMedia from '../../../ui/ToolbarMedia';

export interface MediaOptions {
  provider: Promise<MediaProvider>;
  allowMediaSingle?: boolean;
}

const mediaPlugin = (options?: MediaOptions): EditorPlugin => ({
  nodes() {
    return [
      { name: 'mediaGroup', node: mediaGroup, rank: 1700 },
      { name: 'mediaSingle', node: mediaSingle, rank: 1750 },
      { name: 'media', node: media, rank: 1800 },
    ].filter(
      node =>
        node.name !== 'mediaSingle' || (options && options.allowMediaSingle),
    );
  },

  pmPlugins() {
    return [
      {
        rank: 1200,
        plugin: ({ schema, props, dispatch, providerFactory, errorReporter }) =>
          createPlugin(
            schema,
            {
              providerFactory,
              errorReporter,
              uploadErrorHandler: props.uploadErrorHandler,
              waitForMediaUpload: props.waitForMediaUpload,
            },
            dispatch,
            props.appearance,
          ),
      },
      { rank: 1220, plugin: ({ schema }) => keymapPlugin(schema) },
    ];
  },

  primaryToolbarComponent(
    editorView,
    eventDispatcher,
    providerFactory,
    appearance,
    popupsMountPoint,
    popupsBoundariesElement,
    disabled,
    editorWidth,
  ) {
    return (
      <ToolbarMedia
        editorView={editorView}
        pluginKey={pluginKey}
        isDisabled={disabled}
        editorWidth={editorWidth}
      />
    );
  },

  secondaryToolbarComponent(
    editorView,
    eventDispatcher,
    providerFactory,
    appearance,
    popupsMountPoint,
    popupsBoundariesElement,
    disabled,
    editorWidth,
  ) {
    return (
      <ToolbarMedia
        editorView={editorView}
        pluginKey={pluginKey}
        isDisabled={disabled}
        editorWidth={editorWidth}
      />
    );
  },
});

export default mediaPlugin;
