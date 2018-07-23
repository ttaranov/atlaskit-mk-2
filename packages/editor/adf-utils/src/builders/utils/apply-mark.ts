import { TextDefinition } from '@atlaskit/editor-common';
import { createTextFromString } from './create-text-nodes';
import { isDuplicateMark, duplicateMarkError } from './is-duplicate-mark';
import { WithMark } from '../types';

export function applyMark<T>(
  mark: T & { type: string },
  maybeNode: WithMark | string,
) {
  const node: TextDefinition | WithMark = createTextFromString(maybeNode);
  if (isDuplicateMark(node, mark.type)) {
    // tslint:disable-next-line
    console.error(duplicateMarkError(node, mark.type));
    return node;
  }

  node.marks = node.marks || [];
  node.marks.push(mark);
  return node;
}
