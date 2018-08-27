import {
  DecisionListDefinition,
  DecisionItemDefinition,
} from '@atlaskit/editor-common';

export const decisionList = (attrs: DecisionListDefinition['attrs']) => (
  ...content: Array<DecisionItemDefinition>
): DecisionListDefinition => ({
  type: 'decisionList',
  attrs,
  content,
});
