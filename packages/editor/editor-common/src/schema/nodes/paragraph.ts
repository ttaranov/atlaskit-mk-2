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
  marks:
    'strong code em link strike subsup textColor typeAheadQuery underline mentionQuery emojiQuery confluenceInlineComment action',
  parseDOM: [{ tag: 'p' }],
  toDOM() {
    return pDOM;
  },
};
