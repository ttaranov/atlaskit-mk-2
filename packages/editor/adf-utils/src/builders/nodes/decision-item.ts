import { DecisionItemDefinition, Inline } from '@atlaskit/editor-common';

export const decisionItem = (attrs: DecisionItemDefinition['attrs']) => (
  ...content: Array<Inline>
): DecisionItemDefinition => ({
  type: 'decisionItem',
  attrs,
  content,
});
