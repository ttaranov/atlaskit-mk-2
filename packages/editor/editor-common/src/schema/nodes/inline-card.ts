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
 * @name inlineCard_node
 * @stage 0
 */
export interface InlineCardDefinition {
  type: 'inlineCard';
  attrs: CardAttributes;
}

export const inlineCard: NodeSpec = {
  inline: true,
  group: 'inline',
  selectable: true,
  attrs: {
    url: { default: '' },
    data: { default: null },
  },
  parseDOM: [
    {
      tag: 'span[data-card-url]',
      getAttrs: (dom: HTMLElement) => ({
        url: dom.getAttribute('data-card-url'),
        data: JSON.parse(dom.getAttribute('data-card-data') || '{}'),
      }),
    },
  ],
  toDOM(node: PMNode) {
    const attrs = {
      'data-card-url': node.attrs.url,
      'data-card-data': JSON.stringify(node.attrs.data),
    };
    return ['span', attrs];
  },
};
