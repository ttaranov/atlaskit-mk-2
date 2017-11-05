import { NodeSpec } from 'prosemirror-model';
import { Definition as Paragraph } from './paragraph';

/**
 * @name blockquote_node
 */
export interface Definition {
  type: 'blockquote';
  /**
   * @minItems 1
   */
  content: Array<Paragraph>;
}

export const blockquote: NodeSpec = {
  content: 'paragraph+',
  group: 'block',
  defining: true,
  selectable: false,
  parseDOM: [{ tag: 'blockquote' }],
  toDOM() { return ['blockquote', 0]; }
};
