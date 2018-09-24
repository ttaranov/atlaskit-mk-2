import { NodeSpec, Node } from 'prosemirror-model';
import { MediaDefinition as Media } from './media';

export type Layout =
  | 'wrap-right'
  | 'center'
  | 'wrap-left'
  | 'wide'
  | 'full-width';

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
  /**
   * @stage 0
   * @minimum 0
   * @maximum 100
   */
  width?: number;
  layout: Layout;
}

export const defaultAttrs = {
  width: { default: null },
  layout: { default: 'center' },
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
        width: Number(dom.getAttribute('data-width')) || null,
      }),
    },
  ],
  toDOM(node: Node) {
    const { layout, width } = node.attrs;
    const attrs = {
      'data-node-type': 'mediaSingle',
      'data-layout': layout,
    };

    if (width) {
      attrs['data-width'] =
        isFinite(width) && Math.floor(width) === width
          ? width
          : width.toFixed(2);
    }

    return ['div', attrs, 0];
  },
};

export const toJSON = (node: Node) => ({
  attrs: Object.keys(node.attrs).reduce((obj, key) => {
    if (node.attrs[key] !== null) {
      obj[key] = node.attrs[key];
    }
    return obj;
  }, {}),
});
