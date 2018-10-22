import { NodeSpec, DOMOutputSpec } from 'prosemirror-model';
import { Inline } from './doc';

/**
 * @name paragraph_node
 */
export interface ParagraphDefinition {
  type: 'paragraph';
  /**
   * @allowUnsupportedInline true
   */
  content: Array<Inline>;
}

const pDOM: DOMOutputSpec = ['p', 0];
export const paragraph: NodeSpec = {
  content: 'inline*',
  group: 'block',
  parseDOM: [{ tag: 'p' }],
  toDOM() {
    return pDOM;
  },
};
