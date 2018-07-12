import { Node, NodeSpec } from 'prosemirror-model';
import { DecisionItemDefinition as DecisionItemNode } from './decision-item';
import { uuid } from '../../utils';

/**
 * @name decisionList_node
 */
export interface DecisionListDefinition {
  type: 'decisionList';
  /**
   * @minItems 1
   */
  content: Array<DecisionItemNode>;
  attrs: {
    localId: string;
  };
}

export const decisionList: NodeSpec = {
  group: 'block',
  defining: true,
  content: 'decisionItem+',
  attrs: {
    localId: { default: '' },
  },
  parseDOM: [
    {
      tag: 'ol[data-decision-list-local-id]',

      // Default priority is 50. We normaly don't change this but since this node type is
      // also used by ordered-list we need to make sure that we run this parser first.
      priority: 100,

      getAttrs: (dom: Element) => ({
        localId: uuid.generate(),
      }),
    },
  ],
  toDOM(node: Node) {
    const { localId } = node.attrs;
    const attrs = {
      'data-decision-list-local-id': localId || 'local-decision-list',
      style: 'list-style: none; padding-left: 0',
    };

    return ['ol', attrs, 0];
  },
};
