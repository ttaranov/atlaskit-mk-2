import { JSONDocNode, JSONNode } from '../../';
import { filterContentByType } from './filter';

const taskDecisionAllowedNodeTypes = new Set([
  'text',
  'emoji',
  'mention',
  'hardBreak',
]);

export const taskDecisionDocFilter = (doc: JSONDocNode): JSONNode[] =>
  filterContentByType(doc, taskDecisionAllowedNodeTypes);
