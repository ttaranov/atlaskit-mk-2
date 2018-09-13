import { Node, NodeSpec } from 'prosemirror-model';

export interface InlineStatusAttributes {
  color?: string;
}

/**
 * @name panel_node
 */
export interface InlineStatusDefinition {
  type: 'inlineStatus';
  attrs: InlineStatusAttributes;
  /**
   * @minItems 1
   */
  content: Array<Text>;
}

export interface DOMAttributes {
  [propName: string]: string;
}

export const inlineStatus: NodeSpec = {
  inline: true,
  group: 'inline',
  content: 'text*',
  selectable: true,
  attrs: {
    color: { default: 'neutral' },
  },
  parseDOM: [
    {
      tag: 'div[data-panel-type]',
      getAttrs: (dom: HTMLElement) => {
        console.log('#parseDOM : ', dom.getAttribute('data-status-color'));
        return {
          color: dom.getAttribute('data-status-color')!,
        };
      },
    },
  ],
  toDOM(node: Node) {
    const color = node.attrs['color'];
    const attrs: DOMAttributes = {
      'data-status-color': color,
    };
    console.log('#toDOM : ', color);
    return ['div', attrs, undefined, ['div', {}, 0]];
  },
};
