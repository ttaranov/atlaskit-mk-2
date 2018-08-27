import { TextDefinition } from '@atlaskit/editor-common';

export const text = (text: string): TextDefinition => ({
  type: 'text',
  text,
});
