import { NodeSpec, Node as PMNode } from 'prosemirror-model';
import { TopLevel } from './doc';

export interface Definition {
  type: 'extension';
  attrs: {
    bodyType: 'none' | 'plain' | 'rich';
    extensionKey: string;
    extensionType: string;
    parameters?: object;
    text?: string;
  };
  content: TopLevel;
}

export const extension: NodeSpec = {
  inline: false,
  group: 'block',
  content: 'block*',
  selectable: true,
  attrs: {
    extensionType: { default: '' },
    extensionKey: { default: '' },
    bodyType: { default: 'none' },
    parameters: { default: null },
    text: { default: null },
  },
  parseDOM: [
    {
      tag: 'div[data-extension-type]',
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
      'data-body-type': node.attrs.bodyType,
      'data-text': node.attrs.text,
      'data-parameters': JSON.stringify(node.attrs.parameters),
    };
    return ['div', attrs, 0];
  },
};
