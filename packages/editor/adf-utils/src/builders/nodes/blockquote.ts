import {
  ParagraphDefinition,
  BlockQuoteDefinition,
} from '@atlaskit/editor-common';

export const blockQuote = (
  ...content: Array<ParagraphDefinition>
): BlockQuoteDefinition => ({
  type: 'blockquote',
  content,
});
