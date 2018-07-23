import { Schema, Slice } from 'prosemirror-model';
import { JSONDocNode, JSONNode } from '../';
import { filterContentByType, filterSliceByType } from './filter';

const taskDecisionAllowedNodeTypes = new Set([
  'text',
  'emoji',
  'mention',
  'hardBreak',
]);

export const taskDecisionDocFilter = (
  doc: JSONDocNode,
  schema?: Schema,
): JSONNode[] =>
  filterContentByType(doc, taskDecisionAllowedNodeTypes, schema, true);

export const taskDecisionSliceFilter = (slice: Slice, schema: Schema): Slice =>
  filterSliceByType(slice, taskDecisionAllowedNodeTypes, schema, true);
