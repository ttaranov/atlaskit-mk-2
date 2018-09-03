import {
  ApplicationCardDefinition,
  BlockQuoteDefinition,
  BulletListDefinition,
  CodeBlockDefinition,
  DecisionListDefinition,
  ExtensionDefinition,
  HeadingDefinition,
  MediaGroupDefinition,
  MediaSingleDefinition,
  OrderedListDefinition,
  PanelDefinition,
  ParagraphDefinition,
  RuleDefinition,
  TaskListDefinition,
  BlockCardDefinition,
} from '@atlaskit/editor-common';

import { TableCellDefinition, CellAttributes } from '@atlaskit/editor-common';

export const tableCell = (attrs?: CellAttributes) => (
  ...content: TableCellDefinition['content']
): TableCellDefinition => ({
  type: 'tableCell',
  attrs,
  content: content,
});

export {
  ApplicationCardDefinition,
  BlockQuoteDefinition,
  BulletListDefinition,
  CodeBlockDefinition,
  DecisionListDefinition,
  ExtensionDefinition,
  HeadingDefinition,
  MediaGroupDefinition,
  MediaSingleDefinition,
  OrderedListDefinition,
  PanelDefinition,
  ParagraphDefinition,
  RuleDefinition,
  TaskListDefinition,
  BlockCardDefinition,
};
