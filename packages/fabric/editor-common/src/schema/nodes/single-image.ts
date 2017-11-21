import { NodeSpec, Node } from 'prosemirror-model';

export type Alignment = 'left' | 'right' | 'center';
export type Display = 'inline-block' | 'block';
import { Definition as Media } from './media';

/**
 * @name singleImage_node
 */
export interface Definition {
  type: 'singleImage';
  content: Media;
  attrs: Attributes;
}
export interface Attributes {
  alignment: Alignment;
  display: Display;
}

export const defaultAttrs = {
  alignment: { default: 'center' },
  display: { default: 'block' },
};

export const singleImage: NodeSpec = {
  inline: false,
  group: 'block',
  content: 'media',
  attrs: defaultAttrs,
  parseDOM: [
    {
      tag: 'div[data-node-type="singleImage"]',
      getAttrs: (dom: HTMLElement) => ({
        alignment: dom.getAttribute('data-alignment'),
        display: dom.getAttribute('data-display'),
      }),
    },
  ],
  toDOM(node: Node) {
    const { alignment, display } = node.attrs;
    const attrs = {
      'data-node-type': 'singleImage',
      'data-alignment': alignment,
      'data-display': display,
    };
    return ['div', attrs, 0];
  },
};
