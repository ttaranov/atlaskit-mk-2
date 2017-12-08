import { Node as PMNode, NodeType } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import { Alignment, Display } from '@atlaskit/editor-common';
import { MediaState } from '@atlaskit/media-core';
import { isImage } from '../../utils';
import { insertNodesEndWithNewParagraph } from '../../commands';

export function textAlign(alignment: Alignment, display: Display): string {
  if (display !== 'block') {
    return 'left';
  }
  return alignment;
}

export function float(alignment: Alignment, display: Display): string {
  if (display === 'block') {
    return 'none';
  }

  return alignment === 'right' ? 'right' : 'left';
}

export function clear(alignment: Alignment, display: Display): string {
  if (display === 'block') {
    return 'both';
  }

  return alignment === 'center' ? 'both' : alignment;
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
): PMNode[] => {
  const nodes = mediaStates.map(mediaState => {
    const { id } = mediaState;

    const mediaNode = media.create({
      id,
      type: 'file',
      collection,
      __fileMimeType: mediaState.fileMimeType,
    });

    const mediaSingleNode = mediaSingle.create({}, mediaNode);

    return mediaSingleNode;
  });

  return nodes;
};
