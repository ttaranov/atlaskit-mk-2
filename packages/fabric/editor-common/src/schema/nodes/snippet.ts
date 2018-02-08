import { Node, NodeSpec } from 'prosemirror-model';

export const snippet: NodeSpec = {
  inline: true,
  group: 'inline',
  selectable: false,
  marks: '',
  attrs: {
    id: { default: '' },
  },
  parseDOM: [
    {
      tag: 'span[data-snippet-id]',
      getAttrs: (dom: Element) => ({
        text: dom.getAttribute('data-snippet-id') || snippet.attrs!.id.default,
      }),
    },
  ],
  toDOM(node: Node) {
    const { id } = node.attrs;
    const attrs = {
      'data-snippet-id': id,
      contenteditable: 'false',
    };
    return ['span', attrs, id];
  },
};
