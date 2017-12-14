import { Node as PMNode, NodeType } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import { MediaState } from '@atlaskit/media-core';
import { isImage } from '../../utils';
import { insertNodesEndWithNewParagraph } from '../../commands';

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

export const insertMediaSingleNodes = (
  view: EditorView,
  mediaStates: MediaState[],
  collection?: string,
): void => {
  const { state, dispatch } = view;

  const { mediaSingle, media } = state.schema.nodes;

  if (!collection || !media || !mediaSingle) {
    return;
  }

  const nodes = createMediaSingleNodes(
    mediaStates,
    collection,
    mediaSingle,
    media,
  );

  insertNodesEndWithNewParagraph(nodes)(state, dispatch);
};

const createMediaSingleNodes = (
  mediaStates: MediaState[],
  collection: string,
  mediaSingle: NodeType,
  media: NodeType,
): PMNode[] =>
  mediaStates.map(mediaState => {
    const { id } = mediaState;

    const mediaNode = media.create({
      id,
      type: 'file',
      collection,
      __fileMimeType: mediaState.fileMimeType,
    });

    return mediaSingle.create({}, mediaNode);
  });
