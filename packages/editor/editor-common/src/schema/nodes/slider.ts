import { NodeSpec, Node } from 'prosemirror-model';

export const slider: NodeSpec = {
  group: 'inline',
  inline: true,
  attrs: {
    value: { default: 0 },
  },
  parseDOM: [
    {
      tag: 'input[type="range"]',
      getAttrs(dom: HTMLElement) {
        return {
          value: parseInt(dom.getAttribute('value') || '0', 10),
        };
      },
    },
  ],
  toDOM(node: Node) {
    const attrs = {
      type: 'range',
    };
    return ['input', attrs];
  },
};
