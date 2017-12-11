import { NodeSpec, Node as PMNode } from 'prosemirror-model';

/**
 * @name extension_node
 */
export interface Definition {
  type: 'extension';
  attrs: {
    /**
     * @minLength 1
     */
    extensionKey: string;
    /**
     * @minLength 1
     */
    extensionType: string;
    parameters?: object;
    text?: string;
  };
}

export const extension: NodeSpec = {
  inline: false,
  group: 'block',
  atom: true,
  selectable: true,
  attrs: {
    extensionType: { default: '' },
    extensionKey: { default: '' },
    parameters: { default: null },
    text: { default: null },
  },
  parseDOM: [
    {
      tag: '[data-node-type="extension"]',
      getAttrs: (dom: HTMLElement) => ({
        extensionType: dom.getAttribute('data-extension-type'),
        extensionKey: dom.getAttribute('data-extension-key'),
        text: dom.getAttribute('data-text'),
        parameters: JSON.parse(dom.getAttribute('data-parameters') || '{}'),
      }),
    },
  ],
  toDOM(node: PMNode) {
    const attrs = {
      'data-node-type': 'extension',
      'data-extension-type': node.attrs.extensionType,
      'data-extension-key': node.attrs.extensionKey,
      'data-text': node.attrs.text,
      'data-parameters': JSON.stringify(node.attrs.parameters),
    };
    return ['div', attrs];
  },
};
