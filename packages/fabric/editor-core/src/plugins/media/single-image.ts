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

export const insertMediaAsSingleImage = (
  view: EditorView,
  node: PMNode,
): boolean => {
  const { state, dispatch } = view;
  const { singleImage, media } = state.schema.nodes;

  if (!singleImage) {
    return false;
  }

  // if not an image type media node
  if (node.type !== media || !isImage(node.attrs.__fileMimeType)) {
    return false;
  }

  const singleImageNode = singleImage.create({}, node);
  const nodes = [singleImageNode];

  return insertNodesEndWithNewParagraph(nodes)(state, dispatch);
};

export const insertSingleImages = (
  view: EditorView,
  mediaStates: MediaState[],
  collection?: string,
): void => {
  const { state, dispatch } = view;

  const { singleImage, media } = state.schema.nodes;

  if (!collection || !media || !singleImage) {
    return;
  }

  const nodes = createSingleImageNodes(
    mediaStates,
    collection,
    singleImage,
    media,
  );

  insertNodesEndWithNewParagraph(nodes)(state, dispatch);
};

const createSingleImageNodes = (
  mediaStates: MediaState[],
  collection: string,
  singleImage: NodeType,
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

    const singleImageNode = singleImage.create({}, mediaNode);

    return singleImageNode;
  });

  return nodes;
};
