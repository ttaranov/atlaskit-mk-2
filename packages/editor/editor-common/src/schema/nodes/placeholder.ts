import { Node, NodeSpec } from 'prosemirror-model';

/**
 * @name placeholder_node
 */
export interface PlaceholderDefinition {
  type: 'placeholder';
  attrs: {
    text: string;
  };
}

export const placeholder: NodeSpec = {
  inline: true,
  group: 'inline',
  selectable: false,
  marks: '',
  attrs: {
    text: { default: '' },
  },
  parseDOM: [
    {
      tag: 'span[data-placeholder]',
      getAttrs: (dom: Element) => ({
        text:
          dom.getAttribute('data-placeholder') ||
          placeholder.attrs!.text.default,
      }),
    },
  ],
  toDOM(node: Node) {
    const { text } = node.attrs;
    const attrs = {
      'data-placeholder': text,
      contenteditable: 'false',
    };
    return ['span', attrs, text];
  },
};
