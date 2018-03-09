import { NodeSpec } from 'prosemirror-model';
import { nodes } from 'prosemirror-schema-basic';

/**
 * @name text_node
 */
export interface Definition {
  type: 'text';
  /**
   * @minLength 1
   */
  text: string;
  marks?: object;
}

export const text: NodeSpec = nodes.text;
