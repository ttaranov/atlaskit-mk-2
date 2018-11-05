import { NodeSpec } from 'prosemirror-model';
import { BlockContent } from './doc';

/**
 * @name layoutColumn_node
 * @stage 0
 */
export interface LayoutColumnDefinition {
  type: 'layoutColumn';
  attrs: {
    /**
     * @minimum 0
     * @maximum 100
     */
    width: number;
  };

  /**
   * @minItems 1
   */
  content: Array<BlockContent>;
}

export const layoutColumn: NodeSpec = {
  content: 'block+',
  isolating: true,
  marks: 'alignment',
  attrs: {
    width: {
      default: undefined,
    },
  },
  parseDOM: [
    {
      context: 'layoutColumn//',
      tag: 'div[data-layout-column]',
      skip: true,
    },
    {
      tag: 'div[data-layout-column]',
      getAttrs: (dom: HTMLElement) => {
        return {
          width: Number(dom.getAttribute('data-column-width')) || undefined,
        };
      },
    },
  ],
  toDOM(node) {
    const attrs = { 'data-layout-column': 'true' };
    const { width } = node.attrs;
    if (width) {
      attrs['style'] = `flex-basis: ${width}%`;
      attrs['data-column-width'] = width;
    }

    return ['div', attrs, 0];
  },
};
