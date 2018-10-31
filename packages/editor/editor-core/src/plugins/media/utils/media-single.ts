import { Node as PMNode, Schema, Fragment } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';

import { isImage } from '../../../utils';
import {
  insertNodesEndWithNewParagraph,
  shouldAppendParagraphAfterBlockNode,
} from '../../../commands';
import { copyOptionalAttrsFromMediaState } from '../utils/media-common';
import { MediaState } from '../types';
import { safeInsert } from 'prosemirror-utils';

export interface MediaSingleState extends MediaState {
  dimensions: { width: number; height: number };
  scaleFactor?: number;
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
  if (!collection) {
    return false;
  }

  const { state, dispatch } = view;
  const grandParent = state.selection.$from.node(-1);
  const node = createMediaSingleNode(state.schema, collection)(
    mediaState as MediaSingleState,
  );
  const shouldSplit =
    grandParent && grandParent.type.validContent(Fragment.from(node));

  if (shouldSplit) {
    insertNodesEndWithNewParagraph([node])(state, dispatch);
  } else {
    dispatch(
      safeInsert(
        shouldAppendParagraphAfterBlockNode(view.state)
          ? Fragment.fromArray([node, state.schema.nodes.paragraph.create()])
          : node,
      )(state.tr),
    );
  }

  return true;
};

export const createMediaSingleNode = (schema: Schema, collection: string) => (
  mediaState: MediaSingleState,
) => {
  const { id, dimensions, scaleFactor = 1 } = mediaState;
  const { width, height } = dimensions || {
    height: undefined,
    width: undefined,
  };
  const { media, mediaSingle } = schema.nodes;

  const mediaNode = media.create({
    id,
    type: 'file',
    collection,
    width: width / scaleFactor,
    height: height / scaleFactor,
    __key: id,
  });

  copyOptionalAttrsFromMediaState(mediaState, mediaNode);
  return mediaSingle.create({}, mediaNode);
};
