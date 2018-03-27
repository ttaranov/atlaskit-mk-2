import { Node as PMNode, Schema } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import { ImagePreview } from '@atlaskit/media-picker';

import { isImage, setTextSelection, isTableCell } from '../../../utils';
import { insertNodesEndWithNewParagraph } from '../../../commands';
import { copyOptionalAttrsFromMediaState } from '../utils/media-common';
import { MediaState } from '../types';

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

  const { state, state: { selection }, dispatch } = view;
  const node = createMediaSingleNode(state.schema, collection)(mediaState);
  const paraAdded = insertNodesEndWithNewParagraph([node])(state, dispatch);

  if (isTableCell(state)) {
    /** If table cell, the default is to move to the next cell, override to select paragraph */
    setTextSelection(view, state.selection.head + 1, state.selection.head + 1);
  }
  return paraAdded;
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
    __key: id,
  });

  copyOptionalAttrsFromMediaState(mediaState, mediaNode);
  return mediaSingle.create({}, mediaNode);
};
