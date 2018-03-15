import { keymap } from 'prosemirror-keymap';
import { Schema } from 'prosemirror-model';
import { EditorState, Plugin, Transaction } from 'prosemirror-state';
import * as keymaps from '../../../keymaps';
import { isEmptyNode } from '../../../utils';

/**
 * When there's any empty block before another paragraph with wrap-right
 * mediaSingle. Pressing backspace at the start of the paragraph will select
 * the media but visually it makes more sense to remove the empty paragraph.
 *
 * Structure of the document: doc(block(), mediaSingle(media()), paragraph('{<>}hello!'))
 * But, visually it looks like the following:
 *
 * [empty block] <- Remove this block
 * [Cursor] x x x x x x x x  +---------------+
 * x x x x x x x x x x       |  mediaSingle  |
 * x x x x x.                +---------------+
 */
const maybeRemoveMediaSingleNode = (schema: Schema) => {
  const isEmptyNodeInSchema = isEmptyNode(schema);
  return (state: EditorState, dispatch: (tr: Transaction) => void): boolean => {
    const { selection } = state;
    // Check if we have a structure like
    // anyBlock[empty] > mediaSingle[wrap-right] > [selection{empty, at start}]
    if (!selection.empty) {
      return false;
    }

    const { $from } = selection;
    const { doc } = state;
    const index = $from.index($from.depth - 1);

    if ($from.parentOffset > 0) {
      return false;
    }

    const maybeMediaSingle = doc.maybeChild(index - 1);
    if (
      !maybeMediaSingle ||
      maybeMediaSingle.type !== schema.nodes.mediaSingle ||
      maybeMediaSingle.attrs.layout !== 'wrap-right'
    ) {
      return false;
    }

    const maybeAnyBlock = doc.maybeChild(index - 2);
    if (!maybeAnyBlock || !isEmptyNodeInSchema(maybeAnyBlock)) {
      return false;
    }

    const tr = state.tr.replace(index - 2, maybeAnyBlock.nodeSize);
    dispatch(tr);

    return true;
  };
};

export function keymapPlugin(schema: Schema): Plugin {
  const list = {};
  const removeMediaSingleCommand = maybeRemoveMediaSingleNode(schema);

  keymaps.bindKeymapWithCommand(
    keymaps.backspace.common!,
    removeMediaSingleCommand,
    list,
  );

  return keymap(list);
}

export default keymapPlugin;
