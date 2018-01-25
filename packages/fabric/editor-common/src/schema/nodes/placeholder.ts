import { Node, NodeSpec } from 'prosemirror-model';

export const placeholder: NodeSpec = {
  inline: true,
  group: 'inline',
  selectable: false,
  atom: true,
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
    };
    return ['span', attrs];
  },
};
