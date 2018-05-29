import { NodeSpec, Node } from 'prosemirror-model';
import { Definition as Media } from './media';

export type Layout =
  | 'wrap-right'
  | 'center'
  | 'wrap-left'
  | 'wide'
  | 'full-width';

/**
 * @name mediaSingle_node
 */
export interface Definition {
  type: 'mediaSingle';
  /**
   * @minItems 1
   * @maxItems 1
   */
  content: Array<Media>;
  attrs?: Attributes;
}
export interface Attributes {
  layout: Layout;
}

export const defaultAttrs = {
  layout: { default: 'center' },
};

export const mediaSingle: NodeSpec = {
  inline: false,
  group: 'block',
  content: 'media',
  attrs: defaultAttrs,
  draggable: true,
  parseDOM: [
    {
      tag: 'div[data-node-type="mediaSingle"]',
      getAttrs: (dom: HTMLElement) => ({
        layout: dom.getAttribute('data-layout') || 'center',
      }),
    },
  ],
  toDOM(node: Node) {
    const { layout } = node.attrs;
    const attrs = {
      'data-node-type': 'mediaSingle',
      'data-layout': layout,
    };
    return ['div', attrs, 0];
  },
};
