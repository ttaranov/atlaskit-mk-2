import { EmDefinition } from '@atlaskit/editor-common';
import { applyMark } from '../utils/apply-mark';
import { WithMark } from '../types';

export const em = (maybeNode: WithMark | string) => {
  return applyMark<EmDefinition>({ type: 'em' }, maybeNode);
};
