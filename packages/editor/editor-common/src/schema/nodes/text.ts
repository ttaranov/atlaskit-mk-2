import { NodeSpec } from 'prosemirror-model';

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

export const text: NodeSpec = {
  group: 'inline',
};
