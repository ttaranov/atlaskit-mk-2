import {
  TableRowDefinition,
  TableHeaderDefinition,
  TableCellDefinition,
} from '@atlaskit/editor-common';

export const tableRow = (
  content: Array<TableHeaderDefinition> | Array<TableCellDefinition>,
): TableRowDefinition => ({
  type: 'tableRow',
  content,
});
