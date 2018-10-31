import { StatusDefinition } from '@atlaskit/editor-common';

export const status = (
  attrs: StatusDefinition['attrs'] = {
    text: 'In progress',
    color: 'blue',
  },
): StatusDefinition => ({
  type: 'status',
  attrs,
});
