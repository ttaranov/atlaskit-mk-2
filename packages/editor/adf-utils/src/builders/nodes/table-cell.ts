import { TableCellDefinition, CellAttributes } from '@atlaskit/editor-common';

export const tableCell = (attrs?: CellAttributes) => (
  ...content: TableCellDefinition['content']
): TableCellDefinition => ({
  type: 'tableCell',
  attrs,
  content,
});
