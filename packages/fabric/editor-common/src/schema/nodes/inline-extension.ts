import { NodeSpec, Node as PMNode } from 'prosemirror-model';

export interface Definition {
  type: 'inlineExtension';
  attrs: {
    extensionKey: string;
    extensionType: string;
    parameters?: object;
    text?: string;
  };
}

export const inlineExtension: NodeSpec = {
  inline: true,
  group: 'inline',
  selectable: true,
  attrs: {
    extensionType: { default: '' },
    extensionKey: { default: '' },
    parameters: { default: null },
    text: { default: null },
  },
  parseDOM: [
    {
      tag: 'span[data-extension-type]',
      getAttrs: (dom: HTMLElement) => ({
        extensionType: dom.getAttribute('data-extension-type'),
        extensionKey: dom.getAttribute('data-extension-key'),
        bodyType: dom.getAttribute('data-body-type'),
        text: dom.getAttribute('data-text'),
        parameters: JSON.parse(dom.getAttribute('data-parameters') || '{}'),
      }),
    },
  ],
  toDOM(node: PMNode) {
    const attrs = {
      'data-extension-type': node.attrs.extensionType,
      'data-extension-key': node.attrs.extensionKey,
      'data-text': node.attrs.text,
      'data-parameters': JSON.stringify(node.attrs.parameters),
    };
    return ['span', attrs];
  },
};
