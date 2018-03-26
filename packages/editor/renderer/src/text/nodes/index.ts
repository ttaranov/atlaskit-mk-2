import { Node as PMNode, Schema } from 'prosemirror-model';
import applicationCard from './applicationCard';
import blockquote from './blockquote';
import bulletList from './bulletList';
import hardBreak from './hardBreak';
import heading from './heading';
import listItem from './listItem';
import mediaGroup from './mediaGroup';
import orderedList from './orderedList';
import panel from './panel';
import paragraph from './paragraph';
import unknown from './unknown';

export interface ReducedNode {
  content?: ReducedNode[];
  text?: string;
}
export type NodeReducer = (node: PMNode, schema?: Schema) => ReducedNode;

export const nodeToReducerMapping: { [key: string]: NodeReducer } = {
  applicationCard,
  blockquote,
  bulletList,
  hardBreak,
  heading,
  listItem,
  mediaGroup,
  orderedList,
  panel,
  paragraph,
  unknown,
};
