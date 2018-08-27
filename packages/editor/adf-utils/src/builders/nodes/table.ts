import { TableDefinition, TableRowDefinition } from '@atlaskit/editor-common';

export const table = (
  ...content: Array<TableRowDefinition>
): TableDefinition => ({
  type: 'table',
  content,
});
