import { NodeSpec } from 'prosemirror-model';
import { nodes } from 'prosemirror-schema-basic';
import { Inline } from './doc';

/**
 * @name paragraph_node
 */
export interface Definition {
  type: 'paragraph';
  content: Array<Inline>;
}

export const paragraph: NodeSpec = nodes.paragraph;
