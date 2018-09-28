import { NodeSpec, Node as PMNode } from 'prosemirror-model';

export interface UrlType {
  url: string;
}

export interface DataType {
  /**
   * @additionalProperties true
   */
  data: object;
}

export type CardAttributes = UrlType | DataType;

/**
 * @name blockCard_node
 * @stage 0
 */
export interface BlockCardDefinition {
  type: 'blockCard';
  attrs: CardAttributes;
}

export const blockCard: NodeSpec = {
  inline: false,
  group: 'block',
  attrs: {
    url: { default: '' },
    data: { default: null },
  },
  parseDOM: [
    {
      tag: 'div[data-block-card-url]',
      getAttrs: dom => ({
        url: (dom as HTMLElement).getAttribute('data-block-card-url'),
        data: JSON.parse(
          (dom as HTMLElement).getAttribute('data-block-card-data') || '{}',
        ),
      }),
    },
  ],
  toDOM(node: PMNode) {
    const attrs = {
      'data-block-card-url': node.attrs.url,
      'data-block-card-data': JSON.stringify(node.attrs.data),
    };
    return ['div', attrs];
  },
};
