import { EditorState } from 'prosemirror-state';
import { findParentNode } from 'prosemirror-utils';
import { BreakoutMode } from '../commands/set-breakout-mode';

export function getBreakoutMode(state: EditorState): BreakoutMode | undefined {
  const node = findParentNode(node => node.type.name === 'codeBlock')(
    state.selection,
  );

  if (!node) {
    return;
  }

  const breakoutMark = node.node.marks.find(m => m.type.name === 'breakout');

  if (!breakoutMark) {
    return;
  }

  return breakoutMark.attrs.mode;
}
