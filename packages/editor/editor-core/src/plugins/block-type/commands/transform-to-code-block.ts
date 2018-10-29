import { EditorState, Transaction } from 'prosemirror-state';
import { safeInsert } from 'prosemirror-utils';

export function transformToCodeBlockAction(
  state: EditorState,
  attrs?: any,
  newStart?,
  end?,
): Transaction {
  let { tr } = state;
  tr = tr.delete(newStart, end);
  const codeBlock = state.schema.nodes.codeBlock.createChecked();
  return safeInsert(codeBlock)(tr);
}
