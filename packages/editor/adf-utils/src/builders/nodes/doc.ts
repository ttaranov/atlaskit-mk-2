import {
  ApplicationCardDefinition,
  BlockQuoteDefinition,
  BodiedExtensionDefinition,
  BulletListDefinition,
  CodeBlockDefinition,
  DecisionItemDefinition,
  DecisionListDefinition,
  ExtensionDefinition,
  HeadingDefinition,
  MediaGroupDefinition,
  MediaSingleDefinition,
  OrderedListDefinition,
  PanelDefinition,
  ParagraphDefinition,
  RuleDefinition,
  TableDefinition,
  TaskItemDefinition,
  TaskListDefinition,
  BlockCardDefinition,
} from '@atlaskit/editor-common';

import { DocNode, DocContent } from '@atlaskit/editor-common';

export const doc = (...content: DocContent): DocNode => ({
  type: 'doc',
  version: 1,
  content,
});

export {
  ApplicationCardDefinition,
  BlockQuoteDefinition,
  BodiedExtensionDefinition,
  BulletListDefinition,
  CodeBlockDefinition,
  DecisionItemDefinition,
  DecisionListDefinition,
  ExtensionDefinition,
  HeadingDefinition,
  MediaGroupDefinition,
  MediaSingleDefinition,
  OrderedListDefinition,
  PanelDefinition,
  ParagraphDefinition,
  RuleDefinition,
  TableDefinition,
  TaskItemDefinition,
  TaskListDefinition,
  BlockCardDefinition,
};
