import { DateDefinition } from '@atlaskit/editor-common';

export const date = (
  attrs: DateDefinition['attrs'] = { timestamp: '' },
): DateDefinition => ({
  type: 'date',
  attrs,
});
