import { NodeSpec } from 'prosemirror-model';
import { MediaDefinition as Media } from './media';
import { CaptionDefinition as Caption } from './figure';

/**
 * @name mediaGroup_node
 */
export interface MediaGroupDefinition {
  type: 'mediaGroup';
  /**
   * @minItems 1
   */
  content: Array<Media | Caption>;
}

export const mediaGroup: NodeSpec = {
  inline: false,
  group: 'block',
  content: 'media+ caption?',
  attrs: {},
  parseDOM: [
    {
      tag: 'div[data-node-type="mediaGroup"]',
      getAttrs: (dom: Element) => ({}),
    },
  ],

  toDOM() {
    return [
      'div',
      {
        'data-node-type': 'mediaGroup',
      },
      0,
    ];
  },
};
