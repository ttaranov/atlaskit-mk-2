import { NodeSpec, Node } from 'prosemirror-model';
import { MediaDefinition as Media } from './media';

export type Layout =
  | 'wrap-right'
  | 'center'
  | 'wrap-left'
  | 'wide'
  | 'full-width';

export type Scale = 0.5 | 0.75 | 1;

/**
 * @name mediaSingle_node
 */
export interface MediaSingleDefinition {
  type: 'mediaSingle';
  /**
   * @minItems 1
   * @maxItems 1
   */
  content: Array<Media>;
  attrs?: MediaSingleAttributes;
}
export interface MediaSingleAttributes {
  layout: Layout;
}

export const defaultAttrs = {
  layout: { default: 'center' },
  size: { default: '50%' },
};

export const mediaSingle: NodeSpec = {
  inline: false,
  group: 'block',
  content: 'media',
  attrs: defaultAttrs,
  parseDOM: [
    {
      tag: 'div[data-node-type="mediaSingle"]',
      getAttrs: (dom: HTMLElement) => ({
        layout: dom.getAttribute('data-layout') || 'center',
      }),
    },
  ],
  toDOM(node: Node) {
    const { layout, size } = node.attrs;
    const attrs = {
      'data-node-type': 'mediaSingle',
      'data-layout': layout,
      'data-size': size,
    };
    return ['div', attrs, 0];
  },
};
