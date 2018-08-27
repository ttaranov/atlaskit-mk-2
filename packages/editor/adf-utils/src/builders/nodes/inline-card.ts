import { InlineCardDefinition, CardAttributes } from '@atlaskit/editor-common';

export const inlineCard = (attrs: CardAttributes): InlineCardDefinition => ({
  type: 'inlineCard',
  attrs,
});
