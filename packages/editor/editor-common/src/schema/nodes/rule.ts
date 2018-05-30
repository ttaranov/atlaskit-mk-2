import { NodeSpec, DOMOutputSpec } from 'prosemirror-model';

/**
 * @name rule_node
 */
export interface Definition {
  type: 'rule';
}

const hrDOM: DOMOutputSpec = ['hr', { draggable: true }];
export const rule: NodeSpec = {
  group: 'block',
  parseDOM: [{ tag: 'hr' }],
  draggable: true,
  toDOM() {
    return hrDOM;
  },
};
