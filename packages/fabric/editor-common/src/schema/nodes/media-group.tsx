import { NodeSpec } from 'prosemirror-model';
import { Definition as Media } from './media';

/**
 * @name mediaGroup_node
 */
export interface Definition {
  type: 'mediaGroup';
  /**
   * @minItems 1
   */
  content: Array<Media>;
}

export const mediaGroup: NodeSpec = {
  inline: false,
  group: 'block',
  content: 'media+',
  attrs: {},
  parseDOM: [{
    tag: 'div[data-node-type="mediaGroup"]',
    getAttrs: (dom: Element) => ({})
  }],

  toDOM(node: any) {
    return [
      'div',
      {
        'data-node-type': 'mediaGroup'
      },
      0
    ];
  }
};
