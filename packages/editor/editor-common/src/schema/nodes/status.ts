import { NodeSpec, Node as PMNode } from 'prosemirror-model';

/**
 * @name status_node
 * @stage 0
 */
export interface StatusDefinition {
  type: 'status';
  attrs: {
    /**
     * @minLength 1
     */
    text: string;
    color: 'neutral' | 'purple' | 'blue' | 'red' | 'yellow' | 'green';
    localId: string;
  };
}

export const status: NodeSpec = {
  inline: true,
  group: 'inline',
  selectable: true,
  attrs: {
    text: { default: '' },
    color: { default: '' },
    localId: { default: '' },
  },
  parseDOM: [
    {
      tag: 'span[data-node-type="status"]',
      getAttrs: (dom: HTMLElement) => ({
        text: dom.textContent!.replace(/\n/, '').trim(),
        color: dom.getAttribute('data-color'),
        localId: dom.getAttribute('data-local-id'),
      }),
    },
  ],
  toDOM(node: PMNode) {
    const { text, color, localId } = node.attrs;

    const attrs = {
      'data-node-type': 'status',
      'data-color': color,
      'data-local-id': localId,
    };
    return ['span', attrs, text];
  },
};
