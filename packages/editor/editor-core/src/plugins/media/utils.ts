import {
  atTheEndOfBlock,
  atTheBeginningOfBlock,
  endPositionOfParent,
  startPositionOfParent,
} from '../../utils';
import { ResolvedPos, Fragment } from 'prosemirror-model';
import { EditorState, NodeSelection } from 'prosemirror-state';

export const posOfMediaGroupNearby = (
  state: EditorState,
): number | undefined => {
  return (
    posOfParentMediaGroup(state) ||
    posOfFollowingMediaGroup(state) ||
    posOfPreceedingMediaGroup(state)
  );
};

export const isSelectionNonMediaBlockNode = (state: EditorState): boolean => {
  const { node } = state.selection as NodeSelection;

  return node && node.type !== state.schema.nodes.media && node.isBlock;
};

export const posOfPreceedingMediaGroup = (
  state: EditorState,
): number | undefined => {
  if (!atTheBeginningOfBlock(state)) {
    return;
  }

  return posOfMediaGroupAbove(state, state.selection.$from);
};

const posOfFollowingMediaGroup = (state: EditorState): number | undefined => {
  if (!atTheEndOfBlock(state)) {
    return;
  }
  return posOfMediaGroupBelow(state, state.selection.$to);
};

const posOfMediaGroupAbove = (
  state: EditorState,
  $pos: ResolvedPos,
): number | undefined => {
  let adjacentPos;
  let adjacentNode;

  if (isSelectionNonMediaBlockNode(state)) {
    adjacentPos = $pos.pos;
    adjacentNode = $pos.nodeBefore;
  } else {
    adjacentPos = startPositionOfParent($pos) - 1;
    adjacentNode = state.doc.resolve(adjacentPos).nodeBefore;
  }

  if (adjacentNode && adjacentNode.type === state.schema.nodes.mediaGroup) {
    return adjacentPos - adjacentNode.nodeSize + 1;
  }
};

/**
 * Determine whether the cursor is inside empty paragraph
 * or the selection is the entire paragraph
 */
export const isInsidePotentialEmptyParagraph = (
  state: EditorState,
): boolean => {
  const { $from } = state.selection;

  return (
    $from.parent.type === state.schema.nodes.paragraph &&
    atTheBeginningOfBlock(state) &&
    atTheEndOfBlock(state)
  );
};

export const posOfMediaGroupBelow = (
  state: EditorState,
  $pos: ResolvedPos,
  prepend: boolean = true,
): number | undefined => {
  let adjacentPos;
  let adjacentNode;

  if (isSelectionNonMediaBlockNode(state)) {
    adjacentPos = $pos.pos;
    adjacentNode = $pos.nodeAfter;
  } else {
    adjacentPos = endPositionOfParent($pos);
    adjacentNode = state.doc.nodeAt(adjacentPos);
  }

  if (adjacentNode && adjacentNode.type === state.schema.nodes.mediaGroup) {
    return prepend ? adjacentPos + 1 : adjacentPos + adjacentNode.nodeSize - 1;
  }
};

export const posOfParentMediaGroup = (
  state: EditorState,
  $pos?: ResolvedPos,
  prepend: boolean = true,
): number | undefined => {
  const { $from } = state.selection;
  $pos = $pos || $from;

  if ($pos.parent.type === state.schema.nodes.mediaGroup) {
    return prepend
      ? startPositionOfParent($pos)
      : endPositionOfParent($pos) - 1;
  }
};

/**
 * Typescript only supports `padStart` with target ES2017
 */
const padZero = (n: number) => (n < 10 ? `0${n}` : `${n}`);

/**
 * Append timestamp to a filename, this function assumes `name` will have
 * filename and extension. eg.- 123.xyz (valid), 123 (invalid)
 * @param name filename with extension
 * @param time unix timestamp
 */
export const appendTimestamp = (name: string, time: number) => {
  const pos = name.lastIndexOf('.');
  const fileName = name.substring(0, pos);
  const extension = name.substring(pos);

  const date = new Date(time);
  const formattedDate = `${date.getUTCFullYear()}${padZero(
    date.getUTCMonth() + 1,
  )}${padZero(date.getUTCDate())}`;
  const formattedTime = `${padZero(date.getUTCHours())}${padZero(
    date.getUTCMinutes(),
  )}${padZero(date.getUTCSeconds())}`;

  return `${fileName}-${formattedDate}-${formattedTime}${extension}`;
};

/**
 * The function will return the position after current selection where mediaGroup can be inserted.
 */
export function endPositionForMedia(
  state: EditorState,
  resolvedPos: ResolvedPos,
): number {
  const { mediaGroup } = state.schema.nodes;
  let i = resolvedPos.depth;
  for (; i > 1; i--) {
    const nodeType = resolvedPos.node(i).type;
    if (nodeType.validContent(Fragment.from(mediaGroup.create()))) {
      break;
    }
  }
  return resolvedPos.end(i) + 1;
}
