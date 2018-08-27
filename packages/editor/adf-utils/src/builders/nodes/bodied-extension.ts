import {
  ApplicationCardDefinition,
  BlockQuoteDefinition,
  BulletListDefinition,
  CodeBlockDefinition,
  OrderedListDefinition,
  DecisionListDefinition,
  DecisionItemDefinition,
  PanelDefinition,
  ParagraphDefinition,
  RuleDefinition,
  TaskListDefinition,
  TaskItemDefinition,
  ExtensionDefinition,
  HeadingDefinition,
  MediaGroupDefinition,
  MediaSingleDefinition,
  TableDefinition,
  BlockCardDefinition,
} from '@atlaskit/editor-common';

import {
  BodiedExtensionDefinition,
  ExtensionContent,
} from '@atlaskit/editor-common';

export const bodiedExtension = (attrs: BodiedExtensionDefinition['attrs']) => (
  ...content: ExtensionContent
): BodiedExtensionDefinition => ({
  type: 'bodiedExtension',
  attrs,
  content,
});

export {
  ApplicationCardDefinition,
  BlockQuoteDefinition,
  BulletListDefinition,
  CodeBlockDefinition,
  OrderedListDefinition,
  DecisionListDefinition,
  DecisionItemDefinition,
  PanelDefinition,
  ParagraphDefinition,
  RuleDefinition,
  TaskListDefinition,
  TaskItemDefinition,
  ExtensionDefinition,
  HeadingDefinition,
  MediaGroupDefinition,
  MediaSingleDefinition,
  TableDefinition,
  BlockCardDefinition,
};
