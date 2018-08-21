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

import { TableHeaderDefinition, CellAttributes } from '@atlaskit/editor-common';

export const tableHeader = (attrs?: CellAttributes) => (
  ...content: TableHeaderDefinition['content']
): TableHeaderDefinition => ({
  type: 'tableHeader',
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
