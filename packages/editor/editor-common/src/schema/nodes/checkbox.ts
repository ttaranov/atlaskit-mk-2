import { NodeSpec, Node } from 'prosemirror-model';

/**
 * @name checkbox_node
 */
export interface CheckboxDefinition {
  type: 'checkbox';
}

export const checkbox: NodeSpec = {
  group: 'inline',
  inline: true,
  attrs: {
    checked: { default: false },
  },
  parseDOM: [
    {
      tag: "input[type='checkbox']",
      getAttrs(dom: HTMLElement) {
        return {
          checked: dom.hasAttribute('checked')
            ? dom.getAttribute('checked') === 'checked'
            : false,
        };
      },
    },
  ],
  toDOM(node: Node) {
    const attrs = {
      type: 'checkbox',
    };

    if (node.attrs.checked) {
      attrs['checked'] = 'checked';
    }
    return ['input', attrs];
  },
};
