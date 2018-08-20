import { BlockCardDefinition, CardAttributes } from '@atlaskit/editor-common';

export const blockCard = (attrs: CardAttributes): BlockCardDefinition => ({
  type: 'blockCard',
  attrs,
});
