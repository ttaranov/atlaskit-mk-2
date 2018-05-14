import { NodeSpec } from 'prosemirror-model';
import { Definition as ListItemNode } from './list-item';

/**
 * @name orderedList_node
 */
export interface Definition {
  type: 'orderedList';
  /**
   * @minItems 1
   */
  content: Array<ListItemNode>;
  attrs?: {
    /**
     * @minimum 1
     */
    order: number;
  };
}

export const orderedList: NodeSpec = {
  group: 'block',
  content: 'listItem+',
  attrs: {
    order: {
      default: 1,
    },
  },
  parseDOM: [
    {
      tag: 'ol',
      getAttrs: (dom: Element) => {
        const order =
          dom.getAttribute('start') || orderedList.attrs!.order.default;
        return { order };
      },
    },
  ],
  toDOM(node) {
    return ['ol', { start: node.attrs.order }, 0];
  },
};
