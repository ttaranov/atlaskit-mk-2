import { NodeSpec } from 'prosemirror-model';

// Nodes
import { Definition as Panel } from './panel';
import { Definition as Paragraph } from './paragraph';
import { Definition as Blockquote } from './blockquote';
import { Definition as OrderedList } from './ordered-list';
import { Definition as BulletList } from './bullet-list';
import { Definition as Rule } from './rule';
import { Definition as Heading } from './heading';
import { Definition as CodeBlock } from './code-block';
import { Definition as MediaGroup } from './media-group';
import { Definition as MediaSingle } from './media-single';
import { Definition as ApplicationCard } from './applicationCard';
import { Definition as DecisionList } from './decision-list';
import { Definition as TaskList } from './task-list';
import { Table } from './tableNodes';
import { Definition as Extension } from './extension';
import { Definition as InlineExtension } from './inline-extension';
import { Definition as BodiedExtension } from './bodied-extension';

import { Definition as Text } from './text';
import { Definition as HardBreak } from './hard-break';
import { Definition as Mention } from './mention';
import { Definition as Emoji } from './emoji';
import { Definition as Date } from './date';
import { Definition as Placeholder } from './placeholder';

// Marks
import { Definition as Link } from '../marks/link';
import { Definition as Em } from '../marks/em';
import { Definition as Strong } from '../marks/strong';
import { Definition as Strike } from '../marks/strike';
import { Definition as Code } from '../marks/code';
import { Definition as SubSup } from '../marks/subsup';
import { Definition as Underline } from '../marks/underline';
import { Definition as TextColor } from '../marks/text-color';
import { Definition as Action } from '../marks/action';

/**
 * @name top_level_node
 * @minItems 1
 */
export type TopLevel = Array<
  | Panel
  | Paragraph
  | Blockquote
  | OrderedList
  | BulletList
  | Rule
  | Heading
  | CodeBlock
  | MediaGroup
  | MediaSingle
  | ApplicationCard
  | DecisionList
  | TaskList
  | Table
  | Extension
  | BodiedExtension
>;

/**
 * @name table_cell_content
 * @minItems 1
 */
export type TableCellContent = Array<
  | Panel
  | Paragraph
  | Blockquote
  | OrderedList
  | BulletList
  | Rule
  | Heading
  | CodeBlock
  | MediaGroup
  | MediaSingle
  | ApplicationCard
  | DecisionList
  | TaskList
  | Extension
>;

// exclude Extension and BodiedExtension
/**
 * @name extension_content
 * @minItems 1
 */
export type ExtensionContent = Array<
  | Panel
  | Paragraph
  | Blockquote
  | OrderedList
  | BulletList
  | Rule
  | Heading
  | CodeBlock
  | MediaGroup
  | MediaSingle
  | ApplicationCard
  | DecisionList
  | TaskList
  | Table
  | Extension
>;

/**
 * @additionalProperties true
 */
export interface MarksObject<T> {
  marks?: Array<T>;
}

/**
 * @additionalProperties true
 */
export interface NoMark {
  /**
   * @maxItems 0
   */
  marks?: Array<any>;
}

/**
 * @name formatted_text_inline_node
 */
export type InlineFormattedText = Text &
  MarksObject<
    Link | Em | Strong | Strike | SubSup | Underline | TextColor | Action
  >;

/**
 * @name link_text_inline_node
 */
export type InlineLinkText = Text & MarksObject<Link>;

/**
 * @name code_inline_node
 */
export type InlineCode = Text & MarksObject<Code | Link>;

/**
 * @name atomic_inline_node
 */
export type InlineAtomic =
  | HardBreak
  | Mention
  | Emoji
  | InlineExtension
  | Date
  | Placeholder;

/**
 * @name inline_node
 */
export type Inline = InlineFormattedText | InlineCode | InlineAtomic;

/**
 * @name doc_node
 */
export interface Doc {
  version: 1;
  type: 'doc';
  content: TopLevel;
}

export const doc: NodeSpec = {
  content: '(block|layoutSection)+',
};
