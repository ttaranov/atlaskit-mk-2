import { Schema } from 'prosemirror-model';
import { createRuleNode } from '../nodes/rule';
import { Token } from './';

export function ruler(input: string, schema: Schema): Token {
  return {
    type: 'pmnode',
    nodes: createRuleNode(input, schema),
    length: 4,
  };
}
