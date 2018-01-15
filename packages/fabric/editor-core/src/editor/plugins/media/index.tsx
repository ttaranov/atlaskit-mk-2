import * as React from 'react';
import { EditorView } from 'prosemirror-view';
import { Node as PmNode } from 'prosemirror-model';
import { media, mediaGroup, mediaSingle } from '@atlaskit/editor-common';
import { MediaProvider } from '@atlaskit/media-core';

import { stateKey as pluginKey, createPlugin } from '../../../plugins/media';
import keymapPlugin from '../../../plugins/media/keymap';
import keymapMediaSinglePlugin from '../../../plugins/media/keymap-media-single';
import ToolbarMedia from '../../../ui/ToolbarMedia';
import MediaSingleEdit from '../../../ui/MediaSingleEdit';
import {
  nodeViewFactory,
  ReactMediaGroupNode,
  ReactMediaNode,
  ReactMediaSingleNode,
} from '../../../nodeviews';
import { EditorPlugin } from '../../types';
import WithPluginState from '../../ui/WithPluginState';
import { pluginKey as widthPluginKey } from '../width';

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

  nodeViews: (providerFactory, eventDispatcher) => ({
    mediaGroup: nodeViewFactory(
      providerFactory,
      {
        mediaGroup: ReactMediaGroupNode,
        media: ReactMediaNode,
      },
      true,
    ),
    mediaSingle: nodeViewFactory(
      providerFactory,
      {
        mediaSingle: ({
          view,
          node,
          ...props
        }: {
          view: EditorView;
          node: PmNode;
        }) => (
          <WithPluginState
            editorView={view}
            eventDispatcher={eventDispatcher}
            plugins={{
              width: widthPluginKey,
            }}
            // tslint:disable-next-line:jsx-no-lambda
            render={({ width }) => (
              <ReactMediaSingleNode
                view={view}
                node={node}
                width={width}
                {...props}
              />
            )}
          />
        ),
        media: ReactMediaNode,
      },
      true,
    ),
  }),
});

export default mediaPlugin;
