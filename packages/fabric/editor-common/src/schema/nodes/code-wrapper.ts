import { NodeSpec, Node } from 'prosemirror-model';

export const codeWrapper: NodeSpec = {
  group: 'block',
  content: 'codeBlock+',
  attrs: {
    'data-code-wrapper': { default: 'true' },
  },
  parseDOM: [
    {
      tag: 'div[data-code-wrapper]',
    },
  ],
  toDOM(node: Node) {
    const attrs = {
      'data-code-wrapper': 'true',
    };
    return ['div', attrs, 0];
  },
};
