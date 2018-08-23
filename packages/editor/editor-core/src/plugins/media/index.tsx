import * as React from 'react';
import EditorImageIcon from '@atlaskit/icon/glyph/editor/image';
import {
  media,
  mediaGroup,
  mediaSingle,
  WithProviders,
} from '@atlaskit/editor-common';
import { SmartMediaEditor } from '@atlaskit/media-editor';
import { NodeSelection } from 'prosemirror-state';
import { isNodeSelection } from 'prosemirror-utils';
import { EditorPlugin } from '../../types';

import {
  stateKey as pluginKey,
  createPlugin,
  MediaProvider,
  MediaState,
  MediaStateManager,
  DefaultMediaStateManager,
  MediaPluginState,
} from './pm-plugins/main';
import keymapMediaSinglePlugin from './pm-plugins/keymap-media-single';
import keymapPlugin from './pm-plugins/keymap';
import ToolbarMedia from './ui/ToolbarMedia';
import MediaSingleEdit from './ui/MediaSingleEdit';
import { mediaSingleNodeView } from './nodeviews/media-single';
import { mediaGroupNodeView } from './nodeviews/media-group';
import { CustomMediaPicker } from './types';
import { FileIdentifier } from '@atlaskit/media-card';
import WithPluginState from '../../ui/WithPluginState';

export {
  MediaState,
  MediaStateManager,
  DefaultMediaStateManager,
  MediaProvider,
  CustomMediaPicker,
};

export interface MediaOptions {
  provider?: Promise<MediaProvider>;
  allowMediaSingle?: boolean | MediaSingleOptions;
  allowMediaGroup?: boolean;
  customDropzoneContainer?: HTMLElement;
  customMediaPicker?: CustomMediaPicker;
}

export interface MediaSingleOptions {
  disableLayout?: boolean;
}

const mediaPlugin = (options?: MediaOptions): EditorPlugin => ({
  nodes() {
    return [
      { name: 'mediaGroup', node: mediaGroup },
      { name: 'mediaSingle', node: mediaSingle },
      { name: 'media', node: media },
    ].filter(node => {
      const { allowMediaGroup = true, allowMediaSingle = false } =
        options || {};

      if (node.name === 'mediaGroup') {
        return allowMediaGroup;
      }

      if (node.name === 'mediaSingle') {
        return allowMediaSingle;
      }

      return true;
    });
  },

  pmPlugins() {
    return [
      {
        name: 'media',
        plugin: ({
          schema,
          props,
          dispatch,
          eventDispatcher,
          providerFactory,
          errorReporter,
          portalProviderAPI,
          reactContext,
        }) =>
          createPlugin(
            schema,
            {
              providerFactory,
              nodeViews: {
                mediaGroup: mediaGroupNodeView(
                  portalProviderAPI,
                  providerFactory,
                ),
                mediaSingle: mediaSingleNodeView(
                  portalProviderAPI,
                  eventDispatcher,
                  providerFactory,
                ),
              },
              errorReporter,
              uploadErrorHandler: props.uploadErrorHandler,
              waitForMediaUpload: props.waitForMediaUpload,
              customDropzoneContainer:
                options && options.customDropzoneContainer,
              customMediaPicker: options && options.customMediaPicker,
            },
            reactContext,
            dispatch,
            props.appearance,
          ),
      },
      { name: 'mediaKeymap', plugin: ({ schema }) => keymapPlugin(schema) },
    ].concat(
      options && options.allowMediaSingle
        ? {
            name: 'mediaSingleKeymap',
            plugin: ({ schema }) => keymapMediaSinglePlugin(schema),
          }
        : [],
    );
  },

  contentComponent({ editorView }) {
    if (!options) {
      return null;
    }

    const { allowMediaSingle } = options;
    let disableLayout: boolean | undefined;
    if (typeof allowMediaSingle === 'object') {
      disableLayout = allowMediaSingle.disableLayout;
    }
    if (
      (typeof allowMediaSingle === 'boolean' && allowMediaSingle === false) ||
      (typeof disableLayout === 'boolean' && disableLayout === true)
    ) {
      return null;
    }
    const pluginState = pluginKey.getState(editorView.state);

    return (
      <>
        <MediaSingleEdit pluginState={pluginState} />
        <WithPluginState
          plugins={{
            mediaState: pluginKey,
          }}
          render={({ mediaState }) => {
            const node = pluginState.selectedMediaNode();

            if (!pluginState.resolvedUploadContext) {
              return null;
            }

            if (node && pluginState.editingMediaId) {
              const identifier: FileIdentifier = {
                id: node.attrs.id,
                mediaItemType: 'file',
                collectionName: node.attrs.collection,
              };
              return (
                <SmartMediaEditor
                  identifier={identifier}
                  context={
                    (pluginState as MediaPluginState).resolvedUploadContext!
                  }
                  onFinish={newIdentifier =>
                    pluginState.onFinishEditing(newIdentifier, node)
                  }
                />
              );
            }
            return null;
          }}
        />
      </>
    );
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

  pluginsOptions: {
    quickInsert: [
      {
        title: 'Files and images',
        priority: 200,
        keywords: ['media'],
        icon: () => <EditorImageIcon label="Files and images" />,
        action(insert, state) {
          const pluginState = pluginKey.getState(state);
          pluginState.showMediaPicker();
          return insert();
        },
      },
    ],
  },
});

export default mediaPlugin;
