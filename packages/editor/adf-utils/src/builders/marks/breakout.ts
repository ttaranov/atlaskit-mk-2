import {
  BreakoutMarkAttrs,
  BreakoutMarkDefinition,
  CodeBlockDefinition,
} from '@atlaskit/editor-common';
import { applyMark } from '../utils/apply-mark';
import { WithAppliedMark } from '../types';

export const breakout = (attrs: BreakoutMarkAttrs) => (
  maybeNode: CodeBlockDefinition,
) => {
  return applyMark<BreakoutMarkDefinition>(
    { type: 'breakout', attrs },
    maybeNode,
  ) as WithAppliedMark<CodeBlockDefinition, BreakoutMarkDefinition>;
};
