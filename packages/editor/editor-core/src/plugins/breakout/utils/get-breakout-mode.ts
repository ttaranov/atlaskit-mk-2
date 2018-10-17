import { EditorState } from 'prosemirror-state';
import { findParentNode } from 'prosemirror-utils';

export function getBreakoutMode(state: EditorState) {
  const node = findParentNode(node => node.type.name === 'codeBlock')(
    state.selection,
  );

  if (!node) {
    return;
  }

  const breakoutMark = node.node.marks.find(m => m.type.name === 'breakout');

  if (!breakoutMark) {
    return 'center';
  }

  return breakoutMark.attrs.mode;
}
