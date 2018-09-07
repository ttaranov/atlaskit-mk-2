import {
  TextColorDefinition,
  TextColorAttributes,
} from '@atlaskit/editor-common';
import { applyMark } from '../utils/apply-mark';
import { WithMark } from '../types';

export const textColor = (attrs: TextColorAttributes) => (
  maybeNode: WithMark | string,
) => applyMark<TextColorDefinition>({ type: 'textColor', attrs }, maybeNode);
