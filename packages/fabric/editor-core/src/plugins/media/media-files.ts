import {
  atTheEndOfDoc,
  atTheEndOfBlock,
  atTheBeginningOfBlock,
  endPositionOfParent,
  startPositionOfParent,
  setNodeSelection,
  setTextSelection,
} from '../../utils';

import { Node as PMNode, NodeType } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';

import { MediaState } from '@atlaskit/media-core';
import {
  posOfPreceedingMediaGroup,
  posOfMediaGroupNearby,
  posOfParentMediaGroup,
  isSelectionNonMediaBlockNode,
  isInsidePotentialEmptyParagraph,
} from './utils';
import { unsupportedNodeTypesForMediaCards } from '@atlaskit/editor-common';
import analyticsService from '../../analytics/service';

export interface Range {
  start: number;
  end: number;
}

export const insertFilmstrip = (
  view: EditorView,
  mediaStates: MediaState[],
  collection?: string,
): void => {
  const { state, dispatch } = view;
  const { $to } = state.selection;
  const { tr, schema } = state;
  const { media, paragraph } = schema.nodes;

  if (!collection || !media) {
    return;
  }

  // Don't support media in unsupported node types
  if (unsupportedNodeTypesForMediaCards.has($to.parent.type.name)) {
    analyticsService.trackEvent('atlassian.editor.media.file.unsupported.node');
    return;
  }

  const nodes = createMediaFileNodes(mediaStates, collection, media);

  // insert a paragraph after if reach the end of doc
  // and there is no media group in the front or selection is a non media block node
  if (
    atTheEndOfDoc(state) &&
    (!posOfPreceedingMediaGroup(state) || isSelectionNonMediaBlockNode(state))
  ) {
    const paragraphInsertPos = isSelectionNonMediaBlockNode(state)
      ? $to.pos
      : $to.pos + 1;
    tr.insert(paragraphInsertPos, paragraph.create());
  }

  const mediaInsertPos = findMediaInsertPos(state);

  // delete the selection or empty paragraph
  const deleteRange = findDeleteRange(state);

  if (!deleteRange) {
    tr.insert(mediaInsertPos, nodes);
  } else if (mediaInsertPos <= deleteRange.start) {
    tr
      .deleteRange(deleteRange.start, deleteRange.end)
      .insert(mediaInsertPos, nodes);
  } else {
    tr
      .insert(mediaInsertPos, nodes)
      .deleteRange(deleteRange.start, deleteRange.end);
  }

  dispatch(tr);

  setSelectionAfterMediaInsertion(view, mediaInsertPos);
};

const createMediaFileNodes = (
  mediaStates: MediaState[],
  collection: string,
  media: NodeType,
): PMNode[] => {
  const nodes = mediaStates.map(mediaState => {
    const { id } = mediaState;

    const node = media.create({
      id,
      type: 'file',
      collection,
    });

    ['fileName', 'fileSize', 'fileMimeType'].forEach(key => {
      if (mediaState[key]) {
        node.attrs[`__${key}`] = mediaState[key];
      }
    });

    return node;
  });

  return nodes;
};

const findMediaInsertPos = (state: EditorState): number => {
  const { $from, $to } = state.selection;

  const nearbyMediaGroupPos = posOfMediaGroupNearby(state);

  if (nearbyMediaGroupPos) {
    return nearbyMediaGroupPos;
  }

  if (isSelectionNonMediaBlockNode(state)) {
    return $to.pos;
  }

  if (atTheEndOfBlock(state)) {
    return $to.pos + 1;
  }

  if (atTheBeginningOfBlock(state)) {
    return $from.pos - 1;
  }

  return $to.pos;
};

const findDeleteRange = (state: EditorState): Range | undefined => {
  const { $from, $to } = state.selection;

  if (posOfParentMediaGroup(state)) {
    return;
  }

  if (!isInsidePotentialEmptyParagraph(state) || posOfMediaGroupNearby(state)) {
    return range($from.pos, $to.pos);
  }

  return range(startPositionOfParent($from) - 1, endPositionOfParent($to));
};

const range = (start: number, end: number = start) => {
  return { start, end };
};

const setSelectionAfterMediaInsertion = (
  view: EditorView,
  insertPos: number,
): void => {
  const { state } = view;
  const { doc } = state;
  const mediaPos = posOfMediaGroupNearby(state);
  if (!mediaPos) {
    return;
  }

  const $mediaPos = doc.resolve(mediaPos);
  const endOfMediaGroup = endPositionOfParent($mediaPos);

  if (endOfMediaGroup + 1 >= doc.nodeSize - 1) {
    // if nothing after the media group, fallback to select the newest uploaded media item
    setNodeSelection(view, mediaPos);
  } else {
    setTextSelection(view, endOfMediaGroup + 1);
  }
};
