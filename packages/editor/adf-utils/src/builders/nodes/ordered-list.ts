import {
  ListItemDefinition,
  OrderedListDefinition,
} from '@atlaskit/editor-common';

export const orderedList = (attrs?: OrderedListDefinition['attrs']) => (
  ...content: Array<ListItemDefinition>
): OrderedListDefinition => ({
  type: 'orderedList',
  attrs,
  content,
});
