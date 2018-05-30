import { NodeSpec, Node as PMNode } from 'prosemirror-model';
import { ExtensionContent } from './doc';

/**
 * @name bodiedExtension_node
 */
export interface Definition {
  type: 'bodiedExtension';
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
  content: ExtensionContent;
}

export const bodiedExtension: NodeSpec = {
  inline: false,
  group: 'block',
  content:
    '(paragraph | panel | blockquote | orderedList | bulletList | rule | heading | codeBlock | mediaGroup | mediaSingle | applicationCard | decisionList | taskList | table | extension)+',
  defining: true,
  selectable: true,
  attrs: {
    extensionType: { default: '' },
    extensionKey: { default: '' },
    parameters: { default: null },
    text: { default: null },
  },
  draggable: true,
  parseDOM: [
    {
      tag: '[data-node-type="bodied-extension"]',
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
      'data-node-type': 'bodied-extension',
      'data-extension-type': node.attrs.extensionType,
      'data-extension-key': node.attrs.extensionKey,
      'data-text': node.attrs.text,
      'data-parameters': JSON.stringify(node.attrs.parameters),
    };
    return ['div', attrs, 0];
  },
};
