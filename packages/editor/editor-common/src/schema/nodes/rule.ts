import { NodeSpec } from 'prosemirror-model';
import { nodes } from 'prosemirror-schema-basic';

/**
 * @name rule_node
 */
export interface Definition {
  type: 'rule';
}

export const rule: NodeSpec = nodes.horizontal_rule;
