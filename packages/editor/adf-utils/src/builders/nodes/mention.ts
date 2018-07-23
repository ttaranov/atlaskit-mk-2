import { MentionDefinition, MentionAttributes } from '@atlaskit/editor-common';

export const mention = (attrs: MentionAttributes): MentionDefinition => ({
  type: 'mention',
  attrs: { accessLevel: '', ...attrs },
});
