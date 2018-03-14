import * as React from 'react';
import { media, mediaGroup, mediaSingle } from '@atlaskit/editor-common';
import { EditorPlugin } from '../../types';
import {
  stateKey as pluginKey,
  createPlugin,
  MediaProvider,
  MediaState,
  MediaStateManager,
  DefaultMediaStateManager,
} from './pm-plugins/main';
import keymapPlugin from './pm-plugins/keymap';
import keymapMediaSinglePlugin from './pm-plugins/keymap-media-single';
import ToolbarMedia from './ui/ToolbarMedia';
import MediaSingleEdit from './ui/MediaSingleEdit';

export {
  MediaState,
  MediaStateManager,
  DefaultMediaStateManager,
  MediaProvider,
};

export interface MediaOptions {
  provider?: Promise<MediaProvider>;
  allowMediaSingle?: boolean;
  customDropzoneContainer?: HTMLElement;
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
              customDropzoneContainer:
                options && options.customDropzoneContainer,
            },
            dispatch,
            props.appearance,
          ),
      },
      { rank: 1220, plugin: ({ schema }) => keymapPlugin(schema) },
    ].concat(
      options && options.allowMediaSingle
        ? {
            rank: 1250,
            plugin: ({ schema }) => keymapMediaSinglePlugin(schema),
          }
        : [],
    );
  },

  contentComponent({ editorView }) {
    const pluginState = pluginKey.getState(editorView.state);

    return <MediaSingleEdit pluginState={pluginState} />;
  },

  secondaryToolbarComponent({ editorView, disabled }) {
    return (
      <ToolbarMedia
        editorView={editorView}
        pluginKey={pluginKey}
        isDisabled={disabled}
        isReducedSpacing={true}
      />
    );
  },
});

export default mediaPlugin;
