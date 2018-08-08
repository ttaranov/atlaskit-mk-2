import { TableHeaderDefinition, CellAttributes } from '@atlaskit/editor-common';

export const tableHeader = (attrs?: CellAttributes) => (
  ...content: TableHeaderDefinition['content']
): TableHeaderDefinition => ({
  type: 'tableHeader',
  attrs,
  content: content,
});
