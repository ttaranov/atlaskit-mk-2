import { Node as PMNode, Schema } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import { MediaState } from '@atlaskit/media-core';
import { ImagePreview } from '@atlaskit/media-picker';

import { isImage } from '../../utils';
import { insertNodesEndWithNewParagraph } from '../../commands';
import { copyOptionalAttrsFromMediaState } from './media-common';

export interface MediaSingleState extends MediaState {
  thumbnail: ImagePreview;
}

function isMediaSingleState(state: MediaState): state is MediaSingleState {
  return !!state.thumbnail;
}

export const insertMediaAsMediaSingle = (
  view: EditorView,
  node: PMNode,
): boolean => {
  const { state, dispatch } = view;
  const { mediaSingle, media } = state.schema.nodes;

  if (!mediaSingle) {
    return false;
  }

  // if not an image type media node
  if (node.type !== media || !isImage(node.attrs.__fileMimeType)) {
    return false;
  }

  const mediaSingleNode = mediaSingle.create({}, node);
  const nodes = [mediaSingleNode];

  return insertNodesEndWithNewParagraph(nodes)(state, dispatch);
};

export const insertMediaSingleNode = (
  view: EditorView,
  mediaState: MediaState,
  collection?: string,
): boolean => {
  if (!collection || !isMediaSingleState(mediaState)) {
    return false;
  }

  const { state, dispatch } = view;
  const node = createMediaSingleNode(state.schema, collection)(mediaState);
  return insertNodesEndWithNewParagraph([node])(state, dispatch);
};

export const createMediaSingleNode = (schema: Schema, collection: string) => (
  mediaState: MediaSingleState,
) => {
  const { id, thumbnail } = mediaState;
  const { width, height } = thumbnail.dimensions;
  const { media, mediaSingle } = schema.nodes;

  const mediaNode = media.create({
    id,
    type: 'file',
    collection,
    width,
    height,
  });

  copyOptionalAttrsFromMediaState(mediaState, mediaNode);
  return mediaSingle.create({}, mediaNode);
};
