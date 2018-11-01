import { NodeSpec } from 'prosemirror-model';
import { LayoutColumnDefinition } from './layout-column';

/**
 * @name layoutSection_node
 * @stage 0
 */
export interface LayoutSectionDefinition {
  type: 'layoutSection';

  /**
   * @minItems 1
   */
  content: LayoutColumnDefinition[];
}

export const layoutSection: NodeSpec = {
  content: 'layoutColumn{2,3}',
  isolating: true,
  parseDOM: [
    {
      context: 'layoutSection//|layoutColumn//',
      tag: 'div[data-layout-section]',
      skip: true,
    },
    {
      tag: 'div[data-layout-section]',
    },
  ],
  toDOM() {
    const attrs = { 'data-layout-section': 'true' };
    return ['div', attrs, 0];
  },
};
