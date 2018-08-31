import { NodeSpec } from 'prosemirror-model';
import { TopLevel } from './doc';

/**
 * @name layoutColumn_node
 */
export interface LayoutColumnDefinition {
  type: 'layoutColumn';
  /**
   * @minItems 1
   */
  content: TopLevel[];
}

export const layoutColumn: NodeSpec = {
  content: 'block+',
  isolating: true,
  parseDOM: [
    {
      context: 'layoutSection//|layoutColumn//',
      tag: 'div[data-layout-column]',
      skip: true,
    },
    {
      tag: 'div[data-layout-column]',
    },
  ],
  toDOM() {
    const attrs = { 'data-layout-column': 'true' };
    return ['div', attrs, 0];
  },
};
