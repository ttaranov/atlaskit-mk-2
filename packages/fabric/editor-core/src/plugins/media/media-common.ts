import { deleteSelection, splitBlock } from 'prosemirror-commands';
import { Node as PMNode } from 'prosemirror-model';
import { NodeSelection } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { createParagraphNear } from '../../commands';
import { moveLeft, atTheBeginningOfDoc, isTemporary } from '../../utils';
import { ProsemirrorGetPosHandler } from '../../nodeviews';

export const removeMediaNode = (view: EditorView, node: PMNode, getPos: ProsemirrorGetPosHandler) => {
  const { id } = node.attrs;
  const { state } = view;
  const { tr, selection, doc } = state;

  const currentMediaNodePos = getPos();
  tr.deleteRange(currentMediaNodePos, currentMediaNodePos + node.nodeSize);

  if (isTemporary(id)) {
    tr.setMeta('addToHistory', false);
  }

  view.dispatch(tr);

  const $currentMediaNodePos = doc.resolve(currentMediaNodePos);
  const isLastMediaNode = $currentMediaNodePos.index() === $currentMediaNodePos.parent.childCount - 1;

  // If deleting a selected media node, we need to tell where the cursor to go next.
  // Prosemirror didn't gave us the behaviour of moving left if the media node is not the last one.
  // So we handle it ourselves.
  if (selection.from === currentMediaNodePos && !isLastMediaNode && !atTheBeginningOfDoc(state)) {
    moveLeft(view);
  }
};

export const splitMediaGroup = (view: EditorView): boolean => {
  const { selection } = view.state;

  // if selection is not a media node, do nothing.
  if (!(selection instanceof NodeSelection) || selection.node.type !== view.state.schema.nodes.media) {
    return false;
  }

  deleteSelection(view.state, view.dispatch);

  // if selected media node is the last one, no need to insert a new p or split the block, prosemirror handled it.
  if (selection.$to.nodeAfter) {
    splitBlock(view.state, view.dispatch);
    createParagraphNear(view, false);
  }

  return true;
};
